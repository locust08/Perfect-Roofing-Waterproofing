# Perfect Roofting architecture

Date: 2026-09-23

## Current architecture

```text
Astro 5
↓
Static build (`npm run build`)
↓
Cloudflare Worker: `perfect-roofting`
↓
Workers Static Assets (`dist/`)
```

Astro remains in static-output mode. The Worker has no JavaScript entry point and no bindings; Cloudflare serves the generated files directly. Unknown paths use Astro's generated `404.html` and return HTTP 404. There is no project-owned API, database, queue, object store, or CMS.

The current `workers.dev` deployment is a technical preview/staging environment. It is not production and has no production custom domain or DNS route.

## Environment boundaries

### Local development

Used for code changes, component work, and local QA. Astro's development server runs only on the developer machine. Local work must not use production secrets or production data.

### Preview/staging

The `perfect-roofting` Worker at its `workers.dev` URL is used to verify Cloudflare asset routing, future form/backend behaviour, Turnstile, analytics, and client/internal review. Test submissions must use designated test data once a backend exists.

### Production

Production remains unconfigured. It will be created or connected only after technical QA, the visual revamp, owner verification of business information, and client/internal approval. The production Worker/environment name and final domain are **TBC — owner confirmation required**. Production must be isolated from preview/staging deployments.

## Planned enquiry architecture

This is a design boundary only; no backend is implemented yet.

```text
Visitor
↓
Astro frontend
↓
POST form endpoint
↓
Turnstile verification
↓
Server-side validation
↓
Rate limiting
↓
Lead attribution
↓
Lead storage and/or notification
```

The browser must send personal data in a POST body, never in URL query parameters. The server will reject invalid or automated requests before storage or notification.

## Configuration and secrets

Public values may be exposed to browser code; private values must exist only in Doppler, Cloudflare secrets, or another approved server-side secret store.

| Future value | Exposure | Status |
| --- | --- | --- |
| Turnstile site key | Public browser configuration | Not created for this project |
| Turnstile secret | Private server secret | Not created for this project |
| Resend or alternative mail API credential | Private server secret | Provider/credential TBC |
| Lead notification recipient | Private operational configuration | Recipient TBC |
| PostHog host/project token | Public browser configuration when approved | Project/configuration TBC |
| PostHog personal/admin keys | Private server secret | Not required by the browser |
| GTM container ID | Public browser configuration when approved | Container TBC |
| Future database/storage identifiers | Server configuration | No database or storage selected |
| Future database/storage credentials | Private server secret | Not applicable yet |

The current shell can access an authenticated Doppler project whose runtime config classifies as development-like, but this repository has no directory-scoped Doppler project/config selection. Do not rely on the shared implicit scope for deployment. Before backend or analytics work, the owner must confirm the dedicated Perfect Roofting Doppler project and the development/staging config names.

## Deliberately absent

- Server-side form endpoint
- Turnstile and rate limiting
- Lead storage or notifications
- D1, R2, KV, Queues, or Durable Objects
- Analytics and tag-manager code
- Production Worker, custom domain, or DNS route

