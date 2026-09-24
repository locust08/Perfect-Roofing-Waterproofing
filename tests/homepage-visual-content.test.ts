import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const home = readFileSync("src/pages/index.astro", "utf8");
const cta = readFileSync("src/components/CTA.astro", "utf8");
const css = readFileSync("public/css/plumber-roofily.webflow.css", "utf8");

const forbidden = /Boon Chye|general contractor|plumb|electrical|renovation|sewer|drainage|grease trap|water pump|20\+ Years|5 service categories/i;

describe("roofing-only homepage presentation", () => {
  test("uses the approved hero and about copy", () => {
    expect(home).not.toContain('class="hero-label"');
    expect(home).toContain("Your Trusted Experts for Roofing & Waterproofing in KL & Selangor");
    expect(home).toContain("Reliable roof repair and waterproofing solutions backed by decades of industry experience.");
    expect(home).toContain("31 Years");
    expect(home).toContain("Industry experience in roofing and waterproofing solutions.");
    expect(home.replace(/<[^>]+>/g, "")).toContain("Roofing & Waterproofing Solutions You Can Rely On.");
    expect(home).toContain("Free Consultation");
    expect(home).toContain("No Hidden Fees");
    expect(home).not.toContain("Circular-Saw-Tool-1.png");
  });

  test("shows the approved gallery, metrics, process, and FAQ anchor", () => {
    expect(home).toContain("Our Roofing & Waterproofing Projects");
    const metricBlocks = [...home.matchAll(/<div class="single-metrics(?: last)?">([\s\S]*?)<\/div>/g)]
      .map(([, block]) => [
        block.match(/<h2[^>]*>([^<]+)<\/h2>/)?.[1],
        block.match(/<p[^>]*>([^<]+)<\/p>/)?.[1],
      ]);
    expect(metricBlocks).toEqual([
      ["31 Years", "Industry Experience"],
      ["24/7", "Emergency Support"],
      ["6", "Core Roofing & Waterproofing Services"],
      ["KL & Selangor", "Service Coverage"],
    ]);
    for (const title of [
      "Contact Us via WhatsApp or Call",
      "Schedule a Free Consultation",
      "Site Inspection & Assessment",
      "Quotation & Repair Plan",
      "Repair & Solution Implementation",
      "Final Checking & Completion",
    ]) expect(home).toContain(title);
    expect(home).toContain('<section class="faq-section padding-bottom" id="faq">');
  });

  test("uses the quotation and roofing CTA language without unrelated trades", () => {
    expect(home).toContain("Request for Quotation");
    expect(cta).toContain("Need Help With a Roof Leak or Waterproofing Problem?");
    expect(cta).toContain("Request for Quotation");
    expect(cta).toContain('value="Send Enquiry"');
    expect(`${home}\n${cta}`).not.toMatch(forbidden);
  });

  test("lays out six process cards in three, two, and one columns", () => {
    expect(home).toContain('class="how-it-works-content-left home-process-grid"');
    expect(css).toMatch(/\.home-process-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
    expect(css).toMatch(/@media screen and \(max-width: 991px\)\s*\{\s*\.home-process-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
    expect(css).toMatch(/@media screen and \(max-width: 767px\)\s*\{\s*\.home-process-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
  });

  test("preserves the quotation form's functional markup", () => {
    const formTag = cta.match(/<form\b[^>]*>/)?.[0];
    expect(formTag).toMatchInlineSnapshot(`"<form action="/api/enquiries" class="cta-contact-form" data-enquiry-form data-name="Quote Form" method="post" name="quote-form">"`);

    const fields = cta.split("\n")
      .map((line) => line.trim())
      .filter((line) => /<(?:input|textarea)\b|class="cf-turnstile"/.test(line))
      .map((line) => line.replace(/ placeholder="[^"]*"/g, "").replace(/value="Submit"|value="Send Enquiry"/g, 'value="<visible submit copy>"'));
    expect(fields).toMatchInlineSnapshot(`
      [
        "<input name="form_type" type="hidden" value="quote" />",
        "<input class="field w-input" id="quote-name" maxlength="100" name="name" required type="text" />",
        "<input class="field w-input" id="quote-email" maxlength="254" name="email" type="email" />",
        "<input class="field w-input" id="quote-phone" maxlength="30" name="phone" required type="tel" />",
        "<textarea class="field text-area w-input" id="quote-message" maxlength="2000" minlength="10" name="message" required></textarea>",
        "<div aria-hidden="true" class="enquiry-honeypot"><label for="quote-company">Company website</label><input autocomplete="off" id="quote-company" name="company" tabindex="-1" type="text" /></div>",
        "<div class="cf-turnstile" data-action="turnstile-spin-v2" data-sitekey={turnstileSiteKey}></div>",
        "<input class="form-button w-button" data-wait="Please wait..." type="submit" value="<visible submit copy>" />",
      ]
    `);

    expect(cta).toContain('class="w-form-done" role="status"');
    expect(cta).toContain('class="w-form-fail" role="alert"');
  });
});
