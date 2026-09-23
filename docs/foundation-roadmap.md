# Perfect Roofting foundation roadmap

Assessment date: 2026-09-23

This is a non-destructive technical assessment of the existing Astro site. It does not change the UI, branding, business content, backend, or production domain.

## Executive findings

- The site builds successfully as 22 static pages and the preview/staging Worker is healthy.
- `npm audit` reports 10 vulnerable packages: 1 critical, 7 high, 1 moderate, and 1 low.
- The only direct vulnerable package is Astro 5.18.1. The fully recommended Astro fix is 7.3.4, which is a major migration and must not be applied without dedicated regression work.
- A non-forced audit dry run identifies smaller transitive updates, but it does not eliminate the Astro-level critical finding.
- Hashing 434 image files found 178 duplicate groups and about 68.5 MiB of reclaimable duplicate data.
- The deployed asset set includes several multi-megabyte images plus a 568.7 KiB Webflow JavaScript bundle.
- Contact-page form controls lack programmatic labels; several navigation/focus behaviours rely on Webflow JavaScript and non-native controls.
- Canonicals, Open Graph URLs, sitemap URLs, and robots sitemap reference the old Boon Chye domain. The Perfect Roofting production domain is **TBC — production domain required**.
- Astro redirect pages become HTTP 200 meta-refresh pages in the static Worker deployment instead of true HTTP redirects.

## Dependency and security assessment

All packages are installed locally for build/development. The Cloudflare deployment contains only static assets, so none of these npm packages executes on the Worker at request time. Build-time, development-server, generated-output, and future untrusted-content exposure still matter.

| Package | Installed | Vulnerable range | Severity | Relationship | Current impact | Safest upgrade path | Breaking risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `astro` | 5.18.1 | `<=7.2.7` aggregate advisory range | Critical | Direct production dependency/build framework | Static deployment reduces SSR/server-island exposure. XSS can still affect generated output if untrusted values enter templates; AVIF processing can affect the build pipeline. | First test 5.18.2 for compatible fixes, then plan a separate, fully tested Astro 7.3.4+ migration because no Astro 5 release clears the aggregate finding. | High for the major upgrade; low-to-medium for 5.18.2. |
| `devalue` | 5.8.1 | `<5.9.1` | Moderate | Transitive through Astro | Serialization DoS is unlikely in the current static, hardcoded-content site. | Non-forced update proposes 5.9.4. | Low, but build regression testing is required. |
| `esbuild` | 0.27.7 through Astro; 0.25.12 through Vite; Wrangler has safe 0.28.1 | `0.27.3–0.28.0` | Low | Transitive | Windows development-server arbitrary file-read risk; not present in deployed static files. | Astro 7 resolves the vulnerable Astro copy; avoid exposing local dev servers and bind locally in the meantime. | High if solved only by the Astro major migration. |
| `js-yaml` | 4.1.1 | `4.0.0–4.3.1` | High | Transitive through Astro/Markdown | Build/config parsing DoS if attacker-controlled YAML is introduced; current inputs are repository-controlled. | Non-forced update proposes 4.3.2. | Low-to-medium; verify Markdown/config builds. |
| `nanoid` | 3.3.12 | `<=3.3.17` | High | Transitive through PostCSS/Vite | Build-tool DoS for invalid generator sizes; no edge runtime exposure. | Non-forced update proposes 3.3.19. | Low. |
| `postcss` | 8.5.15 | `<=8.5.22` | High | Transitive through Vite | Build-time source-map path traversal/file disclosure when processing attacker-controlled CSS/maps; current CSS is repository-controlled. | Non-forced update proposes 8.5.28. | Low-to-medium; compare generated CSS/site rendering. |
| `sharp` | 0.34.5 through Astro; Wrangler/Miniflare has 0.35.4 | `<=0.35.4-rc.0` | High | Transitive | Image decoding is build-time. Risk rises if untrusted images or AVIF files enter the build. | Astro 7.3.4+ is the audit-recommended path for the Astro copy. Until then, accept images only from trusted repository sources. | High because the supported resolution is tied to Astro major migration. |
| `smol-toml` | 1.6.1 | `<=1.7.0` | High | Transitive through Astro | Build/config parsing DoS for malformed untrusted TOML; current configuration is repository-controlled. | Non-forced update proposes 1.9.0. | Low-to-medium. |
| `svgo` | 4.0.1 | `4.0.0–4.0.2` | High | Transitive through Astro | Incomplete sanitization matters if untrusted SVGs are optimized or treated as safe; current SVGs are repository-controlled. | Non-forced update proposes 4.1.0. | Low-to-medium; visually compare SVG output. |
| `vite` | 6.4.2 | `<=6.4.2` | High | Transitive through Astro | Windows dev-server path/credential disclosure issues; not in deployed static output. | Non-forced update proposes 6.4.3. Keep dev server on loopback. | Low-to-medium. |

