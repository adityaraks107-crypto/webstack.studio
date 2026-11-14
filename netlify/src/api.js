import { Resend } from 'resend';

// Inline email template to avoid cross-module imports in serverless
function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

function row(label, value) {
  return `<tr><td style="width:155px;padding:13px 16px;border-bottom:1px solid #203750;color:#9fb4c9;font:600 12px Arial,sans-serif;vertical-align:top">${escapeHtml(label)}</td><td style="padding:13px 16px;border-bottom:1px solid #203750;color:#f2f7fc;font:14px/1.6 Arial,sans-serif;vertical-align:top;word-break:break-word">${escapeHtml(value || 'Not provided')}</td></tr>`;
}

function renderEnquiryEmail(enquiry) {
  const { name, email, phone, business, projectType, budget, description, requirements, submittedAt } = enquiry;
  const safeDescription = escapeHtml(description).replace(/\r?\n/g, '<br>');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>New WebStack Studio enquiry</title></head>
<body style="margin:0;padding:24px 12px;background:#071426;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;margin:0 auto;background:#0b1d33;border:1px solid #1d3a59;border-radius:12px;overflow:hidden">
    <tr><td style="padding:28px 30px;background:linear-gradient(120deg,#0a2a4c,#0b1d33);border-bottom:1px solid #1d3a59">
      <div style="display:inline-block;padding:7px 10px;border:1px solid #087bde;border-radius:8px;color:#fff;font:bold 16px Arial,sans-serif">W<span style="color:#00c8ff">S</span></div>
      <span style="margin-left:10px;color:#f2f7fc;font:bold 16px Arial,sans-serif;vertical-align:middle">WebStack Studio</span>
      <div style="margin-top:24px;color:#65d9ff;font:bold 10px Arial,sans-serif;letter-spacing:2px">NEW PROJECT ENQUIRY</div>
      <h1 style="margin:10px 0 0;color:#fff;font:bold 25px/1.25 Arial,sans-serif">A new idea is taking shape.</h1>
    </td></tr>
    <tr><td style="padding:20px 18px 4px"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      ${row('Full name', name)}${row('Email address', email)}${row('Phone number', phone)}${row('Business name', business)}${row('Project type', projectType)}${row('Estimated budget', budget)}${row('Submitted', `${submittedAt} (IST)`)}
      <tr><td colspan="2" style="padding:18px 16px 8px;color:#62d4ff;font:bold 11px Arial,sans-serif;letter-spacing:1px">PROJECT DESCRIPTION</td></tr>
      <tr><td colspan="2" style="padding:0 16px 18px;color:#f2f7fc;font:14px/1.8 Arial,sans-serif;word-break:break-word">${safeDescription}</td></tr>
      ${requirements ? `<tr><td colspan="2" style="padding:0 16px 18px;color:#f2f7fc;font:14px/1.8 Arial,sans-serif">${escapeHtml(requirements).replace(/\r?\n/g,'<br>')}</td></tr>` : ''}
    </table></td></tr>
    <tr><td style="padding:18px 30px 24px;color:#8298af;font:11px/1.6 Arial,sans-serif;border-top:1px solid #203750">Reply to this email to respond directly to ${escapeHtml(name)}.<br>WebStack Studio · We Build. You Grow.</td></tr>
  </table>
</body></html>`;
}

const PROJECT_TYPES = new Set([
  'Business Website', 'Portfolio Website', 'E-Commerce Website',
  'Full-Stack Web Application', 'Website Redesign', 'API Development', 'Other'
]);
const BUDGETS = new Set([
  'Below ₹5,000', '₹5,000–₹10,000', '₹10,000–₹25,000', '₹25,000–₹50,000',
  'Above ₹50,000', 'Not Decided'
]);
const EMAIL_PATTERN = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;

export default async (req) => {
  const url = new URL(req.url);

  if (url.pathname.endsWith('/health')) {
    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (url.pathname.endsWith('/contact') && req.method === 'POST') {
    try {
      const body = await req.json();
      if (!body.name || !body.email || !body.projectType || !body.description) {
        return new Response(JSON.stringify({ error: 'Please complete all required fields.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (!EMAIL_PATTERN.test(body.email)) {
        return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (!PROJECT_TYPES.has(body.projectType)) {
        return new Response(JSON.stringify({ error: 'Please select a valid project type.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (body.websiteUrl) {
        return new Response(JSON.stringify({ error: 'Invalid submission' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const submittedAt = new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata'
      }).format(new Date());

      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL || 'WebStack Studio <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO_EMAIL || 'wildcyrus107@gmail.com'],
        replyTo: body.email,
        subject: 'New WebStack Studio project enquiry',
        html: renderEnquiryEmail({ ...body, submittedAt }),
        text: `New WebStack Studio enquiry\n\nName: ${body.name}\nEmail: ${body.email}\nPhone: ${body.phone || 'Not provided'}\nBusiness: ${body.business || 'Not provided'}\nProject: ${body.projectType}\nBudget: ${body.budget || 'Not decided'}\n\nDescription:\n${body.description}`
      });

      if (error || !data?.id) {
        return new Response(JSON.stringify({ error: 'We could not send your enquiry just now.' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        ok: true,
        message: 'Thanks — your enquiry was accepted for email delivery. We’ll be in touch.'
      }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Failed to process enquiry' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Not found', { status: 404 });
};
