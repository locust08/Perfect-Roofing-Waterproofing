# Perfect Roofing & Waterproofing Visual Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every customer-facing Boon Chye/general-contractor remnant with the approved Perfect Roofing & Waterproofing branding, roofing services, copy, logo, and imagery while preserving the existing visual system and all backend/integration behaviour.

**Architecture:** Keep the current Astro/Webflow component architecture. Centralize brand, service, review, FAQ, gallery, and contact content in `src/data/site.ts`; update shared components and pages to consume that data; add only narrowly scoped responsive CSS for the logo, six service cards, and six process steps. Use source-contract tests to pin visible content and form/integration invariants before changing production files.

**Tech Stack:** Astro 7, TypeScript, Webflow-derived CSS, Vitest 5, static assets in `public/images`.

**Spec:** `docs/superpowers/specs/2026-09-24-perfect-roofing-visual-revamp-design.md`

## Global Constraints

- Do not modify backend or integration code, including `worker/`, API routes, form actions, form handlers, Turnstile, PostHog, GTM, GA4, attribution, environment variables, deployment configuration, validation logic, webhook logic, success-event logic, or lead creation logic.
- Preserve form `action`, `method`, `name`, field `name`, field ID, hidden fields, validation attributes, event hooks, success containers, failure containers, and tracking attributes unless a purely visual attribute is proven not to be functional.
- Preserve the existing Boon Chye/Webflow design system: colours, typography, button styles, card styles, borders, shadows, animation behaviour, sliders, accordions, section composition, and responsive conventions.
- Do not introduce a new design language or copy the visual design of PerfectRoofing.com.my.
- Remove all public-facing references to Boon Chye and unrelated services such as plumbing, electrical, renovation, sewerage, drainage, grease traps, and water pumps.
- Use “Perfect Roofing & Waterproofing” consistently and do not invent a public email address.
- Make the smallest reasonable front-end changes and reuse existing components and data structures.
- Protected paths include `worker/`, `src/scripts/`, `public/js/analytics.js`, `src/layouts/BaseLayout.astro`, `wrangler.jsonc`, and backend/integration tests; no task may edit them.

## Review Focus

- Long company and service names must wrap without overflowing header, cards, CTA, forms, or footer; Task 2 pins the responsive CSS selectors and visual QA checks all breakpoints.
- Six service entries must produce exactly six unique public service paths with no unrelated legacy service in navigation or cards; Task 1 tests the exported service records.
- Quote/contact form presentation may change while form contracts remain byte-for-byte compatible for actions, IDs, names, hidden fields, Turnstile, and success/failure hooks; Task 3 tests those invariants.
- No supplied public email exists, so old email UI must disappear without inventing a replacement; Task 3 scans all public Astro sources and the built output.
- Temporary images must all be roofing/waterproofing-related and replaceable through centralized arrays; Tasks 1 and 2 test asset paths and Task 3 verifies rendered alt text and output.

---

### Task 1: Centralize Perfect Roofing Brand, Services, and Shared Chrome

**Files:**
- Create: `tests/visual-brand.test.ts`
- Create: `public/images/perfect-roofing-logo.png`
- Modify: `src/data/site.ts`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/ServiceList.astro`
- Modify: `public/css/plumber-roofily.webflow.css`

**Interfaces:**
- Consumes: existing exported names from `src/data/site.ts` and the current `Header`, `Footer`, and `ServiceList` component contracts.
- Produces: `brand` with the approved name, registration, phone, address, and service area; `services` with exactly six roofing service records; roofing-only `trustPoints`, `testimonials`, `faqs`, `projectImages`, navigation, and contact data; `/images/perfect-roofing-logo.png`; shared header/footer/service-card rendering used by Tasks 2 and 3.

- [ ] **Step 1: Write the failing brand and service source-contract tests**

Create `tests/visual-brand.test.ts` with Vitest tests that import `brand`, `services`, `trustPoints`, `testimonials`, `faqs`, and `projectImages` from `src/data/site.ts` and assert:

```ts
import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { brand, faqs, projectImages, services, testimonials, trustPoints } from "../src/data/site";

const forbidden = /Boon Chye|plumb|electrical|renovation|sewer|drainage|grease trap|water pump/i;

