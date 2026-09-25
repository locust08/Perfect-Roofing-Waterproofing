const SITE_NAME = "Perfect Roofing & Waterproofing";

interface PostHogClient {
  __loaded?: boolean;
  init: (token: string, options: Record<string, unknown>) => void;
  register: (properties: Record<string, string>) => void;
  capture?: (eventName: string, properties?: Record<string, string>) => void;
}

interface PostHogWindow {
  __perfectPostHogInitialized?: boolean;
  posthog?: PostHogClient;
  location?: { hostname?: string };
  PerfectRoofingAnalytics?: {
    flushPostHogEvents?: (capture: (eventName: string, properties?: Record<string, string>) => void, hostname: string) => void;
  };
}

interface InitializeOptions {
  client: PostHogClient;
  fetcher: typeof fetch;
  browserWindow: PostHogWindow;
}

export async function initializePostHog({ client, fetcher, browserWindow }: InitializeOptions) {
  if (browserWindow.__perfectPostHogInitialized) return false;
  browserWindow.__perfectPostHogInitialized = true;

  let response: Response;
  try {
    response = await fetcher("/api/posthog-config", { credentials: "same-origin" });
  } catch {
    return false;
  }
  if (!response.ok || response.status === 204) return false;

  let config: { projectToken?: string; host?: string };
  try {
    config = await response.json() as { projectToken?: string; host?: string };
  } catch {
    return false;
  }
  if (!config.projectToken) return false;

  if (!client.__loaded) {
    client.init(config.projectToken, {
      api_host: config.host || "https://us.i.posthog.com",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      capture_exceptions: true,
      disable_session_recording: true,
      person_profiles: "identified_only",
    });
  }
  client.register({ site_name: SITE_NAME });
  browserWindow.posthog = client;

  if (typeof client.capture === "function") {
    browserWindow.PerfectRoofingAnalytics?.flushPostHogEvents?.(
      client.capture.bind(client),
      browserWindow.location?.hostname || "",
    );
  }
  return true;
}
