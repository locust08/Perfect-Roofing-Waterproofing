import { describe, expect, it, vi } from "vitest";
import worker, { handleRequest, type EnquiryEnv } from "../worker/index";

const validSubmission = {
  name: "Test Customer",
  phone: "+6012 000 0000",
  email: "test@example.com",
  service: "roof-leaking-waterproofing",
  message: "This is a staging enquiry test.",
  form_type: "contact",
  page_path: "/contact/",
  company: "",
  "cf-turnstile-response": "valid-turnstile-token",
};

function request(body: unknown, method = "POST") {
  return new Request("https://perfect-roofing-waterproofing.easondev.workers.dev/api/enquiries", {
    method,
    headers: {
      "content-type": "application/json",
      "cf-connecting-ip": "203.0.113.10",
      "user-agent": "Vitest",
    },
    body: method === "POST" ? JSON.stringify(body) : undefined,
  });
}

function env(rateLimitSuccess = true): EnquiryEnv {
  return {
    ASSETS: { fetch: vi.fn() },
    ENQUIRY_RATE_LIMITER: {
      limit: vi.fn().mockResolvedValue({ success: rateLimitSuccess }),
    },
    TURNSTILE_SECRET: "test-turnstile-secret",
    TURNSTILE_EXPECTED_HOSTNAME: "perfect-roofing-waterproofing.easondev.workers.dev",
    RESEND_API_KEY: "test-resend-key",
    LEAD_RECIPIENT_EMAIL: "recipient@example.com",
    LEAD_SENDER_EMAIL: "Perfect Roofing Website <website-enquiries@example.com>",
  };
}

function externalFetch(turnstileSuccess = true) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url === "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
      return Response.json({
        success: turnstileSuccess,
        hostname: "perfect-roofing-waterproofing.easondev.workers.dev",
        action: "turnstile-spin-v2",
        "error-codes": turnstileSuccess ? [] : ["invalid-input-response"],
      });
    }

    if (url === "https://api.resend.com/emails") {
      expect(init?.method).toBe("POST");
      return Response.json({ id: "email_test_123" }, { status: 200 });
    }

    throw new Error(`Unexpected outbound URL: ${url}`);
  });
}