describe("Perfect Roofing public brand data", () => {
  test("uses the approved public business identity", () => {
    expect(brand.name).toBe("Perfect Roofing & Waterproofing");
    expect(brand.registration).toBe("202103318512");
    expect(brand.phone).toBe("+60 11-1188 8828");
    expect(brand.address).toBe("No.1, Jalan USJ 1/2C, Taman Subang Permai, 47600 Subang Jaya, Selangor, Malaysia");
    expect(brand.serviceArea).toBe("Kuala Lumpur & Selangor");
  });

  test("exports exactly the six approved roofing services", () => {
    expect(services.map(({ title }) => title)).toEqual([
      "Roof Leak Detection & Repair",
      "Roof Replacement & Re-roofing",
      "Roof Maintenance & Inspection",
      "New Roof Installation",
      "Roof Waterproofing",
      "PU Injection & Water Leakage Repair",
    ]);
    expect(new Set(services.map(({ slug }) => slug)).size).toBe(6);
    expect(services.every(({ href }) => href.startsWith("/service/"))).toBe(true);
  });

  test("centralized homepage collections contain no unrelated services", () => {
    expect(JSON.stringify({ services, trustPoints, testimonials, faqs, projectImages })).not.toMatch(forbidden);
  });

  test("shared chrome uses the official logo and approved CTA", () => {
    const header = readFileSync("src/components/Header.astro", "utf8");
    const footer = readFileSync("src/components/Footer.astro", "utf8");
    expect(header).toContain('/images/perfect-roofing-logo.png');
    expect(header).toContain("Request for Quotation");
    expect(footer).toContain('/images/perfect-roofing-logo.png');
    expect(`${header}\n${footer}`).not.toMatch(forbidden);
  });
});
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: `npm test -- tests/visual-brand.test.ts`

Expected: FAIL because the current brand values, five general-contractor services, old collections, and text wordmark do not meet the approved public contract.

- [ ] **Step 3: Implement the centralized content and shared chrome changes**

Update `src/data/site.ts` without changing exported names required by existing pages. Replace the five general-contractor service records with the six exact approved service titles and descriptions from the specification. Give each service a unique stable slug and `/service/<slug>` href. Reuse only existing roofing/waterproofing images and icon assets for service image fields. Replace shared trust points, FAQs, gallery entries, testimonials, phone/address/registration, and public contact collections with roofing-only content.

Copy the supplied logo from `C:/Users/User/AppData/Local/Temp/codex-clipboard-58923d09-795f-4ebe-af84-3594c44dac6f.png` to `public/images/perfect-roofing-logo.png` without image transformation.

Replace the header wordmark and footer logo/wordmark with `<img>` elements using `/images/perfect-roofing-logo.png`, meaningful alt text, and the existing link containers. Change the visible header CTA to `Request for Quotation`. Preserve navigation/dropdown structure and destinations.

Keep `ServiceList.astro` architecture and interactions; adjust only presentation markup if needed for equal-height cards. Append narrowly scoped logo and service-grid rules to `public/css/plumber-roofily.webflow.css`: three columns on desktop, two at the existing tablet breakpoint, one at the existing mobile breakpoint, with no theme-colour changes.

- [ ] **Step 4: Run focused and full tests and confirm GREEN**

Run: `npm test -- tests/visual-brand.test.ts`

Expected: PASS.

Run: `npm test`

Expected: all tests pass with zero failures. Record unrelated baseline failures rather than editing protected files.

- [ ] **Step 5: Commit Task 1**

```bash
git add tests/visual-brand.test.ts public/images/perfect-roofing-logo.png src/data/site.ts src/components/Header.astro src/components/Footer.astro src/components/ServiceList.astro public/css/plumber-roofily.webflow.css
git commit -m "feat: add Perfect Roofing brand and services"
```

### Task 2: Revamp the Homepage Within the Existing Template

**Files:**
- Create: `tests/homepage-visual-content.test.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/components/CTA.astro`
- Modify: `public/css/plumber-roofily.webflow.css`

**Interfaces:**
- Consumes: approved `brand`, `services`, `trustPoints`, `testimonials`, `faqs`, and `projectImages` from Task 1.
- Produces: a roofing-only homepage with the approved hero, about, six services, six reasons, project gallery, statistics, six-step process, testimonials, FAQ, quote form copy, and final CTA while retaining existing components and form contracts.

- [ ] **Step 1: Write failing homepage content and layout tests**

