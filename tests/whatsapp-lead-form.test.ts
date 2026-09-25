import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("global WhatsApp lead form", () => {
  it("is mounted once by the shared page layout", () => {
    const layout = read("src/layouts/BaseLayout.astro");

    expect(layout).toContain('import WhatsAppLeadForm from "../components/WhatsAppLeadForm.astro"');
    expect(layout.match(/<WhatsAppLeadForm\s*\/>/g)).toHaveLength(1);
  });

  it("provides a floating launcher and intercepts WhatsApp and enquiry actions", () => {
    const component = read("src/components/WhatsAppLeadForm.astro");

    expect(component).toContain('"id":"8113993d-5ce8-41c8-8996-dca8275229fd"');
    expect(component).not.toContain("d55b6a26-7985-4d29-ad9a-f0e1618c510a");
    expect(component).toContain('class="lr-launch" data-whatsapp-form-trigger');
    expect(component).not.toContain("<span>WhatsApp</span>");
    expect(component).toContain("background:#25d366;color:#fff");
    expect(component).toContain("matchesLink(anchor)");
    expect(component).toContain('.form-button[type="submit"][value="Send Enquiry"]');
    expect(component).toContain('aria-label="Let’s chat on WhatsApp"');
  });

  it("copies existing enquiry values and auto-submits through the shared lead route", () => {
    const component = read("src/components/WhatsAppLeadForm.astro");

    expect(component).toContain("function prefillFromEnquiry(sourceForm)");
    expect(component).toContain("function transferEnquiry(sourceForm,trigger)");
    expect(component).toContain("form.requestSubmit()");
    expect(component).toContain("if(pendingAutoSubmit)");
  });

  it("keeps both public enquiry buttons connected to the shared trigger selector", () => {
    const cta = read("src/components/CTA.astro");
    const contact = read("src/pages/contact.astro");
    const expectedButton = 'class="form-button w-button" data-wait="Please wait..." type="submit" value="Send Enquiry"';

    expect(cta).toContain(expectedButton);
    expect(contact).toContain(expectedButton);
  });
});