describe("POST /api/enquiries", () => {
  it("validates Turnstile, delivers a valid lead, and returns a unique lead_id", async () => {
    const fetcher = externalFetch();

    const response = await handleRequest(request(validSubmission), env(), { fetch: fetcher });
    const payload = await response.json() as { ok: boolean; lead_id: string };

    expect(response.status).toBe(201);
    expect(payload.ok).toBe(true);
    expect(payload.lead_id).toMatch(/^lead_[0-9a-f-]{36}$/);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(fetcher).toHaveBeenCalledTimes(2);

    const turnstileUrl = String(fetcher.mock.calls[0][0]);
    const deliveryUrl = String(fetcher.mock.calls[1][0]);
    expect(turnstileUrl).not.toContain(validSubmission.email);
    expect(deliveryUrl).not.toContain(validSubmission.email);
    expect(request(validSubmission).url).not.toContain(validSubmission.email);

    const deliveryBody = JSON.parse(String(fetcher.mock.calls[1][1]?.body));
    expect(deliveryBody.subject).toContain(payload.lead_id);
    expect(deliveryBody.text).toContain(validSubmission.name);
  });

  it("includes validated attribution in the Resend lead notification", async () => {
    const fetcher = externalFetch();
    const submission = {
      ...validSubmission,
      attribution: {
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "spring-roofing",
        utm_content: "responsive-search-ad",
        utm_term: "roof-repair",
        gclid: "test-gclid",
        gbraid: "test-gbraid",
        wbraid: "test-wbraid",
        fbclid: "test-fbclid",
        ttclid: "test-ttclid",
        landing_page: "/service/roof-leaking-waterproofing/",
        referrer: "https://www.google.com",
        conversion_page: "/contact/",
        conversion_type: "contact",
        timestamp: "2026-09-24T04:00:00.000Z",
      },
    };

    const response = await handleRequest(request(submission), env(), { fetch: fetcher });
    const deliveryBody = JSON.parse(String(fetcher.mock.calls[1][1]?.body));

    expect(response.status).toBe(201);
    expect(deliveryBody.text).toContain("UTM source: google");
    expect(deliveryBody.text).toContain("Click IDs: gclid=test-gclid, gbraid=test-gbraid, wbraid=test-wbraid, fbclid=test-fbclid, ttclid=test-ttclid");
    expect(deliveryBody.text).toContain("Landing page: /service/roof-leaking-waterproofing/");
    expect(deliveryBody.text).toContain("Referrer: https://www.google.com");
    expect(deliveryBody.text).toContain("Conversion page: /contact/");
    expect(deliveryBody.text).toContain("Conversion type: contact");
    expect(deliveryBody.text).toContain("Timestamp: 2026-09-24T04:00:00.000Z");
  });

  it("does not rebind the outbound fetch function", async () => {
    const fetcher = vi.fn(function (this: unknown, input: RequestInfo | URL) {
      if (this !== undefined) throw new TypeError("Illegal invocation");
      const url = String(input);
      if (url === "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
        return Promise.resolve(Response.json({
          success: true,
          hostname: "perfect-roofing-waterproofing.easondev.workers.dev",
          action: "turnstile-spin-v2",
        }));
      }
      return Promise.resolve(Response.json({ id: "email_test_123" }));
    });

    const response = await handleRequest(request(validSubmission), env(), { fetch: fetcher });

    expect(response.status).toBe(201);
  });

  it("rejects invalid and overlong fields without calling external services", async () => {
    const fetcher = externalFetch();
    const invalid = {
      ...validSubmission,
      name: "x".repeat(101),
      phone: "123",
      email: "not-an-email",
      service: "not-a-service",
      message: "",
    };

    const response = await handleRequest(request(invalid), env(), { fetch: fetcher });
    const payload = await response.json() as { ok: boolean; error: string; fields: Record<string, string> };

    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe("invalid_input");
    expect(Object.keys(payload.fields).sort()).toEqual(["email", "message", "name", "phone", "service"]);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("rejects a failed Turnstile verification before delivery", async () => {
    const fetcher = externalFetch(false);

    const response = await handleRequest(request(validSubmission), env(), { fetch: fetcher });
    const payload = await response.json() as { ok: boolean; error: string };

    expect(response.status).toBe(403);
    expect(payload).toEqual({ ok: false, error: "turnstile_failed" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("returns 429 before Turnstile or delivery when the rate limit is exceeded", async () => {
    const fetcher = externalFetch();

    const response = await handleRequest(request(validSubmission), env(false), { fetch: fetcher });
    const payload = await response.json() as { ok: boolean; error: string };

    expect(response.status).toBe(429);
    expect(payload).toEqual({ ok: false, error: "rate_limited" });
    expect(response.headers.get("retry-after")).toBe("60");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("requires POST and does not reflect submitted personal data in errors", async () => {
    const fetcher = externalFetch();
    const getResponse = await handleRequest(request(undefined, "GET"), env(), { fetch: fetcher });
    expect(getResponse.status).toBe(405);

    const turnstileResponse = await handleRequest(request(validSubmission), env(), { fetch: externalFetch(false) });
    const text = await turnstileResponse.text();
    expect(text).not.toContain(validSubmission.name);
    expect(text).not.toContain(validSubmission.email);
    expect(text).not.toContain(validSubmission.phone);
  });
});

describe("GET /api/posthog-config", () => {
  it("returns only the browser-safe shared project configuration", async () => {
    const response = await worker.fetch(
      new Request("https://perfect-roofing-waterproofing.easondev.workers.dev/api/posthog-config"),
      {
        ...env(),
        POSTHOG_PROJECT_TOKEN: "phc_shared_project",
        POSTHOG_HOST: "https://us.i.posthog.com",
      },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      projectToken: "phc_shared_project",
      host: "https://us.i.posthog.com",
    });
  });
});