Create `tests/homepage-visual-content.test.ts` that reads `src/pages/index.astro`, `src/components/CTA.astro`, and `public/css/plumber-roofily.webflow.css`. Assert the exact approved hero heading, eyebrow, support line, `31 Years`, about heading, gallery heading, four statistics, six step titles, CTA heading, `Request for Quotation`, `Send Enquiry`, and the CSS selectors used for the six-step responsive grid. Assert the combined homepage/CTA source does not match:

```ts
const forbidden = /Boon Chye|general contractor|plumb|electrical|renovation|sewer|drainage|grease trap|water pump|20\+ Years|5 service categories/i;
```

Also extract the `form` opening tag and all `input`, `textarea`, and Turnstile lines from `CTA.astro` into inline snapshots matching the baseline action `/api/enquiries`, `method="post"`, `name="quote-form"`, `data-enquiry-form`, field IDs/names, hidden `form_type=quote`, honeypot, Turnstile attributes, and success/failure container classes.

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: `npm test -- tests/homepage-visual-content.test.ts`

Expected: FAIL on old hero/about/gallery/stat/process/CTA copy and missing six-step responsive layout.

- [ ] **Step 3: Replace homepage-visible content and minimally adapt layouts**

Update `src/pages/index.astro` with the exact approved hero, badge, about, highlights, service intro, why-choose intro, gallery, statistics, six-step process, testimonial intro, FAQ intro, and CTA-adjacent copy. Keep the current section order and Webflow class system. Render all six process steps using the existing step card/icon language; a local array inside the page is acceptable because process steps are homepage-specific.

Update `src/components/CTA.astro` visible headings, supporting text, labels/placeholders, button value (`Send Enquiry` where specified), WhatsApp display, and quotation terminology. Do not change any functional form attribute, Turnstile markup, event hook, hidden field, validation attribute, success handler, or failure handler.

Append only the CSS needed for a 3+3 process layout on desktop, two columns on tablet, one column on mobile, equal readable cards, long-heading wrapping, and horizontal-overflow prevention. Preserve existing colours, spacing scale, typography, shadows, and animations.

- [ ] **Step 4: Run focused tests, full tests, and build**

Run: `npm test -- tests/homepage-visual-content.test.ts`

Expected: PASS.

Run: `npm test`

Expected: all tests pass with zero failures.

Run: `npm run build`

Expected: Astro build exits 0 and generates all six service detail pages.

- [ ] **Step 5: Commit Task 2**

```bash
git add tests/homepage-visual-content.test.ts src/pages/index.astro src/components/CTA.astro public/css/plumber-roofily.webflow.css
git commit -m "feat: revamp Perfect Roofing homepage"
```

### Task 3: Align Secondary Pages and Prove Backend/Form Preservation

**Files:**
- Create: `tests/public-content-contract.test.ts`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/service.astro`
- Modify: `src/pages/service/[slug].astro`
- Modify: `src/pages/service/roof-installation.astro` only if still publicly generated and contradictory
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/gallery.astro`
- Modify: `src/pages/reviews.astro`
- Modify: `src/pages/privacy-policy.astro` only for inherited public branding/contact content
- Modify: `src/pages/terms-and-condition.astro` only for inherited public branding/contact content
- Modify: `src/pages/404.astro` only if inherited public business copy is present
- Modify: `public/css/plumber-roofily.webflow.css` only for secondary-page logo/content overflow discovered by tests or visual QA

**Interfaces:**
- Consumes: centralized brand/service/contact records from Task 1 and shared CTA/header/footer from Tasks 1–2.
- Produces: consistent roofing-only public pages, approved contact/form presentation, and automated evidence that protected form contracts and backend/integration paths remain unchanged.

- [ ] **Step 1: Write failing public-content and form-invariant tests**

Create `tests/public-content-contract.test.ts`. Recursively read customer-facing files under `src/pages`, `src/components`, and `src/data/site.ts`, excluding documentation and source comments only when necessary. Assert no visible-source match for old company/contact values or unrelated services:

```ts
const forbidden = /Boon Chye|boonchyeplumbing@live\.com\.my|1350531-M|\+6012 796 0061|\+6011 1239 3139|\+6012 612 3690|\+6012 272 0201|\+6014 641 0788|03-56381676|plumb|electrical|renovation|sewer|drainage|grease trap|water pump|one-stop property contractor|20\+ Years|5 service categories/i;
```

