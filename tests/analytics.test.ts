import { describe, expect, it } from "vitest";
import { createDataLayerTracker, createPostHogTracker } from "../public/js/analytics.js";

describe("dataLayer analytics", () => {
  it("pushes only approved non-PII conversion fields", () => {
    const dataLayer: Array<Record<string, string>> = [];
    const track = createDataLayerTracker(dataLayer);

    track("form_success", {
      lead_id: "lead_123",
      form_id: "contact-form",
      conversion_type: "contact",
      name: "Customer Name",
      phone: "+60120000000",
      email: "customer@example.com",
      message: "A private message",
      page_url: "/contact/?email=customer@example.com",
    });

    expect(dataLayer).toEqual([{
      event: "form_success",
      lead_id: "lead_123",
      form_id: "contact-form",
      conversion_type: "contact",
    }]);
  });

  it("keeps only known event names and safe dimensions", () => {
    const dataLayer: Array<Record<string, string>> = [];
    const track = createDataLayerTracker(dataLayer);

    track("service_view", { service_slug: "roof-leaking-waterproofing", referrer: "https://example.com" });
    track("not_an_event", { service_slug: "roof-leaking-waterproofing" });

    expect(dataLayer).toEqual([{
      event: "service_view",
      service_slug: "roof-leaking-waterproofing",
    }]);
  });

  it("adds the site and hostname to PostHog without sending form PII", () => {
    const captures: Array<[string, Record<string, string>]> = [];
    const track = createPostHogTracker(
      (eventName, properties) => captures.push([eventName, properties]),
      "perfect-roofing-waterproofing.easondev.workers.dev",
    );

    track("form_success", {
      lead_id: "lead_123",
      form_id: "contact-form",
      conversion_type: "contact",
      name: "Customer Name",
      phone: "+60120000000",
      email: "customer@example.com",
      message: "A private message",
    });

    expect(captures).toEqual([["form_success", {
      lead_id: "lead_123",
      form_id: "contact-form",
      conversion_type: "contact",
      site_name: "Perfect Roofing & Waterproofing",
      hostname: "perfect-roofing-waterproofing.easondev.workers.dev",
    }]]);
  });
});
