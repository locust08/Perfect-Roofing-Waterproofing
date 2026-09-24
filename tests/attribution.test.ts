import { describe, expect, it } from "vitest";
import { captureFirstTouchAttribution, attributionForConversion } from "../src/scripts/attribution";

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("lead attribution", () => {
  it("retains first-touch campaign data and removes query strings from page context", () => {
    const storage = new MemoryStorage();
    const firstTouch = captureFirstTouchAttribution({
      storage,
      pathname: "/service/roof-leaking-waterproofing/",
      search: "?utm_source=google&utm_medium=cpc&utm_campaign=spring-roofing&gclid=test-gclid&email=not-attribution",
      referrer: "https://www.google.com/search?q=roof+repair&email=not-attribution",
    });
    const laterTouch = captureFirstTouchAttribution({
      storage,
      pathname: "/contact/",
      search: "?utm_source=other-source&fbclid=other-click-id",
      referrer: "https://example.com/ignored",
    });
    const conversion = attributionForConversion(firstTouch, "/contact/", "contact", "2026-09-24T04:00:00.000Z");

    expect(firstTouch).toMatchObject({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "spring-roofing",
      gclid: "test-gclid",
      landing_page: "/service/roof-leaking-waterproofing/",
      referrer: "https://www.google.com",
    });
    expect(firstTouch).not.toHaveProperty("email");
    expect(laterTouch).toEqual(firstTouch);
    expect(conversion).toMatchObject({
      conversion_page: "/contact/",
      conversion_type: "contact",
      timestamp: "2026-09-24T04:00:00.000Z",
    });
  });

  it("keeps normal enquiries valid when no attribution is available", () => {
    const firstTouch = captureFirstTouchAttribution({
      storage: new MemoryStorage(),
      pathname: "/contact/",
      search: "",
      referrer: "",
    });

    expect(firstTouch).toMatchObject({
      landing_page: "/contact/",
      referrer: "",
      utm_source: "",
      gclid: "",
    });
  });
});