`npm outdated` reports Astro 5.18.2 as the wanted in-range version and 7.3.4 as latest. Do not run `npm audit fix --force`; it would choose a major Astro migration without project-specific validation.

## Legacy and asset classification

### ACTIVE

- `src/` Astro pages, layouts, components, and `src/data/site.ts`.
- `public/css/normalize.css`, `public/css/webflow.css`, and `public/css/plumber-roofily.webflow.css`.
- `public/js/webflow.js` and the external jQuery/WebFont resources referenced by `BaseLayout.astro`.
- The 97 public images directly referenced by Astro source, CSS, or JavaScript.
- `astro.config.mjs`, `package.json`, `package-lock.json`, and `wrangler.jsonc`.

### LEGACY-BUT-REQUIRED

- The 16 root HTML exports.
- Root `css/`, `js/`, and `images/` trees used by those exports.
- Webflow classes and behaviours that the current Astro templates still depend on.
- Redirect source pages retained for historic routes.

These are not necessarily part of the deployed Astro output, but they preserve the imported baseline and must remain until replacement coverage is proven.

### CONFIRMED-UNUSED CANDIDATES

The following public files have no exact reference in Astro source, active CSS, or active JavaScript and are build/deployment artifacts rather than page assets:

- `public/images/gallery/generated/*-sheet.png`
- `public/images/gallery/generated/workflow-before-during-after-sheet.png`
- `public/images/gallery/generated/gallery-generated-preview.jpg`
- `public/images/service-icons/template-asset-contact-sheet.png`
- `public/images/map-simple-backup.png`

Removal still belongs in a dedicated cleanup commit with route and visual regression checks.

### NEEDS-INVESTIGATION

- `cms-data.json`: no code reference was found, but its origin and archival value are unknown.
- 158 public images have no direct source/CSS/JS reference. Dynamic or editorial use must be ruled out before deletion.
- Duplicate root/public media: hashes prove byte identity, but the root export may still be needed as an archival baseline.
- Root and public copies of Webflow CSS/JavaScript.
- External Google Fonts/WebFont and jQuery dependencies until equivalent behaviour and typography are verified.

## Media and performance assessment

- 434 files were hashed across `images/` and `public/images/`.
- 178 duplicate hash groups contain 356 files; deleting one redundant copy per group could reclaim 71,839,903 bytes (about 68.5 MiB).
- Largest active originals include `red-roof-2-2.png` (3.83 MiB), `red-roof-with-clouds.png` (3.41 MiB), `asian-tiles-construction-site.png` (3.00 MiB), `full-shot-roof.png` (2.40 MiB), and `Sky.svg` (1.80 MiB).
- Several active service images are around 1–1.7 MiB each. Some pages provide responsive `srcset` variants, but the repository and Worker still ship oversized originals.
- `public/js/webflow.js` is 568.7 KiB. The active CSS totals about 131.8 KiB before transfer compression.
- `BaseLayout.astro` loads WebFont synchronously in the document head and loads external jQuery on every page. These add third-party latency and availability/privacy dependencies.
- Workers Static Assets currently includes all files under `public/`; unused contact sheets and unreferenced media increase upload/storage churn even when users do not request them.

Recommended approach: remove confirmed unused assets first, then generate appropriately sized WebP/AVIF alternatives from trusted originals, validate visual quality and responsive selection, and only then remove superseded originals.

## Accessibility assessment

Priority functional findings:

