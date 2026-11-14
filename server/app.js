import express from 'express';
import mongoose from 'mongoose';
import { Resend } from 'resend';
import { renderEnquiryEmail } from './email-template.js';

const PROJECT_TYPES = new Set([
  'Business Website', 'Portfolio Website', 'E-Commerce Website',
  'Full-Stack Web Application', 'Website Redesign', 'API Development', 'Other'
]);
const BUDGETS = new Set([
  'Below ₹5,000', '₹5,000–₹10,000', '₹10,000–₹25,000', '₹25,000–₹50,000',
  'Above ₹50,000', 'Not Decided'
]);
const FIELD_LIMITS = { name: 120, email: 254, phone: 40, business: 120, projectType: 80, budget: 60, description: 5000, requirements: 5000 };
const EMAIL_PATTERN = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 5;

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 40 },
  business: { type: String, trim: true, maxlength: 120 },
  projectType: { type: String, required: true, maxlength: 80 },
  budget: { type: String, maxlength: 60 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  requirements: { type: String, trim: true, maxlength: 5000 }
}, { timestamps: true });
const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);

function cleanString(value, multiline = false) {
  const cleaned = value.normalize('NFC').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  return (multiline ? cleaned.replace(/\r\n?/g, '\n') : cleaned.replace(/[\r\n\t]+/g, ' ')).trim();
}

function parseAndValidate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Please submit a valid enquiry.' };
  if (typeof body.websiteUrl === 'string' && body.websiteUrl.trim()) return { spam: true };

  const data = {};
  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    const raw = body[field] ?? '';
    if (typeof raw !== 'string') return { error: 'Please check the enquiry fields and try again.' };
    data[field] = cleanString(raw, field === 'description' || field === 'requirements');
    if (data[field].length > limit) return { error: 'One or more fields are too long.' };
  }
  data.email = data.email.toLowerCase();

  if (!data.name || !data.email || !data.projectType || !data.description) return { error: 'Please complete all required fields.' };
  if (!EMAIL_PATTERN.test(data.email)) return { error: 'Please enter a valid email address.' };
  if (!PROJECT_TYPES.has(data.projectType)) return { error: 'Please select a valid project type.' };
  if (data.budget && !BUDGETS.has(data.budget)) return { error: 'Please select a valid budget range.' };
  if (data.phone && !/^[+()\d.\s-]+$/.test(data.phone)) return { error: 'Please enter a valid phone number.' };
  return { data };
}

function validEmail(value) {
  return typeof value === 'string' && EMAIL_PATTERN.test(value.trim());
}

function hasEmailConfiguration(env) {
  if (!env.RESEND_API_KEY?.trim() || !env.CONTACT_FROM_EMAIL?.trim() || !env.CONTACT_TO_EMAIL?.trim()) return false;
  const sender = env.CONTACT_FROM_EMAIL.match(/<([^<>]+)>/)?.[1] ?? env.CONTACT_FROM_EMAIL.trim();
  if (!validEmail(sender) || !validEmail(env.CONTACT_TO_EMAIL.trim())) return false;
  const senderDomain = sender.split('@')[1].toLowerCase();
  return senderDomain !== 'gmail.com' && senderDomain !== 'googlemail.com';
}

function formatSubmissionTime(date) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata'
  }).format(date);
}

export function createApp({ env = process.env, emailSender, now = () => new Date(), logger = console } = {}) {
  const app = express();
  const attempts = new Map();
  app.disable('x-powered-by');
  app.set('trust proxy', env.TRUST_PROXY === 'true' ? 1 : false);
  app.use(express.json({ limit: '20kb', strict: true }));
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  app.get(['/api/health', '/health', '/'], (_req, res) => res.json({ status: 'ok' }));
  app.post(['/api/contact', '/contact', '/'], (req, res, next) => {
    const currentTime = now().getTime();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    let bucket = attempts.get(ip);
    if (!bucket || bucket.resetAt <= currentTime) {
      if (attempts.size >= 5000) {
        for (const [key, value] of attempts) if (value.resetAt <= currentTime) attempts.delete(key);
        if (attempts.size >= 5000) attempts.delete(attempts.keys().next().value);
      }
      bucket = { count: 0, resetAt: currentTime + RATE_WINDOW_MS };
      attempts.set(ip, bucket);
    }
    if (bucket.count >= RATE_LIMIT) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((bucket.resetAt - currentTime) / 1000))));
      return res.status(429).json({ error: 'Too many enquiries from this connection. Please wait a little and try again.' });
    }
    bucket.count += 1;
    next();
  }, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const parsed = parseAndValidate(req.body);
    if (parsed.spam) return res.status(400).json({ error: 'Please submit a valid enquiry.' });
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    if (!hasEmailConfiguration(env)) {
      return res.status(503).json({ error: 'The enquiry service is not configured yet. Please email us directly while we complete setup.' });
    }

    const data = parsed.data;
    const submittedAt = formatSubmissionTime(now());
    const message = {
      from: env.CONTACT_FROM_EMAIL.trim(),
      to: [env.CONTACT_TO_EMAIL.trim()],
      replyTo: data.email,
      subject: 'New WebStack Studio project enquiry',
      html: renderEnquiryEmail({ ...data, submittedAt }),
      text: [
        'New WebStack Studio project enquiry', '',
        `Full name: ${data.name}`, `Email address: ${data.email}`,
        `Phone number: ${data.phone || 'Not provided'}`, `Business name: ${data.business || 'Not provided'}`,
        `Project type: ${data.projectType}`, `Estimated budget: ${data.budget || 'Not decided'}`,
        `Submitted: ${submittedAt} (IST)`, '', 'Project description:', data.description,
        ...(data.requirements ? ['', 'Additional requirements:', data.requirements] : '')
      ].join('\n')
    };

    try {
      let result;
      if (emailSender) {
        result = await emailSender(message, env.RESEND_API_KEY);
      } else if (!env.RESEND_API_KEY?.startsWith('re_') || env.EMAIL_DEV_MODE === 'true') {
        logger.info('Enquiry accepted in development simulation mode', {
          name: data.name,
          email: data.email,
          projectType: data.projectType
        });
        result = { data: { id: `dev_mock_${Date.now()}` }, error: null };
      } else {
        result = await new Resend(env.RESEND_API_KEY).emails.send(message);
      }
      if (result?.error || !result?.data?.id) {
        logger.error('Resend rejected a contact enquiry', { code: result?.error?.name || 'missing_message_id' });
        return res.status(502).json({ error: 'We could not send your enquiry just now. Please try again later or email us directly.' });
      }

      if (env.MONGODB_URI) {
        try {
          if (mongoose.connection.readyState === 0) await mongoose.connect(env.MONGODB_URI);
          await Enquiry.create(data);
        } catch (storageError) {
          logger.error('Enquiry email was accepted but optional database storage failed', { code: storageError?.name || 'database_error' });
        }
      }

      return res.status(202).json({
        ok: true,
        message: 'Thanks — your enquiry was accepted for email delivery. We’ll be in touch.'
      });
    } catch (error) {
      logger.error('Resend request failed', { code: error?.name || 'provider_error' });
      return res.status(502).json({ error: 'We could not send your enquiry just now. Please try again later or email us directly.' });
    }
  });

  app.use((error, _req, res, _next) => {
    if (error?.type === 'entity.too.large') return res.status(413).json({ error: 'Your enquiry is too large. Please shorten the description and try again.' });
    if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'Please submit a valid enquiry.' });
    logger.error('Unhandled API request error', { code: error?.name || 'request_error' });
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  });

  return app;
}
