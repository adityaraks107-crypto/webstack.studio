import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from './app.js';

const configuredEnv = {
  RESEND_API_KEY: 're_test_only_mocked',
  CONTACT_FROM_EMAIL: 'WebStack Studio <enquiries@webstack.example.com>',
  CONTACT_TO_EMAIL: 'wildcyrus107@gmail.com'
};
const validEnquiry = {
  name: 'Test Customer', email: 'customer@example.com', phone: '+91 98982 21976',
  business: 'Example Co', projectType: 'Business Website', budget: '₹10,000–₹25,000',
  description: 'A website for a small business.', requirements: 'Accessible contact form.'
};

async function withApi(options, callback) {
  const server = createApp(options).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  try {
    await callback(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

test('health endpoint responds without exposing email configuration', async () => {
  await withApi({}, async base => {
    const response = await fetch(`${base}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
  });
});

test('required fields and email addresses are validated before sending', async () => {
  let sendCount = 0;
  await withApi({ env: configuredEnv, emailSender: async () => { sendCount += 1; return { data: { id: 'mock' } }; } }, async base => {
    const empty = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
    assert.equal(empty.status, 400);
    assert.match((await empty.json()).error, /required fields/i);
    const malformed = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...validEnquiry, email: 'bad-address' }) });
    assert.equal(malformed.status, 400);
    assert.match((await malformed.json()).error, /valid email/i);
    assert.equal(sendCount, 0);
  });
});

test('missing Resend settings return 503 and never invoke email sending', async () => {
  await withApi({ env: {}, emailSender: async () => assert.fail('email sender must not run') }, async base => {
    const response = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(validEnquiry) });
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /not configured/i);
  });
});

test('honeypot submissions are rejected', async () => {
  await withApi({ env: configuredEnv, emailSender: async () => assert.fail('spam must not be sent') }, async base => {
    const response = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...validEnquiry, websiteUrl: 'https://spam.example' }) });
    assert.equal(response.status, 400);
  });
});

test('per-IP limit returns 429 with Retry-After', async () => {
  await withApi({ env: {} }, async base => {
    let response;
    for (let i = 0; i < 6; i += 1) {
      response = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({}) });
    }
    assert.equal(response.status, 429);
    assert.ok(Number(response.headers.get('retry-after')) > 0);
  });
});

test('Resend rejection returns 502, not a success response', async () => {
  const logged = [];
  await withApi({
    env: configuredEnv,
    logger: { error: (...args) => logged.push(args) },
    emailSender: async () => ({ data: null, error: { name: 'invalid_from_address', message: 'Private provider detail' } })
  }, async base => {
    const response = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(validEnquiry) });
    assert.equal(response.status, 502);
    assert.equal((await response.json()).ok, undefined);
    assert.equal(JSON.stringify(logged).includes('Private provider detail'), false);
  });
});

test('accepted email uses configured addresses, Reply-To, timestamp, and escaped branded HTML', async () => {
  let sentMessage;
  const fixedNow = () => new Date('2026-11-13T12:00:00.000Z');
  await withApi({
    env: configuredEnv,
    now: fixedNow,
    emailSender: async message => { sentMessage = message; return { data: { id: 'email_mock_id' }, error: null }; }
  }, async base => {
    const response = await fetch(`${base}/api/contact`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...validEnquiry, name: '<script>alert(1)</script>' })
    });
    assert.equal(response.status, 202);
    assert.equal((await response.json()).ok, true);
    assert.deepEqual(sentMessage.to, ['wildcyrus107@gmail.com']);
    assert.equal(sentMessage.replyTo, validEnquiry.email);
    assert.match(sentMessage.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.doesNotMatch(sentMessage.html, /<script>alert/);
    assert.match(sentMessage.html, /New WebStack Studio project enquiry|NEW PROJECT ENQUIRY/);
    assert.match(sentMessage.html, /13 November 2026 at 5:30 pm \(IST\)/);
    assert.match(sentMessage.text, /A website for a small business/);
  });
});

test('Gmail cannot be configured as the sending identity', async () => {
  await withApi({ env: { ...configuredEnv, CONTACT_FROM_EMAIL: 'WebStack Studio <business@gmail.com>' } }, async base => {
    const response = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(validEnquiry) });
    assert.equal(response.status, 503);
  });
});
