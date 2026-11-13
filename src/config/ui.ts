/**
 * Prototype UI switches (no per-brand values here; see brand.ts for identity).
 *
 * VALIDATION_FEEDBACK
 *  - "toast" (default): matches the BRM Submission Details design (Figma
 *    uuEDF0zS746imujffOsc75, "Submission Details w open errors" 736:32262):
 *    no page banner. Results arrive as NEXT snackbar toasts; errors stay visible
 *    in the status tag, tab badges, flagged cells and the Issue Resolution panel.
 *    Upload New Version / Submit live only in the header.
 *  - "banner": the earlier tinted validation cards with inline actions.
 */
export const VALIDATION_FEEDBACK: "toast" | "banner" = "toast";
