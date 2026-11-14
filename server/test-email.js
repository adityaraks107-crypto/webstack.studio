import 'dotenv/config';
import { Resend } from 'resend';
import { renderTestEmail } from './email-template.js';

const required = ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_TO_EMAIL'];
const missing = required.filter(name => !process.env[name]?.trim());
if (missing.length) {
  console.error(`Email test is not configured. Set: ${missing.join(', ')}`);
  process.exit(1);
}
if (process.env.EMAIL_TEST_MODE !== 'true') {
  console.error('Set EMAIL_TEST_MODE=true in .env to explicitly allow a test message to the configured contact inbox.');
  process.exit(1);
}

const sender = process.env.CONTACT_FROM_EMAIL.match(/<([^<>]+)>/)?.[1] ?? process.env.CONTACT_FROM_EMAIL.trim();
if (/@(?:gmail|googlemail)\.com$/i.test(sender)) {
  console.error('CONTACT_FROM_EMAIL must use a sender address on your Resend-verified domain.');
  process.exit(1);
}

const sentAt = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata'
}).format(new Date());
const resend = new Resend(process.env.RESEND_API_KEY);

try {
  const { data, error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL,
    to: [process.env.CONTACT_TO_EMAIL],
    replyTo: process.env.CONTACT_TO_EMAIL,
    subject: '[TEST] WebStack Studio Resend configuration',
    html: renderTestEmail(sentAt),
    text: `WebStack Studio Resend test. This test was addressed to ${process.env.CONTACT_TO_EMAIL}. Sent at ${sentAt} (IST).`
  });
  if (error || !data?.id) {
    console.error(`Resend rejected the test message (${error?.name || 'no message ID'}). Check Resend Logs and your domain/API key settings.`);
    process.exitCode = 1;
  } else {
    console.log(`Resend accepted the test message. ID: ${data.id}`);
    console.log(`Check ${process.env.CONTACT_TO_EMAIL} and the Resend Emails dashboard to confirm receipt.`);
  }
} catch (error) {
  console.error(`Could not send the test message (${error?.name || 'provider error'}). Check your configuration and Resend Logs.`);
  process.exitCode = 1;
}
