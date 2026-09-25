import { describe, expect, it, vi } from "vitest";
import { initializePostHog } from "../src/scripts/posthog";

describe("PostHog initialization", () => {
  it("treats an empty runtime configuration as unavailable", async () => {
    const client = {
      __loaded: false,
      init: vi.fn(),
      register: vi.fn(),
    };
    const browserWindow: Record<string, unknown> = {};
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));

    await expect(initializePostHog({ client, fetcher, browserWindow })).resolves.toBe(false);
    expect(client.init).not.toHaveBeenCalled();
    expect(client.register).not.toHaveBeenCalled();
  });

  it("initializes once with privacy-safe settings and registers the site name", async () => {
    const client = {
      __loaded: false,
      init: vi.fn(function () { client.__loaded = true; }),
      register: vi.fn(),
    };
    const browserWindow: Record<string, unknown> = {};
    const fetcher = vi.fn().mockResolvedValue(Response.json({
      projectToken: "phc_shared_project",
      host: "https://us.i.posthog.com",
    }));

    await initializePostHog({ client, fetcher, browserWindow });
    await initializePostHog({ client, fetcher, browserWindow });

    expect(client.init).toHaveBeenCalledTimes(1);
    expect(client.init).toHaveBeenCalledWith("phc_shared_project", expect.objectContaining({
      api_host: "https://us.i.posthog.com",
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      person_profiles: "identified_only",
    }));
    expect(client.register).toHaveBeenCalledWith({
      site_name: "Perfect Roofing & Waterproofing",
    });
  });
});
