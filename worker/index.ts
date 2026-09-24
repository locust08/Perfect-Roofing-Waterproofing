const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_EMAIL_URL = "https://api.resend.com/emails";
const TURNSTILE_ACTION = "turnstile-spin-v2";
const MAX_REQUEST_BYTES = 16_384;

const serviceSlugs = new Set([
  "roof-leaking-waterproofing",
  "plumbing-water-pump",
  "electrical",
  "renovation",
  "sewerage-drainage",
]);

interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface AssetsBinding {
  fetch(request: Request): Promise<Response>;
}

export interface EnquiryEnv {
  ASSETS: AssetsBinding;
  ENQUIRY_RATE_LIMITER: RateLimiter;
  TURNSTILE_SECRET?: string;
  TURNSTILE_EXPECTED_HOSTNAME?: string;
  RESEND_API_KEY?: string;
  LEAD_RECIPIENT_EMAIL?: string;
  LEAD_SENDER_EMAIL?: string;
}

interface EnquiryDependencies {
  fetch: typeof fetch;
}

const workerFetch: typeof fetch = (input, init) => globalThis.fetch(input, init);

interface EnquirySubmission {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  formType: string;
  pagePath: string;
  turnstileToken: string;
  company: string;
}

interface TurnstileResult {
  success?: boolean;
  hostname?: string;
  action?: string;
}

const responseHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

function json(payload: unknown, status: number, extraHeaders: Record<string, string> = {}) {
  return Response.json(payload, {
    status,
    headers: { ...responseHeaders, ...extraHeaders },
  });
}

function readString(source: Record<string, unknown>, key: string) {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function validateSubmission(source: unknown) {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return { errors: { form: "Invalid submission." } };
  }

  const body = source as Record<string, unknown>;
  const submission: EnquirySubmission = {
    name: readString(body, "name"),
    phone: readString(body, "phone"),
    email: readString(body, "email"),
    service: readString(body, "service"),
    message: readString(body, "message"),
    formType: readString(body, "form_type"),
    pagePath: readString(body, "page_path"),
    turnstileToken: readString(body, "cf-turnstile-response"),
    company: readString(body, "company"),
  };

  const errors: Record<string, string> = {};
  if (submission.name.length < 2 || submission.name.length > 100) {
    errors.name = "Enter a name between 2 and 100 characters.";
  }

  const phoneDigits = submission.phone.replace(/\D/g, "");
  if (
    submission.phone.length > 30
    || phoneDigits.length < 7
    || phoneDigits.length > 20
    || !/^[+()\d.\s-]+$/.test(submission.phone)
  ) {
    errors.phone = "Enter a valid phone number.";
  }

  if (
    submission.email.length > 254
    || (submission.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email))
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (submission.service && !serviceSlugs.has(submission.service)) {
    errors.service = "Choose a valid service.";
  }

  if (submission.message.length < 10 || submission.message.length > 2_000) {
    errors.message = "Enter a message between 10 and 2000 characters.";
  }

  if (submission.formType.length > 32 || submission.pagePath.length > 200 || submission.company.length > 200) {
    errors.form = "Invalid submission.";
  }

  if (!submission.turnstileToken || submission.turnstileToken.length > 2_048) {
    errors.turnstile = "Complete the security check.";
  }

  return Object.keys(errors).length ? { errors } : { submission };
}

async function hashRateLimitKey(request: Request) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const userAgent = request.headers.get("User-Agent") || "unknown";
  const data = new TextEncoder().encode(`${ip}|${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function verifyTurnstile(
  submission: EnquirySubmission,
  request: Request,
  env: EnquiryEnv,
  dependencies: EnquiryDependencies,
) {
  const externalFetch = dependencies.fetch;
  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET || "",
    response: submission.turnstileToken,
    idempotency_key: crypto.randomUUID(),
  });
  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await externalFetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) return false;

  const result = await response.json() as TurnstileResult;
  return result.success === true
    && result.action === TURNSTILE_ACTION
    && result.hostname === env.TURNSTILE_EXPECTED_HOSTNAME;
}

function leadText(leadId: string, submission: EnquirySubmission) {
  return [
    `Lead ID: ${leadId}`,
    `Name: ${submission.name}`,
    `Phone: ${submission.phone}`,
    `Email: ${submission.email || "Not provided"}`,
    `Service: ${submission.service || "Not provided"}`,
    `Form: ${submission.formType || "Not provided"}`,
    `Page: ${submission.pagePath || "Not provided"}`,
    "",
    "Message:",
    submission.message,
  ].join("\n");
}

async function deliverLead(
  leadId: string,
  submission: EnquirySubmission,
  env: EnquiryEnv,
  dependencies: EnquiryDependencies,
) {
  const externalFetch = dependencies.fetch;
  const response = await externalFetch(RESEND_EMAIL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": leadId,
    },
    body: JSON.stringify({
      from: env.LEAD_SENDER_EMAIL,
      to: [env.LEAD_RECIPIENT_EMAIL],
      subject: `New website enquiry · ${leadId}`,
      text: leadText(leadId, submission),
    }),
  });

  return response.ok;
}

export async function handleRequest(
  request: Request,
  env: EnquiryEnv,
  dependencies: EnquiryDependencies = { fetch: workerFetch },
) {
  if (request.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405, { Allow: "POST" });
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && origin !== requestUrl.origin) {
    return json({ ok: false, error: "forbidden_origin" }, 403);
  }

  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, error: "unsupported_media_type" }, 415);
  }

  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  let rawBody = "";
  let body: unknown;
  try {
    rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return json({ ok: false, error: "payload_too_large" }, 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const validation = validateSubmission(body);
  if ("errors" in validation) {
    return json({ ok: false, error: "invalid_input", fields: validation.errors }, 400);
  }

  const requiredConfig = [
    env.TURNSTILE_SECRET,
    env.TURNSTILE_EXPECTED_HOSTNAME,
    env.RESEND_API_KEY,
    env.LEAD_RECIPIENT_EMAIL,
    env.LEAD_SENDER_EMAIL,
    env.ENQUIRY_RATE_LIMITER,
  ];
  if (requiredConfig.some((value) => !value)) {
    return json({ ok: false, error: "service_unavailable" }, 503);
  }

  const rateLimitKey = await hashRateLimitKey(request);
  const rateLimit = await env.ENQUIRY_RATE_LIMITER.limit({ key: rateLimitKey });
  if (!rateLimit.success) {
    return json({ ok: false, error: "rate_limited" }, 429, { "Retry-After": "60" });
  }

  const submission = validation.submission;
  const leadId = `lead_${crypto.randomUUID()}`;

  if (submission.company) {
    return json({ ok: true, lead_id: leadId }, 201);
  }

  let turnstileValid = false;
  try {
    turnstileValid = await verifyTurnstile(submission, request, env, dependencies);
  } catch (error) {
    console.error("turnstile_verification_error", error instanceof Error ? error.message : "unknown");
    return json({ ok: false, error: "verification_unavailable" }, 503);
  }
  if (!turnstileValid) {
    return json({ ok: false, error: "turnstile_failed" }, 403);
  }

  try {
    const delivered = await deliverLead(leadId, submission, env, dependencies);
    if (!delivered) return json({ ok: false, error: "delivery_failed" }, 502);
  } catch {
    return json({ ok: false, error: "delivery_unavailable" }, 503);
  }

  return json({ ok: true, lead_id: leadId }, 201);
}

export default {
  async fetch(request: Request, env: EnquiryEnv) {
    const url = new URL(request.url);
    if (url.pathname === "/api/enquiries") {
      return handleRequest(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
