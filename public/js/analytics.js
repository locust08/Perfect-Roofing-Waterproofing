const eventNames = new Set([
  "cta_click",
  "form_view",
  "form_start",
  "form_submit",
  "form_success",
  "form_error",
  "whatsapp_click",
  "phone_click",
  "email_click",
  "service_view",
]);

const safeDimensions = new Set([
  "lead_id",
  "form_id",
  "conversion_type",
  "error_code",
  "click_area",
  "service_slug",
]);

export function createDataLayerTracker(dataLayer) {
  return (eventName, details = {}) => {
    if (!eventNames.has(eventName)) return;

    const event = { event: eventName };
    Object.entries(details).forEach(([key, value]) => {
      if (!safeDimensions.has(key) || typeof value !== "string") return;
      const safeValue = value.trim().slice(0, 128);
      if (safeValue) event[key] = safeValue;
    });
    dataLayer.push(event);
  };
}

export function trackEvent(eventName, details = {}) {
  window.dataLayer = window.dataLayer || [];
  createDataLayerTracker(window.dataLayer)(eventName, details);
}

function clickArea(target) {
  return target.closest("header") ? "header" : target.closest("footer") ? "footer" : "content";
}

function trackLinkClick(event) {
  const target = event.target.closest?.("a[href], [data-cta]");
  if (!target) return;
  const href = target.getAttribute("href") || "";
  const area = clickArea(target);
  if (/^(https?:)?\/\/([^/]+\.)?wa\.me\//i.test(href) || /^https:\/\/api\.whatsapp\.com\//i.test(href)) {
    trackEvent("whatsapp_click", { click_area: area });
  } else if (href.startsWith("tel:")) {
    trackEvent("phone_click", { click_area: area });
  } else if (href.startsWith("mailto:")) {
    trackEvent("email_click", { click_area: area });
  } else if (target.matches("a.w-button, a[class*='button-style'], [data-cta]")) {
    trackEvent("cta_click", { click_area: area });
  }
}

const viewedForms = new WeakSet();
const startedForms = new WeakSet();

function formDetails(form) {
  return {
    form_id: form.getAttribute("name") || "enquiry-form",
    conversion_type: form.querySelector('[name="form_type"]')?.value || "",
  };
}

function trackFormView(form) {
  if (viewedForms.has(form)) return;
  viewedForms.add(form);
  trackEvent("form_view", formDetails(form));
}

export function initAutomaticEvents() {
  const forms = document.querySelectorAll("[data-enquiry-form]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        trackFormView(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    forms.forEach((form) => observer.observe(form));
  } else {
    forms.forEach(trackFormView);
  }

  const serviceMatch = window.location.pathname.match(/^\/service\/([a-z0-9-]+)\/?$/);
  if (serviceMatch) trackEvent("service_view", { service_slug: serviceMatch[1] });

  document.addEventListener("focusin", (event) => {
    const form = event.target.closest?.("[data-enquiry-form]");
    if (!form || startedForms.has(form)) return;
    startedForms.add(form);
    trackEvent("form_start", formDetails(form));
  }, true);
  document.addEventListener("click", trackLinkClick, true);
}

if (typeof window !== "undefined") {
  window.PerfectRoofingAnalytics = { formDetails, initAutomaticEvents, trackEvent };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAutomaticEvents, { once: true });
  } else {
    initAutomaticEvents();
  }
}
