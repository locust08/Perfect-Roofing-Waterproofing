# Perfect Roofing & Waterproofing pre-revamp audit

Date: 2026-09-23

This document records the inherited baseline before technical foundation work. It is an inventory, not an implementation change. The current appearance, business copy, legacy files, and static Astro architecture remain unchanged.

## Verified baseline

- Runtime: Node.js 22.23.1
- Package manager: npm 10.9.8 using `package-lock.json`
- Astro: 5.18.1
- Output mode: static
- Build command: `npm run build`
- Build result: successful; 22 pages generated
- Baseline branch: `main`
- Working branch: `revamp-foundation`

## Identified issues

| Area | Baseline finding | Constraint for later work |
| --- | --- | --- |
| Rendering | Astro currently produces a static build in `dist/`. | Keep Astro and static output unless a concrete server-rendering requirement appears. |
| Forms | Contact and appointment forms have no working project-owned backend. | A server-side submission endpoint is required before the forms can collect real enquiries safely. |
| Personal data | Existing form submissions use the browser default GET behaviour/query parameters. | Names, phone numbers, email addresses, and messages must not remain in URL query strings. |
| Dependencies | The clean install reports dependency vulnerabilities. | Assess each advisory before applying updates; do not use a forced major upgrade as a blanket fix. |
| Version control | No Git baseline existed before this work began. | The original import and the safety-ignore baseline are preserved on `main`. |
| Application services | No project-owned API, backend, or CMS integration exists. | Add only the minimum services required by approved features. |
| Deployment | No Cloudflare deployment configuration exists in the baseline. | Add Workers Static Assets configuration without changing DNS or an existing production deployment. |
| Domain | Production URLs are hardcoded to the previous Boon Chye domain in site metadata and infrastructure files. | Replacement domain is **TBC — production domain required**; do not invent one. |
| Media | The repository contains large image files and duplicated image trees under `images/` and `public/images/`. | Measure usage and compare hashes before cleanup or optimization. |
| Legacy frontend | Webflow-generated CSS/JavaScript and jQuery-era resources remain in the project. | Classify usage before removing or replacing them. |
| Accessibility | Forms and inherited templates contain label, semantics, focus, heading, and alternative-text issues requiring a dedicated audit. | Prioritize functional accessibility fixes without changing the visual design prematurely. |
| SEO/legal | Sitemap, canonical, redirect, and legal-page coverage require verification. | Preserve current behaviour until the final domain and business requirements are confirmed. |
| Business information | Company identity, service claims, contact details, legal text, and geographic coverage have not been owner-verified for Perfect Roofing & Waterproofing. | Obtain owner approval before changing or publishing business content. |

## Security handling

- `.env`, `.env.*`, `.dev.vars`, Wrangler state, logs, and platform metadata are excluded from Git; `.env.example` may be committed when a documented template is needed.
- The initial filename-only and credential-pattern scan found no environment files or clear project secrets. Matches inside bundled Webflow JavaScript are library code and still require normal dependency review.
- Secret values must be supplied through the approved secret manager or Cloudflare secret bindings and must never be committed or printed.

## Out of scope for this audit

- Visual redesign or branding changes
- Business-content edits
- Dependency upgrades
- Legacy-file deletion
- Form/backend implementation
- Production-domain or DNS changes