- The contact-page form uses heading elements as visual labels; its inputs, select, and textarea have no `id`/`label` association. Placeholder text is not a label.
- The reusable CTA form has real labels, but both forms submit with GET and expose personal data in query strings.
- The Services navigation trigger is a `div` with an inline click handler rather than a native link/button. The mobile menu trigger is also a `div`; accessible behaviour depends on Webflow JavaScript enhancement.
- Webflow CSS removes outlines from several controls (`input`, slider dots/arrows, dropdowns, nav buttons, and tabs). Some controls have border changes, but a consistent visible `:focus-visible` treatment is not established.
- Heading levels include visual `h4`/`h5` elements and may skip levels between page sections. Each primary content page has one H1, but the full hierarchy requires page-by-page correction.
- Source images generally include `alt`; several icons intentionally use empty alt text next to visible labels. A content-owner review is still required to distinguish decorative from informative imagery.
- Copy buttons use native buttons and accessible labels, which should be preserved.
- Colour contrast has not been proven. Test text, buttons, focus indicators, error states, and text over imagery against WCAG AA after the visual system is defined.

## SEO infrastructure assessment

- Content pages have a single H1, title, description, canonical, and basic Open Graph title/description/image/URL metadata.
- Canonical base, Open Graph image/URL, sitemap URLs, and the robots sitemap directive all use `bcplumbingroofleaking.com.my`.
- Do not substitute a guessed domain. Record the replacement as **TBC — production domain required**.
- Page titles such as “About”, “Services”, and “Contact Us” are generic and omit the brand/service-area context.
- No JSON-LD structured data was found. LocalBusiness/Contractor, Service, Breadcrumb, and FAQ schemas require verified business facts before implementation.
- The sitemap includes the primary commercial pages but omits privacy and terms pages.
- Redirect source pages are generated as noindex meta-refresh documents. On Workers Static Assets, `/appointment/`, `/blogs/`, and `/service/roof-installation/` return HTTP 200 rather than a true 301/308 redirect. Add explicit Worker redirect handling in a later technical phase.
- `robots.txt` disallows several legacy routes, but disallow rules do not replace correct redirects or canonical handling.
- There is no Twitter/X card metadata. Add only if required by the approved sharing strategy.

## Implementation phases

### Phase 1 — Safe dependency/security updates

- Objective: apply non-forced, compatible dependency patches; then plan the Astro major migration separately.
- Files/components: `package.json`, `package-lock.json`, Astro/Vite build pipeline, image processing, Wrangler local tooling.
- Risk: medium for the compatible update batch; high for Astro 7. Existing static rendering or Webflow integration may change.
- Validation: clean `npm ci`, `npm audit`, `npm run build`, local route smoke tests, staging deploy, visual comparison of every template, and image/SVG checks.
- Rollback: revert the dependency commit and redeploy the previous known-good Worker version.

### Phase 2 — Legacy cleanup

- Objective: remove only proven-unused exports and resources while retaining required Webflow behaviour.
- Files/components: root HTML/CSS/JS/images, `cms-data.json`, unreferenced public assets, redirect pages.
- Risk: high because hidden runtime references and archival needs may be missed.
- Validation: reference scan, hash inventory, full route crawl, browser console/network checks, visual regression, and owner sign-off on archival files.
- Rollback: restore the cleanup commit; assets remain recoverable from Git history.

### Phase 3 — Media optimization

- Objective: reduce transfer and repository size without visible quality loss.
- Files/components: `public/images/`, `src/data/site.ts`, image markup/srcsets, gallery/service data.
- Risk: medium; wrong dimensions, cropping, compression, or filenames can break layouts and SEO/social previews.
- Validation: responsive viewport checks, decoded-image checks, byte comparison, Lighthouse/Web Vitals sampling, and staging visual review.
- Rollback: restore original asset references and files from the preceding commit.

### Phase 4 — Accessibility foundation

- Objective: repair form labels, native control semantics, keyboard operation, focus visibility, heading order, and alt-text decisions.
- Files/components: `CTA.astro`, `contact.astro`, `Header.astro`, FAQ/gallery controls, active CSS, shared layout.
- Risk: medium; Webflow scripts/styles may conflict with semantic replacements.
- Validation: keyboard-only walkthrough, screen-reader smoke test, automated axe scan, WCAG AA contrast testing, and no visual regression.
- Rollback: revert by component while retaining verified fixes that are independent.

### Phase 5 — SEO foundation

