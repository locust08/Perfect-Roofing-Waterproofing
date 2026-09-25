import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { services, testimonials } from "../src/data/site";

const footer = readFileSync("src/components/Footer.astro", "utf8");
const layout = readFileSync("src/layouts/BaseLayout.astro", "utf8");
const home = readFileSync("src/pages/index.astro", "utf8");

describe("browser comment follow-ups", () => {
  test("links the footer address directly to Google Maps", () => {
    expect(footer).toContain("https://www.google.com/maps/search/?api=1&query=");
    expect(footer).toContain('class="footer-touch-text footer-address-link"');
    expect(footer).toContain('target="_blank"');
    expect(footer).toContain('rel="noopener"');
  });

  test("renders every footer service as its own service-page link", () => {
    expect(footer).toContain("services.map((service) =>");
    expect(footer).toContain('href={service.href}');
    for (const service of services) expect(service.href).toBe(`/service/${service.slug}`);
  });

  test("uses the Google review icon for every testimonial", () => {
    expect(new Set(testimonials.map(({ avatar }) => avatar))).toEqual(new Set(["/images/google-g.svg"]));
    expect(home).toContain('alt="Google review"');
  });

  test("keeps scroll-triggered counters and makes the effect clearly visible", () => {
    expect(home.match(/class="metrics-title js-count"/g)).toHaveLength(3);
    expect(home).toContain('data-count-duration="1600"');
    expect(layout).toContain('counter.dataset.countDuration');
    expect(layout).toContain("IntersectionObserver");
  });
});