Assert `src/pages/contact.astro` contains `Get In Touch`, `Need help with a roof leak or waterproofing problem?`, `Send Enquiry`, `WhatsApp +60 11-1188 8828`, all six approved option labels, and `Not Sure / Need Inspection`; assert it does not contain `mailto:` or an email contact card.

Pin the contact form contract using explicit assertions for:

```ts
expect(contact).toContain('action="/api/enquiries"');
expect(contact).toContain('data-enquiry-form');
expect(contact).toContain('method="post"');
expect(contact).toContain('name="contact-form"');
expect(contact).toContain('name="form_type"');
expect(contact).toContain('value="contact"');
for (const pair of [
  ['contact-name', 'name'],
  ['contact-email', 'email'],
  ['contact-phone', 'phone'],
  ['contact-service', 'service'],
  ['contact-message', 'message'],
  ['contact-company', 'company'],
]) expect(contact).toMatch(new RegExp(`id="${pair[0]}"[^>]*name="${pair[1]}"|name="${pair[1]}"[^>]*id="${pair[0]}"`));
expect(contact).toContain('class="cf-turnstile"');
expect(contact).toContain('data-action="turnstile-spin-v2"');
expect(contact).toContain('class="w-form-done"');
expect(contact).toContain('class="w-form-fail"');
```

Add a git-based test that runs `git diff --name-only <plan-base-sha>...HEAD` using a base SHA supplied through `VISUAL_REVAMP_BASE_SHA`, and fails if any changed path starts with or equals a protected path from Global Constraints. When the variable is absent, skip this single audit test with an explicit message; the controller supplies it for final verification.

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: `npm test -- tests/public-content-contract.test.ts`

Expected: FAIL because secondary pages still expose general-contractor copy, old contact data, email UI, and unrelated service wording.

- [ ] **Step 3: Update secondary public pages without changing behaviour**

Update About, Services, generic service detail, Contact, Gallery, Reviews, and any contradictory public legal/404 copy to the approved roofing-only positioning. Reuse the current section and component structures. On Contact, replace the public email card with service-area or consultation information, replace the service-team directory with a roofing-focused contact presentation using the single approved WhatsApp number, update the visible service selector labels, and preserve its technical option values when necessary for backend compatibility. Remove public `mailto:` output.

Do not edit protected files. Do not change form actions, methods, technical field names, IDs, hidden values, validation attributes, Turnstile attributes, data hooks, success/failure classes, or client-side handler logic.

- [ ] **Step 4: Run focused tests, full tests, build, and output scan**

Run: `npm test -- tests/public-content-contract.test.ts`

Expected: PASS except the explicitly skipped protected-path audit when `VISUAL_REVAMP_BASE_SHA` is absent.

Run: `npm test`

Expected: all tests pass with zero failures.

Run: `npm run build`

Expected: build exits 0.

Run a case-insensitive scan of `dist/` for all forbidden terms and old contact values from Step 1. Expected: no customer-facing matches. Ignore source maps only if they embed source text but are not shipped by the current build.

- [ ] **Step 5: Perform responsive browser verification**

Run `npm run dev` and inspect `/`, `/about`, `/service`, one generated service detail page, `/gallery`, `/reviews`, and `/contact` at desktop, tablet, and mobile widths. Verify logo fit, hero wrapping, buttons, 3/2/1 service grid, 3/2/1 process layout, image aspect ratios, slider usability, FAQ interaction, visible form labels, footer readability, and absence of horizontal scrolling. Do not submit forms.

- [ ] **Step 6: Run protected-path audit and commit Task 3**

Run: `$env:VISUAL_REVAMP_BASE_SHA='<recorded-plan-base>'; npm test -- tests/public-content-contract.test.ts`

Expected: PASS and no protected files in the implementation diff.

```bash
git add tests/public-content-contract.test.ts src/pages/about.astro src/pages/service.astro src/pages/service/[slug].astro src/pages/service/roof-installation.astro src/pages/contact.astro src/pages/gallery.astro src/pages/reviews.astro src/pages/privacy-policy.astro src/pages/terms-and-condition.astro src/pages/404.astro public/css/plumber-roofily.webflow.css
git commit -m "feat: align Perfect Roofing public pages"
```

Only add files that actually changed.

