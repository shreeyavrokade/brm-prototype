# White-label guide

How to rebrand the Unified Submission Portal for the client you're pitching to. Only names and images change; layouts, workflows and business logic stay the same.

## Brand presets

| Preset | Client name | Logo | Use it for |
| --- | --- | --- | --- |
| `ercot` | Electric Reliability Council of Texas (ERCOT) | **Temporary text wordmark**: replace with the official logo in `public/brand/ercot/` | The ERCOT pitch |
| `acme` | Acme Power & Grid | Fictional demo logo | Standard sales demos |
| `placeholder` | [Client Name] | "Your logo here" box | Design reviews and templates: shows where the brand goes |
| `neutral` **(default)** | Regional Grid Operator | Generic mark | Sales demos: brand-neutral baseline |
| `spp` | Southwest Power Pool | Original logo | The original client build |

**Switch presets:** add `?brand=<preset>` to the URL (e.g. `http://localhost:8080/?brand=placeholder`). The tab remembers it (navigation and reloads) until you pass another `?brand=`; a new tab starts from the default again. Precedence: URL → this tab's pick → `VITE_BRAND` → `DEFAULT_BRAND_ID`. For a build, set `VITE_BRAND=<preset>`. To change the default, edit `DEFAULT_BRAND_ID` in `src/config/brand.ts`.

## Three ways to rebrand

### 1. Design level: swap images, no code

Replace the files in `public/brand/<preset>/` and keep the same file names:

| File | Used for | Spec |
| --- | --- | --- |
| `logo.svg` | Header logo, password screen | SVG (or PNG), 200 × 40, transparent background, readable on white at 32 px tall |
| `mark.svg` | Browser-tab icon | Square SVG, 32 × 32 |

The easiest route is to overwrite `public/brand/acme/logo.svg` and `mark.svg` with the client's files. Figma: export the client's logo frame as SVG at 200 × 40.

### 2. Code level: add a preset

In [`src/config/brand.ts`](./src/config/brand.ts):

1. Create `public/brand/<newkey>/` with `logo.svg` and `mark.svg`.
2. Copy the `acme` block in `BRAND_PRESETS`, rename the key, and fill in the fields below.
3. Open the app with `?brand=<newkey>`, or make it the default.

| Field | Example (`acme`) | Where it shows up |
| --- | --- | --- |
| `productName` | Unified Submission Portal | Beside the logo in the header, password screen, browser tab title |
| `clientName` | Acme Power & Grid | Full client name (available for new screens) |
| `clientShortName` | Acme Grid | Every in-sentence reference: "Submit to **Acme Grid** Model Build", "Acme Grid Engineer View (EP)", review banners, toasts, MEM pass banners, transaction explainer, import help text |
| `clientCode` | ACM | Sample data: control area, owner and entity columns, area codes (`ACM-N`…), member list for internal/external counterparties |
| `coordinatorTitle` | Acme Grid Planning Coordinator | Password screen: "…supplied by your …" |
| `logoSrc` / `logoAlt` | `brand/acme/logo.svg` | Header and password-screen logo + screen-reader text |
| `logoClassName` | `h-8 w-auto` | Logo size in the header (Tailwind classes) |
| `faviconSrc` | `brand/acme/mark.svg` | Browser-tab icon |
| `showProductNameInHeader` | `true` | Show "\| Unified Submission Portal" next to the logo (turn off if the logo already includes it) |
| `accessPassword` | SPP2026 | Demo password gate. **Not a security control.** Change it per pitch if needed |

### 3. Prompt level: ask Claude or Lovable

Copy, fill in, and paste:

```text
Rebrand the portal for a new pitch, following WHITE_LABEL.md:
- Preset key: <key, e.g. northwind>
- Client name: <full name>      Short name in sentences: <short name>
- Data code (2–4 letters): <code>
- Coordinator title: <e.g. Northwind Planning Coordinator>
- Logo: <attached file / URL / "generate a simple placeholder logo">
- Make it the default: <yes/no>
Only change src/config/brand.ts and public/brand/<key>/. Log the change in TRACKER.md.
```

`AGENTS.md` tells AI tools to make brand changes only in those two places.

## Where the brand is used in code

If you need to change wording around the name, these are the files that read from `brand`:

| Area | File |
| --- | --- |
| Header logo, product name, view switcher label | `src/components/layout/GlobalHeader.tsx` |
| Password screen | `src/components/auth/PasswordGate.tsx` |
| Browser tab title + favicon | `applyDocumentBranding()` in `src/config/brand.ts`, called from `src/main.tsx` (static fallback title in `index.html`) |
| Validation banner + "Submit to … Model Build" | `src/components/submission/ValidationSummaryBanner.tsx`, `src/pages/RatingsSubmissionDetail.tsx`, `src/pages/ProfilesSubmissionDetail.tsx`, `src/pages/SubmissionDetail.tsx` |
| Topology import help text | `src/pages/ImportSubmission.tsx` |
| Transactions | `src/pages/TransactionImport.tsx`, `src/components/topology/TransactionActivitySheet.tsx`, `TransactionsTable.tsx`, `WorkflowExplainerModal.tsx` |
| Equipment | `src/components/topology/EquipmentGrid.tsx` |
| Engineer dashboard | `src/components/spp/BilateralTransactionsWidget.tsx`, `ReturnSubmissionModal.tsx` |
| MEM | `src/components/mem/PassHandoffBanner.tsx`, `SppModificationsCard.tsx`, `SppCellDot.tsx`, `ActivityDrawer.tsx`, `SectionWorkspace.tsx`, `ForecastGrid.tsx`, `RowStatusPill.tsx`, `genDatasets.ts`, `loadDatasets.ts`; `src/pages/MEMLoadReview.tsx` |
| Sample data | `src/components/topology/mockTransactions.ts`, `mockProfileSeries.ts`, `mockRatingsSubmission.ts`, `transactionDetailMock.ts` |

When adding new screens, use the brand instead of typing a client name:

```tsx
import { brand } from "@/config/brand";

<p>Submitted to {brand.clientShortName} for review.</p>
```

## Intentionally not changed

These are internal identifiers, not visible text. Renaming them would reset saved demo state or touch business logic:

- The `SPP_ENGINEER` portal-view key (`src/store/portalContextStore.ts`), which is stored in browser storage.
- The `"Pending SPP Review"` row-status key (`src/store/rowReviewStore.ts`). Only its **label** is rebranded, in `RowStatusPill.tsx`.
- The `src/components/spp/` folder, `Spp*` component names, and the `spp-review` pass-state key.

## Still client-specific: follow-ups

Tracked in `TRACKER.md`:

- **Sample utility names:** mock data still lists real utilities from the original client's footprint (e.g. AEP, Westar, OG&E, KCP&L, Sunflower Electric, City of Wichita, KEPCO in submission names, Xcel Energy). Swap them for fictional names to meet PRD §12.5.
- **Brand colors:** the accent color is not in the brand config yet. It lives in the theme tokens in `src/index.css` (`--brand`) and `tailwind.config.ts`.
- **Share preview:** the `og:image` / `twitter:image` preview in `index.html` is a Lovable screenshot of the original build.
