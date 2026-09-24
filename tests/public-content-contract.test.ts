import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const read = (file: string) => readFileSync(file, "utf8");
const contact = read("src/pages/contact.astro");
const forbidden = /Boon Chye|boonchyeplumbing@live\.com\.my|1350531-M|\+6012 796 0061|\+6011 1239 3139|\+6012 612 3690|\+6012 272 0201|\+6014 641 0788|03-56381676|plumb|electrical|renovation|sewer|drainage|grease trap|water pump|one-stop property contractor|20\+ Years|5 service categories/i;

function publicSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? publicSourceFiles(file) : [file];
  });
}

describe("public roofing content", () => {
  test("customer-facing pages and components contain no inherited trade or contact data", () => {
    const files = [
      ...publicSourceFiles("src/pages"),
      ...publicSourceFiles("src/components"),
      "src/data/site.ts",
    ];
    const violations = files.flatMap((file) => {
      const matches = [...read(file).matchAll(new RegExp(forbidden, "gi"))];
      return matches.map((match) => `${file}: ${match[0]}`);
    });
    expect(violations).toEqual([]);
  });

  test("contact page presents roofing enquiries and the one approved number", () => {
    expect(contact).toContain("Get In Touch");
    expect(contact).toContain("Need help with a roof leak or waterproofing problem?");
    expect(contact).toContain("Send Enquiry");
    expect(contact).toContain("WhatsApp +60 11-1188 8828");
    expect(contact).not.toContain("mailto:");
    expect(contact).not.toMatch(/contact-card-label[^>]*>Email/i);
  });

  test("six visible service choices and inspection option use backend-compatible values", () => {
    for (const label of [
      "Roof Leak Detection & Repair",
      "Roof Replacement & Re-roofing",
      "Roof Maintenance & Inspection",
      "New Roof Installation",
      "Roof Waterproofing",
      "PU Injection & Water Leakage Repair",
    ]) {
      expect(contact).toContain(`<option value="roof-leaking-waterproofing">${label}</option>`);
    }
    expect(contact).toContain('<option value="">Not Sure / Need Inspection</option>');
  });

  test("contact form retains submission, validation, and response hooks", () => {
    for (const required of [
      'action="/api/enquiries"', 'data-enquiry-form', 'method="post"', 'name="contact-form"',
      'name="form_type"', 'value="contact"', 'class="cf-turnstile"',
      'data-action="turnstile-spin-v2"', 'class="w-form-done"', 'class="w-form-fail"',
    ]) expect(contact).toContain(required);
    for (const [id, name] of [
      ["contact-name", "name"], ["contact-email", "email"], ["contact-phone", "phone"],
      ["contact-service", "service"], ["contact-message", "message"], ["contact-company", "company"],
    ]) expect(contact).toMatch(new RegExp(`id="${id}"[^>]*name="${name}"|name="${name}"[^>]*id="${id}"`));
    for (const required of [
      'id="contact-name" maxlength="100" name="name" placeholder="Enter full name" required type="text"',
      'id="contact-email" maxlength="254" name="email" placeholder="Enter email address (optional)" type="email"',
      'id="contact-phone" maxlength="30" name="phone" placeholder="Enter phone number" required type="tel"',
      'id="contact-message" maxlength="2000" minlength="10" name="message"',
      'autocomplete="off" id="contact-company" name="company" tabindex="-1" type="text"',
      'data-sitekey={turnstileSiteKey}', 'data-copy-value={team.number}',
    ]) expect(contact).toContain(required);
  });

  test("the existing roof-repair article redirects to a generated service route", () => {
    expect(read("src/pages/blogs/diy-vs-professional-roof-repairs-what-you-should-know.astro"))
      .toContain('Astro.redirect("/service/roof-leak-detection-repair", 301)');
  });

  const base = process.env.VISUAL_REVAMP_BASE_SHA;
  test.skipIf(!base)("revamp commit history contains no protected integration changes", () => {
    const changed = execFileSync("git", ["diff", "--name-only", `${base}...HEAD`], { encoding: "utf8" }).trim().split(/\r?\n/);
    const protectedPath = /^(worker\/|src\/scripts\/|src\/layouts\/BaseLayout\.astro$|public\/js\/analytics\.js$|wrangler\.jsonc$|tests\/(?:analytics|attribution|enquiry-worker)\.test\.ts$)/;
    expect(changed.filter((file) => protectedPath.test(file))).toEqual([]);
  });
});
