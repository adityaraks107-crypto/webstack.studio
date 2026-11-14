export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function row(label, value) {
  return `<tr>
    <td style="width:155px;padding:13px 16px;border-bottom:1px solid #203750;color:#9fb4c9;font:600 12px Arial,sans-serif;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:13px 16px;border-bottom:1px solid #203750;color:#f2f7fc;font:14px/1.6 Arial,sans-serif;vertical-align:top;word-break:break-word">${escapeHtml(value || 'Not provided')}</td>
  </tr>`;
}

export function renderEnquiryEmail(enquiry) {
  const { name, email, phone, business, projectType, budget, description, requirements, submittedAt } = enquiry;
  const safeDescription = escapeHtml(description).replace(/\r?\n/g, '<br>');
  const safeRequirements = requirements
    ? `<tr><td style="padding:16px;border-bottom:1px solid #203750;color:#9fb4c9;font:600 12px Arial,sans-serif;vertical-align:top">Additional requirements</td><td style="padding:16px;border-bottom:1px solid #203750;color:#f2f7fc;font:14px/1.7 Arial,sans-serif;vertical-align:top;word-break:break-word">${escapeHtml(requirements).replace(/\r?\n/g, '<br>')}</td></tr>`
    : '';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New WebStack Studio enquiry</title></head>
<body style="margin:0;padding:24px 12px;background:#071426;color:#f2f7fc;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;margin:0 auto;background:#0b1d33;border:1px solid #1d3a59;border-radius:12px;overflow:hidden">
    <tr><td style="padding:28px 30px;background:linear-gradient(120deg,#0a2a4c,#0b1d33);border-bottom:1px solid #1d3a59">
      <div style="display:inline-block;padding:7px 10px;border:1px solid #087bde;border-radius:8px;color:#fff;font:bold 16px Arial,sans-serif">W<span style="color:#00c8ff">S</span></div>
      <span style="margin-left:10px;color:#f2f7fc;font:bold 16px Arial,sans-serif;vertical-align:middle">WebStack Studio</span>
      <div style="margin-top:24px;color:#65d9ff;font:bold 10px Arial,sans-serif;letter-spacing:2px">NEW PROJECT ENQUIRY</div>
      <h1 style="margin:10px 0 0;color:#fff;font:bold 25px/1.25 Arial,sans-serif">A new idea is taking shape.</h1>
      <p style="margin:8px 0 0;color:#aabbd0;font:14px/1.6 Arial,sans-serif">A visitor has submitted the WebStack Studio project form.</p>
    </td></tr>
    <tr><td style="padding:20px 18px 4px"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      ${row('Full name', name)}${row('Email address', email)}${row('Phone number', phone)}${row('Business name', business)}${row('Project type', projectType)}${row('Estimated budget', budget)}${row('Submitted', `${submittedAt} (IST)`)}
      <tr><td colspan="2" style="padding:18px 16px 8px;color:#62d4ff;font:bold 11px Arial,sans-serif;letter-spacing:1px">PROJECT DESCRIPTION</td></tr>
      <tr><td colspan="2" style="padding:0 16px 18px;color:#f2f7fc;font:14px/1.8 Arial,sans-serif;word-break:break-word">${safeDescription}</td></tr>
      ${safeRequirements}
    </table></td></tr>
    <tr><td style="padding:18px 30px 24px;color:#8298af;font:11px/1.6 Arial,sans-serif;border-top:1px solid #203750">Reply to this email to respond directly to ${escapeHtml(name)}.<br>WebStack Studio · We Build. You Grow.</td></tr>
  </table>
</body></html>`;
}

export function renderTestEmail(sentAt) {
  return `<!doctype html><html lang="en"><body style="margin:0;padding:28px;background:#071426;color:#f2f7fc;font-family:Arial,sans-serif">
    <div style="max-width:580px;margin:auto;padding:28px;background:#0b1d33;border:1px solid #1d3a59;border-radius:12px">
      <div style="font:bold 16px Arial,sans-serif">WebStack <span style="color:#00c8ff">Studio</span></div>
      <p style="margin:22px 0 8px;color:#65d9ff;font:bold 10px Arial,sans-serif;letter-spacing:2px">CONFIGURATION TEST</p>
      <h1 style="font:bold 24px Arial,sans-serif">Your Resend email setup is working.</h1>
      <p style="color:#aabbd0;font:14px/1.7 Arial,sans-serif">This test message was sent to the configured contact inbox from your configured sender address.</p>
      <p style="color:#8298af;font:12px Arial,sans-serif">Tested at ${escapeHtml(sentAt)} (IST)</p>
    </div></body></html>`;
}
