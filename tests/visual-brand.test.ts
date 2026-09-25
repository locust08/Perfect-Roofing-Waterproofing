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

  test("uses the supplied hover artwork for services 02 through 06 in order", () => {
    expect(services.slice(1).map(({ hoverImage }) => hoverImage)).toEqual([
      "/images/service-02-roof-replacement.png",
      "/images/service-03-roof-maintenance-inspection.png",
      "/images/service-04-new-roof-installation.png",
      "/images/service-05-roof-waterproofing.png",
      "/images/service-06-pu-injection.png",
    ]);
  });

  test("uses six generated Malaysian project visuals in service order", () => {
    expect(projectImages.map(({ src }) => src)).toEqual([
      "/images/project-malaysia-roof-leak-repair.webp",
      "/images/project-malaysia-roof-replacement.webp",
      "/images/project-malaysia-roof-inspection.webp",
      "/images/project-malaysia-new-roof-installation.webp",
      "/images/project-malaysia-waterproofing.webp",
      "/images/project-malaysia-pu-injection.webp",
    ]);
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
