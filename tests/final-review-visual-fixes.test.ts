import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { services } from "../src/data/site";

const read = (file: string) => readFileSync(file, "utf8");

describe("final public presentation contracts", () => {
  test("every shipped redirect destination has an Astro route or public asset", () => {
    const redirects = read("public/_redirects").split(/\r?\n/).filter((line) => line.trim() && !line.startsWith("#"));
    const generatedServices = new Set(services.map(({ href }) => href));
    const missing = redirects.flatMap((line) => {
      const [, destination] = line.split(/\s+/);
      const route = destination.replace(/\/$/, "") || "/";
      const source = route === "/" ? "src/pages/index.astro" : `src/pages${route}.astro`;
      const asset = path.join("public", destination.replace(/^\//, ""));
      return existsSync(source) || existsSync(asset) || generatedServices.has(route) ? [] : [destination];
    });
    expect(missing).toEqual([]);
  });

  test("build redirect audit rejects a directory without a generated page", () => {
    const workspace = mkdtempSync(path.join(os.tmpdir(), "redirect-audit-"));
    try {
      mkdirSync(path.join(workspace, "dist", "service", "missing"), { recursive: true });
      writeFileSync(path.join(workspace, "dist", "_redirects"), "/legacy /service/missing 301\n");
      expect(() => execFileSync(process.execPath, [path.resolve("scripts/assert-redirect-destinations.mjs")], {
        cwd: workspace,
        stdio: "pipe",
      })).toThrow(/Redirect destinations missing from generated output/);
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  test("the legacy waterproofing slug redirects to the generated leak repair page", () => {
    expect(read("src/pages/service/roof-leaking-waterproofing.astro"))
      .toContain('Astro.redirect("/service/roof-leak-detection-repair", 301)');
  });

  test("contact form heading and submit value have their distinct approved copy", () => {
    const contact = read("src/pages/contact.astro");
    const formSection = [...contact.matchAll(/<section class="contact-section padding-top">([\s\S]*?)<\/section>/g)].at(-1)?.[1];
    expect(formSection).toMatch(/<h2 class="section-title">Get In Touch<\/h2>/);
    expect(formSection).toContain('type="submit" value="Send Enquiry"');
  });

  test("the process image uses the supplied Malaysian roofing team visual", () => {
    expect(read("src/pages/index.astro"))
      .toMatch(/<img alt="Malaysian roofing team installing a new roof" class="process-image"[^>]*src="\/images\/process-malaysian-roofing-team.webp"/);
  });

  test("footer service area and registration rows use fitting decorative icons", () => {
    const rows = [...read("src/components/Footer.astro").matchAll(/<div class="footer-touch-row">([\s\S]*?)<\/div>/g)]
      .map(([, row]) => row);
    expect(rows[1]).toContain('class="footer-service-area-icon"');
    expect(rows[2]).toContain('class="footer-registration-icon"');
  });

  test("the mobile navigation button contains a visible three-line icon", () => {
    const header = read("src/components/Header.astro");
    const css = read("public/css/plumber-roofily.webflow.css");
    expect(header.match(/<button[^>]*class="nav-trigger w-nav-button"[^>]*>([\s\S]*?)<\/button>/)?.[1]
      .match(/class="nav-trigger-line"/g)).toHaveLength(3);
    expect(css).toMatch(/\.nav-trigger-line\s*\{[^}]*background-color:\s*var\(--neutral-04\)/s);
  });
});
