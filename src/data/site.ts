export const brand = {
  name: "Perfect Roofing & Waterproofing",
  shortName: "Perfect Roofing & Waterproofing",
  registration: "202103318512",
  phone: "+60 11-1188 8828",
  email: "",
  address: "No.1, Jalan USJ 1/2C, Taman Subang Permai, 47600 Subang Jaya, Selangor, Malaysia",
  serviceArea: "Kuala Lumpur & Selangor",
  productionUrl: undefined as string | undefined,
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/service" },
  { label: "Projects", href: "/gallery" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

type Service = {
  number: string;
  title: string;
  slug: string;
  href: string;
  image: string;
  imageSet: string;
  hoverImage: string;
  hoverImageSet: string;
  excerpt: string;
  details: string[];
  timeframe: string;
  budgetRange: string;
  detailCopy: { coverageIntro: string; ctaText: string };
  detailArticle?: { introTitle: string; signs: string[] };
  detailFaqs?: typeof faqs;
  visualSigns?: { title: string; text: string; image: string }[];
  repairMethods?: { title: string; text: string; icon: string }[];
  process?: {
    subtitle: string;
    image: string;
    imageSet: string;
    steps: { title: string; text: string }[];
  };
};

const roofingServices = [
  {
    title: "Roof Leak Detection & Repair",
    slug: "roof-leak-detection-repair",
    image: "/images/full-shot-roof.png",
    imageSet: "/images/full-shot-roof-p-500.png 500w, /images/full-shot-roof-p-800.png 800w, /images/full-shot-roof-p-1080.png 1080w, /images/full-shot-roof.png 1240w",
    hoverImage: "/images/roof.png",
    excerpt: "Find the source of roof leaks and repair damaged tiles, flashing, gutters, and affected roof areas.",
    details: ["Roof leak source inspection", "Tile and flashing repair", "Gutter and roof edge repair", "Ceiling water stain assessment"],
  },
  {
    title: "Roof Replacement & Re-roofing",
    slug: "roof-replacement-re-roofing",
    image: "/images/red-roof-2-2.png",
    imageSet: "/images/red-roof-2-2-p-500.png 500w, /images/red-roof-2-2-p-800.png 800w, /images/red-roof-2-2-p-1080.png 1080w",
    hoverImage: "/images/service-02-roof-replacement.png",
    excerpt: "Replace worn or extensively damaged roofing with a suitable new roof system for lasting protection.",
    details: ["Existing roof condition assessment", "Damaged roof removal", "Replacement material planning", "Re-roofing and final checks"],
  },
  {
    title: "Roof Maintenance & Inspection",
    slug: "roof-maintenance-inspection",
    image: "/images/full-shot-man-with-helmet-sitting-roof-2.png",
    imageSet: "/images/full-shot-man-with-helmet-sitting-roof-2-p-500.png 500w",
    hoverImage: "/images/service-03-roof-maintenance-inspection.png",
    excerpt: "Inspect roof condition and maintain vulnerable areas before small issues become costly leaks.",
    details: ["Roof condition inspection", "Tile and flashing checks", "Gutter maintenance", "Preventive repair recommendations"],
  },
  {
    title: "New Roof Installation",
    slug: "new-roof-installation",
    image: "/images/man-working-roof-front-view.png",
    imageSet: "/images/man-working-roof-front-view-p-500.png 500w, /images/man-working-roof-front-view-p-800.png 800w",
    hoverImage: "/images/service-04-new-roof-installation.png",
    excerpt: "Install new residential and commercial roofs with materials and details matched to the property.",
    details: ["Site and roof layout assessment", "Roof material selection", "New roof installation", "Completion inspection"],
  },
  {
    title: "Roof Waterproofing",
    slug: "roof-waterproofing",
    image: "/images/male-builder-doing-thermal-insulation-roof-wooden-frame-house-by-polyurethane-foam.png",
    imageSet: "/images/male-builder-doing-thermal-insulation-roof-wooden-frame-house-by-polyurethane-foam-p-500.png 500w, /images/male-builder-doing-thermal-insulation-roof-wooden-frame-house-by-polyurethane-foam-p-800.png 800w, /images/male-builder-doing-thermal-insulation-roof-wooden-frame-house-by-polyurethane-foam-p-1080.png 1080w",
    hoverImage: "/images/service-05-roof-waterproofing.png",
    excerpt: "Protect roofs and exposed surfaces with membrane, polyurethane, or coating solutions selected after inspection.",
    details: ["Torch On membrane", "Liquid membrane", "Polyurethane or PU membrane", "Waterproofing coating"],
  },
  {
    title: "PU Injection & Water Leakage Repair",
    slug: "pu-injection-water-leakage-repair",
    image: "/images/full-shot-man-with-helmet-sitting-roof-1.png",
    imageSet: "/images/full-shot-man-with-helmet-sitting-roof-1-p-500.png 500w",
    hoverImage: "/images/service-06-pu-injection.png",
    excerpt: "Treat water seepage and active leakage with targeted PU injection and suitable repair methods.",
    details: ["Leak path inspection", "PU injection where suitable", "Water seepage repair", "Post-repair checking"],
  },
];

export const services: Service[] = roofingServices.map((service, index) => ({
  ...service,
  number: String(index + 1).padStart(2, "0"),
  href: `/service/${service.slug}`,
  hoverImageSet: "",
  timeframe: "Inspection first; timing depends on the roof condition",
  budgetRange: "Quotation after site inspection",
  detailCopy: {
    coverageIntro: service.excerpt,
    ctaText: `Call or WhatsApp Perfect Roofing & Waterproofing about ${service.title.toLowerCase()} in Kuala Lumpur or Selangor. Share your property location and photos to arrange an inspection or quotation.`,
  },
  detailArticle: {
    introTitle: `When Do You Need ${service.title}?`,
    signs: service.details,
  },
  process: {
    subtitle: "We inspect the roof, explain the recommended scope, and complete the agreed work with a final check.",
    image: "/images/full-shot-man-with-helmet-sitting-roof-2.png",
    imageSet: "/images/full-shot-man-with-helmet-sitting-roof-2-p-500.png 500w",
    steps: [
      { title: "Inspect the roof", text: "Check the affected area and identify the likely cause." },
      { title: "Explain the solution", text: "Recommend the scope and provide a clear quotation." },
      { title: "Complete and check", text: "Carry out the approved work and review the finished area." },
    ],
  },
}));

const whatsappHref = `https://wa.me/${brand.phone.replace(/\D/g, "")}`;
const phoneHref = `tel:${brand.phone.replace(/[^\d+]/g, "")}`;

export const footerContactDirectory = [
  { label: "Call / WhatsApp", number: brand.phone, href: whatsappHref },
];

export const contactTeams = [
  { title: "Roofing & Waterproofing", number: brand.phone, source: "Perfect Roofing & Waterproofing", icon: "roof", whatsapp: whatsappHref, call: phoneHref },
];

export const officeContact = {
  title: "Perfect Roofing & Waterproofing",
  number: brand.phone,
  email: brand.email,
  address: brand.address,
  source: brand.name,
  call: phoneHref,
};

export const trustPoints = [
  { title: "Affordable Pricing, No Hidden Fees", text: "Clear quotations before roofing or waterproofing work begins." },
  { title: "One-Stop Solution for Leak Repairs", text: "Roof leak detection, repair, waterproofing, and water seepage solutions from one team." },
  { title: "31 Years of Industry Experience", text: "Decades of practical experience in roofing and waterproofing solutions." },
  { title: "24/7 Emergency Support", text: "Reach us by phone or WhatsApp when an urgent roof leak needs attention." },
  { title: "Free Consultation", text: "Discuss your roof or waterproofing concern before planning the next step." },
  { title: "KL & Selangor Coverage", text: "Roofing and waterproofing services across Kuala Lumpur and Selangor." },
];

export const absorbedServices = [
  { category: "Roof Repair", items: ["Roof leak detection", "Tile repair", "Flashing repair", "Gutter leak repair"] },
  { category: "Roof Replacement", items: ["Re-roofing", "Damaged roof replacement", "Roof material planning"] },
  { category: "Roof Maintenance", items: ["Roof inspection", "Preventive maintenance", "Condition assessment"] },
  { category: "New Roof Installation", items: ["Residential roofs", "Commercial roofs", "Installation checks"] },
  { category: "Waterproofing", items: ["Torch On membrane", "Liquid membrane", "PU membrane", "Waterproofing coating"] },
  { category: "Water Leakage Repair", items: ["PU injection", "Water seepage repair", "Leak path assessment"] },
];

export const testimonials = [
  {
    title: "Quick roof leak response",
    quote: "When I reached out to them for roof leaking issue in my home, their team was quick to respond and schedule a convenient appointment. The contractor arrived right on time and was incredibly professional and friendly.",
    name: "Simon Kuan",
    role: "Roof leaking customer",
    avatar: "/images/google-g.svg",
  },
  {
    title: "Detailed roofing advice",
    quote: "Very detailed advice for warehouse roofing. Took me a while to decide the most reasonable company for my warehouse's roofing. Recommended!",
    name: "Ruby J.",
    role: "Warehouse roofing customer",
    avatar: "/images/google-g.svg",
  },
  {
    title: "Skillful roof repair",
    quote: "I find this contractor is very skillful and experience handling my roof leaking problem. Thanks a lots!",
    name: "Azni Amer",
    role: "Roof leaking customer",
    avatar: "/images/google-g.svg",
  },
  {
    title: "Professional site advice",
    quote: "During the site visit, the team are very responsible and professional, they gives very professional advice about the damage and offered few solutions, from the most economical to long term solutions. Highly recommended.",
    name: "Muhamad Adzuan",
    role: "Roofing customer",
    avatar: "/images/google-g.svg",
  },
  {
    title: "Fast roof repair",
    quote: "Servis diorang memang terbaik! Cepat, efisien, dan profesional. Bumbung saya siap repair dalam masa singkat. Memang puas hati, wajib rekomen!",
    name: "Ahmad R.",
    role: "Roof repair customer",
    avatar: "/images/google-g.svg",
  },
  {
    title: "Good roof service",
    quote: "Harga berpatutuan, perkhidmatan yang baik.",
    name: "Shaliza",
    role: "Roofing customer",
    avatar: "/images/google-g.svg",
  },
  {
    title: "Roof leak solved",
    quote: "Alhadulillah, selesai sudah masalah bumbung bocor rumah. Local pakar worker dan harga boleh tahan juga. Boleh bincang lagi, very recommended.",
    name: "Hafiz",
    role: "Roofing customer",
    avatar: "/images/google-g.svg",
  },
];

export const faqs = [
  { question: "Can you inspect my roof before recommending repairs?", answer: "Yes. We assess the roof condition and likely leak source before explaining suitable repairs and providing a quotation." },
  { question: "Can you help with an emergency roof leak?", answer: "Call or WhatsApp +60 11-1188 8828 with your location and photos. We will advise the next inspection or repair step." },
  { question: "When should a roof be replaced instead of repaired?", answer: "A replacement may be appropriate when damage is widespread, materials are worn, or leaks keep returning. We recommend a site inspection before deciding." },
  { question: "What roof waterproofing solutions do you offer?", answer: "Depending on the roof and leak condition, options include Torch On membrane, liquid membrane, polyurethane or PU membrane, and waterproofing coating." },
  { question: "What is PU injection used for?", answer: "PU injection can help treat specific water seepage paths. We inspect the affected area first to confirm whether it is suitable." },
  { question: "Which areas do you serve?", answer: "Perfect Roofing & Waterproofing serves Kuala Lumpur and Selangor." },
];

export const projectImages = [
  { src: "/images/project-malaysia-roof-leak-repair.webp", set: "/images/project-malaysia-roof-leak-repair-p-800.webp 800w, /images/project-malaysia-roof-leak-repair.webp 1600w", alt: "Malaysian roofing workers repairing a tiled roof leak" },
  { src: "/images/project-malaysia-roof-replacement.webp", set: "/images/project-malaysia-roof-replacement-p-800.webp 800w, /images/project-malaysia-roof-replacement.webp 1600w", alt: "Malaysian roofing workers replacing tiles and re-roofing a home" },
  { src: "/images/project-malaysia-roof-inspection.webp", set: "/images/project-malaysia-roof-inspection-p-800.webp 800w, /images/project-malaysia-roof-inspection.webp 1600w", alt: "Malaysian roofing technician inspecting aged roof tiles" },
  { src: "/images/project-malaysia-new-roof-installation.webp", set: "/images/project-malaysia-new-roof-installation-p-800.webp 800w, /images/project-malaysia-new-roof-installation.webp 1600w", alt: "Malaysian roofing workers installing a new tiled roof" },
  { src: "/images/project-malaysia-waterproofing.webp", set: "/images/project-malaysia-waterproofing-p-800.webp 800w, /images/project-malaysia-waterproofing.webp 1600w", alt: "Malaysian worker applying roof waterproofing at a tiled-roof junction" },
  { src: "/images/project-malaysia-pu-injection.webp", set: "/images/project-malaysia-pu-injection-p-800.webp 800w, /images/project-malaysia-pu-injection.webp 1600w", alt: "Malaysian technician carrying out PU injection leakage repair" },
];

export const sourceSites = ["https://perfectroofing.com.my/"];
