export const ATTRIBUTION_STORAGE_KEY = "perfect-roofing:first-touch-attribution";

const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "ttclid",
] as const;

type AttributionKey = typeof attributionKeys[number];

export type FirstTouchAttribution = Record<AttributionKey, string> & {
  landing_page: string;
  referrer: string;
};

export type ConversionAttribution = FirstTouchAttribution & {
  conversion_page: string;
  conversion_type: string;
  timestamp: string;
};

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface CaptureOptions {
  storage: StorageLike;
  pathname: string;
  search: string;
  referrer: string;
}

function safeValue(value: string | null) {
  return (value || "").trim().slice(0, 256);
}

function queryFreePath(pathname: string) {
  const path = pathname.split(/[?#]/, 1)[0] || "/";
  return path.startsWith("/") ? path.slice(0, 200) : "/";
}

function referrerOrigin(referrer: string) {
  if (!referrer) return "";
  try {
    const url = new URL(referrer);
    return /^https?:$/.test(url.protocol) ? url.origin.slice(0, 512) : "";
  } catch {
    return "";
  }
}

function emptyFirstTouch(): FirstTouchAttribution {
  return {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    gclid: "",
    gbraid: "",
    wbraid: "",
    fbclid: "",
    ttclid: "",
    landing_page: "/",
    referrer: "",
  };
}

function storedFirstTouch(storage: StorageLike) {
  try {
    const raw = storage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const stored = parsed as Record<string, unknown>;
    const attribution = emptyFirstTouch();
    attributionKeys.forEach((key) => {
      attribution[key] = typeof stored[key] === "string" ? safeValue(stored[key]) : "";
    });
    attribution.landing_page = typeof stored.landing_page === "string" ? queryFreePath(stored.landing_page) : "/";
    attribution.referrer = typeof stored.referrer === "string" ? referrerOrigin(stored.referrer) : "";
    return attribution;
  } catch {
    return null;
  }
}

export function captureFirstTouchAttribution(options: CaptureOptions): FirstTouchAttribution {
  const existing = storedFirstTouch(options.storage);
  if (existing) return existing;

  const params = new URLSearchParams(options.search);
  const attribution = emptyFirstTouch();
  attributionKeys.forEach((key) => {
    attribution[key] = safeValue(params.get(key));
  });
  attribution.landing_page = queryFreePath(options.pathname);
  attribution.referrer = referrerOrigin(options.referrer);

  try {
    options.storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
  return attribution;
}

export function attributionForConversion(
  firstTouch: FirstTouchAttribution,
  conversionPage: string,
  conversionType: string,
  timestamp = new Date().toISOString(),
): ConversionAttribution {
  return {
    ...firstTouch,
    conversion_page: queryFreePath(conversionPage),
    conversion_type: safeValue(conversionType).slice(0, 32),
    timestamp,
  };
}
