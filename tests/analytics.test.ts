import { describe, expect, it } from "vitest";
import { createDataLayerTracker } from "../public/js/analytics.js";

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
});
