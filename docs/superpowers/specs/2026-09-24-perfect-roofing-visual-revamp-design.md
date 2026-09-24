# Perfect Roofing & Waterproofing Visual Revamp Design

## Purpose

Transform the existing Boon Chye-derived Astro website into a customer-facing Perfect Roofing & Waterproofing website while retaining the Boon Chye template's visual system. The completed site must communicate only roofing, roof repair, roof maintenance, roof installation, waterproofing, leak repair, and related inspection services across Kuala Lumpur and Selangor.

The existing backend, tracking, attribution, form submission, validation, Turnstile, Workers, deployment, and infrastructure implementations are explicitly outside the scope of this work.

## Source hierarchy

- The current Boon Chye website and the existing Astro implementation define the layout, component structure, styling, animations, spacing, responsive behaviour, and interaction patterns.
- PerfectRoofing.com.my and the user-provided copy define the business identity, public contact details, services, positioning, and customer-facing content.
- The attached official Perfect Roofing & Waterproofing logo is the branding asset for the desktop header, mobile header, and footer.
- Existing local roofing and waterproofing images are temporary visual assets until the user provides final project photography.

## Global constraints

1. Do not modify backend or integration code, including `worker/`, API routes, form actions, form handlers, Turnstile, PostHog, GTM, GA4, attribution, environment variables, deployment configuration, validation logic, webhook logic, success-event logic, or lead creation logic.
2. Preserve form `action`, `method`, `name`, field `name`, field ID, hidden fields, validation attributes, event hooks, success containers, failure containers, and tracking attributes unless a purely visual attribute is proven not to be functional.
3. Preserve the existing Boon Chye/Webflow design system: colours, typography, button styles, card styles, borders, shadows, animation behaviour, sliders, accordions, section composition, and responsive conventions.
4. Do not introduce a new design language or copy the visual design of PerfectRoofing.com.my.
5. Remove all public-facing references to Boon Chye and unrelated services such as plumbing, electrical, renovation, sewerage, drainage, grease traps, and water pumps.
6. Use “Perfect Roofing & Waterproofing” consistently and do not invent a public email address.
7. Make the smallest reasonable front-end changes and reuse existing components and data structures.

## Information architecture

The public navigation remains structurally unchanged and displays:

- Home
- About Us
- Services
- Projects
- FAQ
- Contact

The primary navigation CTA displays “Request for Quotation.” Existing destinations and interaction architecture are retained unless a destination is already a front-end-configurable contact value.

The homepage keeps the closest existing section order while communicating:

1. Header
2. Hero
3. Experience and contact highlight
4. About Perfect Roofing
5. Six services
6. Why Choose Us
7. Roofing and waterproofing project gallery
8. Statistics
9. Six-step process
10. Roofing and waterproofing testimonials
11. Roofing-specific FAQ
12. Request for Quotation
13. Get In Touch
14. Final CTA
15. Footer

Existing secondary pages will be updated wherever they expose the same inherited business data. The shared data and components remain the primary source of consistency.

## Branding and contact details

The public brand data is:

- Name: Perfect Roofing & Waterproofing
- Positioning: Roofing & Waterproofing Specialists in KL & Selangor
- Call / WhatsApp: +60 11-1188 8828
- Address: No.1, Jalan USJ 1/2C, Taman Subang Permai, 47600 Subang Jaya, Selangor, Malaysia
- Service area: Kuala Lumpur & Selangor
- Company registration: 202103318512
- Copyright: © 2026 Perfect Roofing & Waterproofing (202103318512). All Rights Reserved.

No old Boon Chye email address is displayed. Where the existing contact page currently presents an email card, that visual slot will be repurposed for service-area or consultation information so the card layout remains balanced without inventing contact information.

## Homepage content design

### Hero

The current hero layout, background, positioning, CTA arrangement, effects, and responsive behaviour remain. Visible copy becomes:

- Eyebrow: Roofing & Waterproofing Specialists in KL & Selangor
- Heading: Your Trusted Experts for Roofing & Waterproofing in KL & Selangor
- Supporting text: Reliable roof repair and waterproofing solutions backed by decades of industry experience.
- Primary CTA: Request for Quotation
- Secondary CTA: Explore Our Services
- Contact label: Call / WhatsApp
- Contact value: +60 11-1188 8828
- Experience value: 31 Years
- Experience text: Industry experience in roofing and waterproofing solutions.

The existing roofing hero image remains unless another existing local roofing image is clearly more appropriate.

### About

The existing image-and-copy composition remains. The heading becomes “Roofing & Waterproofing Solutions You Can Rely On.” The two approved paragraphs describe 31 years of residential roofing and waterproofing experience and practical solutions for leaks, maintenance, waterproofing, and roof replacement.

The existing two highlight cards become Free Consultation and No Hidden Fees, using the approved supporting copy.

### Services

The existing numbered service-card component presents six entries:

1. Roof Leak Detection & Repair
2. Roof Replacement & Re-roofing
3. Roof Maintenance & Inspection
4. New Roof Installation
5. Roof Waterproofing
6. PU Injection & Water Leakage Repair

