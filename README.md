# WebStack Studio

A responsive React website and Express enquiry API. Contact enquiries are sent by the official Resend Node.js SDK from the backend; no Resend credential is included in the frontend.

## Requirements

- Node.js 20 or newer
- pnpm (or npm, using the matching `npm run` commands)
- A Resend account and API key; a sending domain verified for production email
- MongoDB is optional and is used only to persist enquiries

## Resend setup

1. In the Resend dashboard, open **Domains**, add a domain you own, and select the region appropriate for your account.
2. Add the DNS records Resend displays at your DNS provider. Resend requires sending authentication records such as DKIM and SPF; copy the exact names and values from your dashboard because they are domain-specific. DMARC is recommended.
3. Return to Resend and wait until the domain's **sending** status is verified. Domain verification and DNS propagation can take time.
4. Create an API key in Resend with permission to send email. Keep the key private.
5. `onboarding@resend.dev` is the development sender in `.env.example`. For production, set `CONTACT_FROM_EMAIL` to an address on your own sending-verified domain, for example `WebStack Studio <enquiries@your-domain.example>`. Replace the example domain with your own verified domain. Do not use a Gmail address as the sender.
6. Set `CONTACT_TO_EMAIL` to the inbox where you want enquiry notifications (for example, `wildcyrus107@gmail.com`). The submitting customer's validated email is assigned to `replyTo`.

The app cannot inspect your Resend dashboard or verify your domain/API key. The backend checks that all three mail settings exist and refuses Gmail sender addresses, but Resend remains the authority for domain verification and sender acceptance.

## Local development

1. Install packages: `pnpm install` (or `npm install`).
2. Copy `.env.example` to `.env`, then enter your private `RESEND_API_KEY`, a valid `CONTACT_FROM_EMAIL`, and your receiving inbox in `CONTACT_TO_EMAIL`. The example leaves the API key and recipient blank and uses Resend's development sender; use a sender on your verified domain for production.
3. Start the API in one terminal: `pnpm run server` (or `npm run server`). It listens at `http://127.0.0.1:4000` by default.
4. Start Vite in another terminal: `pnpm run dev` (or `npm run dev`). It listens at `http://127.0.0.1:5173` and proxies `/api` to the backend.
5. Open `http://127.0.0.1:5173`.

For a hosted preview that requires listening on all interfaces, set `HOST=0.0.0.0` in the backend environment and pass an appropriate Vite `--host 0.0.0.0` option for that environment. Keep local development bound to loopback.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Private Resend API key; backend only. |
| `CONTACT_FROM_EMAIL` | Yes | Sender on a sending-verified Resend domain; never Gmail. |
| `CONTACT_TO_EMAIL` | Yes | Notification inbox you control; set this in your local `.env`. |
| `PORT` | No | Express port, default `4000`. |
| `HOST` | No | Express bind address, default `127.0.0.1`. |
| `EMAIL_TEST_MODE` | Only for test command | Must be `true` to explicitly allow a test email to the configured contact inbox. |
| `TRUST_PROXY` | No | Set `true` only behind exactly one trusted reverse proxy so IP-based rate limiting uses the client IP. |
| `MONGODB_URI` | No | Optional enquiry persistence. Email sending does not require MongoDB. |

`.env` and `.env.*` files are ignored by Git; `.env.example` is the only environment file intended for version control. Never put the Resend key in a `VITE_` variable or any frontend file.

## Safe email test

The explicit test command sends a fixed, clearly marked `[TEST]` message only to `CONTACT_TO_EMAIL`; it does not use customer data. It prints the Resend message ID, not the API key.

1. Configure the three required Resend variables in `.env` and verify the sender domain in the dashboard.
2. Temporarily set `EMAIL_TEST_MODE=true` in `.env`.
3. Run `pnpm run test:email` (or `npm run test:email`).
4. Check the Resend **Emails** dashboard and the `CONTACT_TO_EMAIL` inbox, including spam. A Resend message ID means the API accepted the request; confirm actual receipt before considering email delivery verified.
5. Set `EMAIL_TEST_MODE=false` again.

The website endpoint returns `202` only after Resend returns a message ID, `400` for invalid input, `429` when the per-IP limit is exceeded, `502` when Resend rejects or cannot accept the request, and `503` when email configuration is missing/invalid. It never returns success for an email-provider rejection.

## Checks

- `pnpm test` runs API tests with a mocked email sender. It sends no real email and requires no API key.
- `pnpm run build` builds the frontend.
- `GET /api/health` checks whether the Express process is up.

## Deployment

- Set the environment variables in the backend host's secret/environment settings; never commit `.env`.
- Deploy the Express API to Render or another Node.js host. If behind one trusted proxy, set `TRUST_PROXY=true`.
- Deploy the Vite frontend to Vercel and configure its `/api/:path*` rewrite to the Express service, or use an equivalent same-origin proxy. Set the production API target in the Vite deployment configuration.
- Add a managed MongoDB URI only if enquiry persistence is wanted.
- In Resend, confirm domain sending status, inspect the **Emails** logs after test sends, and verify that a test arrives at the receiving inbox.

## GitHub setup

Create an empty repository in GitHub, then from this folder run `git init`, `git add .`, `git commit -m "Build WebStack Studio website"`, `git branch -M main`, `git remote add origin <repository-url>`, and `git push -u origin main`.

## Notes

- Portfolio tiles are original CSS-rendered demo concepts, labelled as such.
- Pricing is quote-based rather than hard-coded.
- Privacy and terms pages are a concise starting point; review them against actual business practices before launch.
- The WS mark is rendered as editable text/CSS in `src/App.jsx` and can be replaced with a supplied logo asset.