- Objective: make metadata, sitemap, robots, structured data, and redirects correct for the approved brand/domain.
- Files/components: `src/data/site.ts`, `BaseLayout.astro`, redirect routes/Worker entry point, `public/sitemap.xml`, `public/robots.txt`.
- Risk: high until the production domain and business facts are confirmed; wrong canonicals can suppress indexing.
- Validation: owner-approved domain/facts, generated-page metadata audit, schema validation, HTTP redirect tests, sitemap validation, and staging crawl with production indexing disabled as appropriate.
- Rollback: redeploy the last known-good metadata/redirect configuration and restore previous sitemap/robots files.

### Phase 6 — Secure lead backend

- Objective: replace GET forms with a project-owned POST endpoint, validation, safe handling, and approved notification/storage.
- Files/components: forms, future Worker entry point/API route, validation schema, mail/storage integration, privacy documentation.
- Risk: high because personal information, spam, delivery failures, and secret handling are involved.
- Validation: test-data submissions only, server/client validation tests, failure-path tests, log redaction, delivery monitoring, and privacy review.
- Rollback: disable the endpoint/form submission feature and direct users to verified phone/WhatsApp contacts; roll back the Worker version.

### Phase 7 — Turnstile and rate limiting

- Objective: add bot verification and abuse controls before accepting public leads.
- Files/components: form UI, Worker endpoint, Cloudflare Turnstile configuration, secret bindings, rate-limit storage/logic.
- Risk: medium-to-high; incorrect controls can block legitimate customers or allow abuse.
- Validation: valid/expired/replayed token tests, accessibility testing, rate-limit boundary tests, staging hostname configuration, and fail-closed behaviour.
- Rollback: revert to the previous endpoint version and temporarily disable public submission if protection cannot be guaranteed.

### Phase 8 — Attribution

- Objective: capture only approved campaign/referrer/landing-page attribution and associate it with leads server-side.
- Files/components: URL parsing, consent/privacy handling, form payload schema, backend storage/notification templates.
- Risk: medium; privacy leakage and inaccurate attribution are possible.
- Validation: campaign matrix tests, direct/referral cases, query sanitization, retention review, and no personal data in URLs/logs.
- Rollback: stop collecting attribution fields while preserving core lead submission.

### Phase 9 — GTM and PostHog

- Objective: add approved analytics with environment separation, consent behaviour, and no secret exposure.
- Files/components: shared layout, public runtime configuration, Doppler/Cloudflare config, consent controls, event taxonomy.
- Risk: medium-to-high for privacy, duplicate events, performance, and production/test data mixing.
- Validation: staging debug views, network inspection, consent tests, event deduplication, PII audit, and performance comparison.
- Rollback: disable/remove tag snippets and public configuration, then redeploy the prior Worker version.

### Phase 10 — Automated QA

- Objective: protect routes, forms, accessibility, metadata, links, and deployment configuration in CI.
- Files/components: test configuration, route smoke tests, accessibility checks, link/SEO checks, GitHub workflow, deployment gates.
- Risk: low-to-medium; flaky tests or unsafe secret use can block releases.
- Validation: deterministic local and CI runs, failure injection, branch protection review, and least-privilege credentials.
- Rollback: disable only the faulty check while retaining reproducible local commands; never bypass all release verification.

### Phase 11 — Perfect Roofting content and visual revamp

- Objective: replace inherited Boon Chye presentation with owner-approved Perfect Roofting branding, content, services, media, and domain.
- Files/components: all pages/components, `site.ts`, design tokens/CSS, images, metadata, legal pages, sitemap/robots, analytics.
- Risk: high; business accuracy, conversion, accessibility, SEO, and brand consistency change together.
- Validation: owner fact sheet, design approval, content/legal approval, full responsive/accessibility/SEO/performance QA, staging sign-off, and exact-commit production release.
- Rollback: retain the approved pre-revamp release/Worker version and switch traffic back if launch criteria fail.

## Recommended next implementation task

Create a focused Phase 1 branch for the non-forced compatible dependency update batch shown by `npm audit fix --dry-run`. Verify the build and every staging route, then reassess the remaining advisories. Do not combine that work with Astro 7; treat the major migration as a separately scoped change with visual and route regression coverage.

