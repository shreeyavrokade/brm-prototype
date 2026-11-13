/**
 * ============================================================
 *  WHITE-LABEL BRAND CONFIG — the one place to rebrand the demo
 * ============================================================
 *
 * Three ways to rebrand (full guide: WHITE_LABEL.md):
 *
 *  • Design level — no code: replace the files in `public/brand/<preset>/`
 *    (`logo.svg` 200×40 for the header, `mark.svg` 32×32 for the browser tab)
 *    keeping the same file names.
 *  • Code level — copy a preset below, fill in the fields, and pick it with
 *    `?brand=<key>` in the URL, `VITE_BRAND=<key>` at build time, or
 *    DEFAULT_BRAND_ID.
 *  • Prompt level — ask Claude / Lovable with the prompt in WHITE_LABEL.md;
 *    AGENTS.md tells AI tools to change only this file and `public/brand/`.
 *
 * Internal identifiers (the `SPP_ENGINEER` view key, the `spp` component
 * folder, `Spp*` component names, the "Pending SPP Review" row-status key)
 * are deliberately unchanged so stored demo state and business logic keep
 * working. Only the text and images people see come from here.
 */

export interface BrandConfig {
  /** Preset key, used with `?brand=`. */
  id: string;
  /** Product name: header (next to the logo), password screen, browser tab. */
  productName: string;
  /** Full name of the organization being pitched to (the grid operator / RTO). */
  clientName: string;
  /** Short name used inside sentences: "Submit to {clientShortName} Model Build". */
  clientShortName: string;
  /** Compact code used in sample data: area codes, entity and owner columns. */
  clientCode: string;
  /** Who hands out the demo password, shown on the password screen. */
  coordinatorTitle: string;
  /** Header logo (public path or URL) and its accessible description. */
  logoSrc: string;
  logoAlt: string;
  /** Tailwind height class for the header logo. */
  logoClassName: string;
  /** Square mark used as the browser-tab icon. */
  faviconSrc: string;
  /** Show the product name beside the logo in the header. */
  showProductNameInHeader: boolean;
  /** Shared demo password for the access gate. Not a security control. */
  accessPassword: string;
}

/** Resolves a file in `public/` against the deploy base path (works under GitHub Pages sub-paths too). */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const BRAND_PRESETS = {
  /**
   * OPTIONAL PITCH PRESET — ERCOT (`?brand=ercot`). The logo in public/brand/ercot/ is a temporary text
   * wordmark; replace it with the official file before presenting.
   */
  ercot: {
    id: "ercot",
    productName: "Unified Submission Portal",
    clientName: "Electric Reliability Council of Texas",
    clientShortName: "ERCOT",
    clientCode: "ERCOT",
    coordinatorTitle: "ERCOT Planning Coordinator",
    logoSrc: asset("brand/ercot/logo.svg"),
    logoAlt: "ERCOT",
    logoClassName: "h-8 w-auto",
    faviconSrc: asset("brand/ercot/mark.svg"),
    showProductNameInHeader: true,
    accessPassword: "USP@2026",
  },
  /** Fictional demo client ("Acme" is the standard stand-in name). */
  acme: {
    id: "acme",
    productName: "Unified Submission Portal",
    clientName: "Acme Power & Grid",
    clientShortName: "Acme Grid",
    clientCode: "ACM",
    coordinatorTitle: "Acme Grid Planning Coordinator",
    logoSrc: asset("brand/acme/logo.svg"),
    logoAlt: "Acme Power & Grid (demo brand)",
    logoClassName: "h-8 w-auto",
    faviconSrc: asset("brand/acme/mark.svg"),
    showProductNameInHeader: true,
    accessPassword: "SPP2026",
  },
  /** Empty template: shows where the client's logo and name go. Use for design reviews. */
  placeholder: {
    id: "placeholder",
    productName: "Unified Submission Portal",
    clientName: "[Client Name]",
    clientShortName: "[Client]",
    clientCode: "CLT",
    coordinatorTitle: "[Client] Planning Coordinator",
    logoSrc: asset("brand/placeholder/logo.svg"),
    logoAlt: "Client logo placeholder",
    logoClassName: "h-8 w-auto",
    faviconSrc: asset("brand/placeholder/mark.svg"),
    showProductNameInHeader: true,
    accessPassword: "SPP2026",
  },
  /** Generic, unbranded operator wording. */
  neutral: {
    id: "neutral",
    productName: "Unified Submission Portal",
    clientName: "Regional Grid Operator",
    clientShortName: "Grid Operator",
    clientCode: "RGO",
    coordinatorTitle: "Planning Coordinator",
    logoSrc: asset("brand/neutral/logo.svg"),
    logoAlt: "Regional Grid Operator",
    logoClassName: "h-8 w-auto",
    faviconSrc: asset("brand/neutral/mark.svg"),
    showProductNameInHeader: true,
    accessPassword: "SPP2026",
  },
  /** Original client build, kept so the existing demo can still be shown. */
  spp: {
    id: "spp",
    productName: "Unified Submission Portal",
    clientName: "Southwest Power Pool",
    clientShortName: "SPP",
    clientCode: "SPP",
    coordinatorTitle: "SPP Planning Coordinator",
    logoSrc: asset("brand/spp/logo.png"),
    logoAlt: "SPP — Powering Progress",
    logoClassName: "h-8 w-auto",
    faviconSrc: asset("favicon.ico"),
    showProductNameInHeader: false,
    accessPassword: "SPP2026",
  },
} satisfies Record<string, BrandConfig>;

export type BrandId = keyof typeof BRAND_PRESETS;

export const DEFAULT_BRAND_ID: BrandId = "neutral";

const STORAGE_KEY = "usp_brand";

const isBrandId = (v: unknown): v is BrandId =>
  typeof v === "string" && Object.prototype.hasOwnProperty.call(BRAND_PRESETS, v);

/**
 * Precedence: `?brand=` in the URL → brand picked earlier in this tab →
 * VITE_BRAND → DEFAULT_BRAND_ID. The pick is kept in sessionStorage, so it
 * survives navigation and reloads in the same tab, but a new tab or browser
 * session starts from the build/default brand again.
 */
export function resolveBrandId(search = typeof window !== "undefined" ? window.location.search : ""): BrandId {
  const fromUrl = new URLSearchParams(search).get("brand");
  if (isBrandId(fromUrl)) {
    try {
      sessionStorage.setItem(STORAGE_KEY, fromUrl);
    } catch {
      /* storage blocked: the URL choice still applies */
    }
    return fromUrl;
  }
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (isBrandId(saved)) return saved;
  } catch {
    /* storage blocked: fall through */
  }
  const fromEnv = import.meta.env.VITE_BRAND;
  if (isBrandId(fromEnv)) return fromEnv;
  return DEFAULT_BRAND_ID;
}

/** The active brand. Read it anywhere: `brand.clientShortName`, `brand.logoSrc`, … */
export const brand: BrandConfig = BRAND_PRESETS[resolveBrandId()];

/** Apply document-level branding (tab title + favicon). Called once from main.tsx. */
export function applyDocumentBranding() {
  document.title = brand.productName;
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = brand.faviconSrc;
}