Existing card styling, numbering, View More interaction, hover treatment, and icon style remain. Service cards use a three-column by two-row desktop grid, two columns on tablet, and one column on mobile. Existing roofing-related image/icon assets are reused; unrelated assets are not displayed.

The existing generic service detail-page architecture is retained for the six new service records. Content changes remain presentational and must not add backend behaviour.

### Why Choose Us

The existing six-card presentation remains and displays:

- Affordable Pricing, No Hidden Fees
- One-Stop Solution for Leak Repairs
- 31 Years of Industry Experience
- 24/7 Emergency Support
- Free Consultation
- KL & Selangor Coverage

### Gallery and statistics

The existing gallery slider remains. Its heading becomes “Our Roofing & Waterproofing Projects,” with the approved supporting text. Only existing roof repair, roof inspection, roof replacement, roof installation, waterproofing, membrane, coating, PU injection, or roofing maintenance images are displayed.

The existing four statistic blocks become:

- 31 Years — Industry Experience
- 24/7 — Emergency Support
- 6 — Core Roofing & Waterproofing Services
- KL & Selangor — Service Coverage

### Six-step process

The current process visual language remains and expands to six approved steps:

1. Contact Us via WhatsApp or Call
2. Schedule a Free Consultation
3. Site Inspection & Assessment
4. Quotation & Repair Plan
5. Repair & Solution Implementation
6. Final Checking & Completion

The implementation uses a clean 3+3 desktop layout within the existing visual system, two columns where appropriate on tablet, and one column on mobile. The existing process image may remain if it is roofing-related.

### Testimonials

The current slider behaviour and component structure remain. Only existing roofing or waterproofing reviews are included. No new customer identities or quotations are invented.

### FAQ

The existing accordion remains and presents six concise questions and answers covering inspection, emergency leaks, roof replacement, waterproofing solutions, PU injection, and Kuala Lumpur/Selangor coverage. Waterproofing answers reference Torch On membrane, liquid membrane, polyurethane/PU membrane, waterproofing coating, and water leakage repair.

### CTA and forms

The existing CTA composition remains. Its headline becomes “Need Help With a Roof Leak or Waterproofing Problem?” and uses the approved supporting text, Request for Quotation button language, WhatsApp option, and phone number.

The visible quote-form heading becomes “Request for Quotation” or “Request a Free Consultation.” The visible contact-form heading remains “Get In Touch,” with roofing-specific supporting text. Visible service choices correspond to the six services plus “Not Sure / Need Inspection.” Backend submission values remain compatible; if labels and values need to differ, option labels change while values remain stable.

## Shared header, footer, and secondary pages

The supplied official logo replaces the wordmark/logo in the desktop header, mobile header, and footer. Dimensions may be adjusted only enough to fit the existing layout without overflow.

The footer keeps the existing structure and displays the approved Perfect Roofing about text, six-service list, WhatsApp number, address, company registration, and copyright. Old Boon Chye contact directories, service-specific phone numbers, office number, and email are removed from public view.

About, Services, service detail, Contact, and other indexed public pages are updated so they do not contradict the homepage. Public metadata and accessible labels are revised where they expose old business positioning. Legal-page content is changed only when it contains customer-facing inherited branding or contact details; legal meaning is otherwise left intact.

## Images and logo handling

The attached logo is copied into the public image assets with a descriptive filename and used through normal Astro image URLs. No image backend or complicated gallery system is introduced.

Existing roofing-related assets are selected from the current repository. Temporary assets retain compatible dimensions and aspect ratios. The final report will identify every visible image that is still temporary and easy to replace later.

## CSS and responsive changes

CSS changes are limited to what the content expansion requires:

- official logo sizing in existing header/footer slots
- six-card service grid at 3/2/1 columns
- six-step process at desktop/tablet/mobile breakpoints
- equal card heights and readable wrapping
- prevention of horizontal overflow

Existing theme variables, colours, typography, shadows, borders, animations, and breakpoint conventions are preserved.

## Verification

Implementation is accepted only after:

1. The project test suite passes.
2. The production build succeeds.
3. A public-source scan finds no customer-facing Boon Chye, plumbing, electrical, renovation, sewerage, drainage, grease trap, water pump, obsolete phone/address/email, “20+ Years,” or five-service positioning in generated pages.
4. A backend/integration diff audit confirms no protected backend or integration files were modified by this revamp.
5. Desktop, tablet, and mobile browser checks cover the header/logo, hero wrapping, buttons, service cards, process steps, gallery, testimonials, FAQ, forms, CTA, footer, image aspect ratios, and horizontal overflow.
6. Form actions, field names, IDs, handlers, validation attributes, hidden values, Turnstile markup, success/failure containers, and tracking hooks are compared against the baseline and remain unchanged.

## Out of scope

- Backend or API changes
- Database, Notion, email, webhook, or lead changes
- Cloudflare Workers or deployment changes
- Environment-variable or Doppler changes
- Analytics, attribution, conversion, or tracking changes
- Turnstile or backend validation changes
- New gallery/image infrastructure
- Deployment or publishing
- Redesigning the Boon Chye template

