# PRD Delivery and Verification Tracker

**Source:** [PRD.md](./PRD.md)  
**Created:** November 11, 2026  
**Scope:** Unified Submission Portal — BRM front-end prototype and NEXT white-label adoption

Each row tracks a PRD requirement. Initial statuses are **Needs verification**: the PRD describes existing behavior, but this tracker does not certify that behavior. Owners and target dates are unassigned. No product priorities or delivery deadlines have been inferred.

Update the status, owner, target date, and evidence as work progresses. Link defects by tracker ID. Mark a requirement Done only after its expected behavior has been checked and evidence recorded.

**Statuses:** Needs verification · To do · In progress · Blocked · Done. Use Blocked with a dependency or reason in Evidence / next action.

## Requirements

### 4.1 Application shell and navigation

| ID | Requirement | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| REQ-4.1-01 | Provide a global header, participant navigation, responsive application layout, and status notifications. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.1-02 | Support the participant and SPP engineer perspectives through a global view switcher. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.1-03 | Preserve the selected portal perspective across page navigation and browser reloads where browser storage is available. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.1-04 | Provide routes for BRM, submission details and imports, transaction imports and details, Profiles, Ratings, MEM, and MEM Load Review. | Needs verification | Unassigned | — | Record implementation and verification evidence. |

### 4.2 BRM workspace

| ID | Requirement | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| REQ-4.2-01 | Provide tabs for Topology Changeset, Profiles, Ratings, Equipment Details, and Transactions. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.2-02 | Allow users to search relevant directories and inspect submission/detail views. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.2-03 | Display submission status and review-needed counts using the shared status system. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.2-04 | Support opening submission details and related issue-resolution experiences. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.2-05 | Mark tracked modules as visited when their corresponding BRM tab is opened during the current MEM pass. | Needs verification | Unassigned | — | Record implementation and verification evidence. |

### 4.3 Submission intake

| ID | Requirement | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| REQ-4.3-01 | Provide a multi-step import experience for topology, ratings, and profiles submissions. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.3-02 | Accept the configured file types for each submission kind and display selected file metadata. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.3-03 | Collect the applicable submission details and supporting information. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.3-04 | Allow draft and submit actions, with visible confirmation feedback and return navigation. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.3-05 | Use client-side demo stores to reflect topology submissions in the BRM workspace. | Needs verification | Unassigned | — | Record implementation and verification evidence. |

### 4.4 Submission review and validation [P1] [P3]

| ID | Requirement | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| REQ-4.4-01 | Support Draft, Review Needed, Pending Validation, Pending Submittal, Accepted, and Rejected for Topology, Ratings, and Profiles. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.4-02 | Derive review state from issue counts only for active Draft or Review Needed datasets; preserve terminal or in-flight states such as Accepted, Rejected, Pending Validation, and Pending Submittal. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.4-03 | When a dataset is under Review Needed, show relevant validation errors and warnings, highlight affected cells, and provide issue resolution. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.4-04 | Allow users to navigate between issue cards and affected grid rows/cells where supported. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.4-05 | Suppress issue indicators and issue-resolution UI for datasets not in Review Needed. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.4-06 | When issues are cleared, update the displayed state and status indicators consistently. | Needs verification | Unassigned | — | Record implementation and verification evidence. |

### 4.5 Ratings and Profiles [P2] [P6]

| ID | Requirement | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| REQ-4.5-01 | Provide searchable directories and submission detail pages for Ratings and Profiles. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.5-02 | Support inspection grids with row/cell issue details and shared review interactions. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.5-03 | Support dataset-specific details such as rating seasons and profile categories. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.5-04 | Keep status indicators and issue counts in sync with the current client-side review state. | Needs verification | Unassigned | — | Record implementation and verification evidence. |

### 4.6 Equipment Details

| ID | Requirement | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| REQ-4.6-01 | Provide BRM equipment inspection and equipment-specific grids. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.6-02 | Support equipment detail requirements and review treatment through the existing equipment schemas and components. | Needs verification | Unassigned | — | Record implementation and verification evidence. |

### 4.7 Bilateral Transactions [P4] [P5] [P12] [P13]

| ID | Requirement | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| REQ-4.7-01 | Provide a searchable Transactions view and transaction detail/activity experiences. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.7-02 | Support transaction import with a three-step demo flow and optional proof file for applicable external counterparties. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.7-03 | Represent CP1 and CP2 acknowledgment independently. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.7-04 | Move a transaction into the EP review queue when both parties have acknowledged. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.7-05 | Support the participant counter-offer/acknowledgment loop and the SPP engineer approve or reject/return flow. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.7-06 | Store rejection/return notes in the in-memory transaction record and reset acknowledgments when returned for revision. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.7-07 | Provide a workflow explainer that simulates lifecycle states without mutating live transaction records. | Needs verification | Unassigned | — | Record implementation and verification evidence. |

### 4.8 Market Economic Model [P7] [P8] [P9] [P10]

| ID | Requirement | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| REQ-4.8-01 | Provide separate Generation and Load tracks with a guided checklist, section workspace, and reference datasets. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.8-02 | Provide dataset grids for reviewing or editing demo data, with validation feedback and row-level review affordances. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.8-03 | Include pass handoff messaging and SPP modification summaries where applicable. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.8-04 | Support focus mode for opening an individual dataset from the checklist. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.8-05 | Track pass number and participant/SPP review state in the demo store. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.8-06 | Persist module visits by track and pass in browser storage when available. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.8-07 | Reset pass-specific review state when the pass changes. | Needs verification | Unassigned | — | Record implementation and verification evidence. |

### 4.9 SPP engineer command center [P11]

| ID | Requirement | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| REQ-4.9-01 | Provide cycle selection and footprint filters. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.9-02 | Show the review milestone stepper and BRM metric cards. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.9-03 | Provide a BRM intake queue with validation state and approve/return actions. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.9-04 | Show bilateral transactions ready for SPP review and actions to approve or return them. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.9-05 | Provide a footprint participation/report-card area. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-4.9-06 | Reflect engineer actions in the same client-side stores used by participant views where supported. | Needs verification | Unassigned | — | Record implementation and verification evidence. |

### 5 Status, feedback, and visual system

| ID | Requirement | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| REQ-5-01 | Use the shared status tokens and status pill component as the canonical source for common lifecycle colors. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-5-02 | Use consistent visual treatment for validation severity, acknowledgment state, and actionable review states. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-5-03 | Provide visible success/error feedback for user actions through the existing toast components. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-5-04 | Preserve table usability, including search, sorting or filtering where implemented, horizontal scrolling, and row/cell highlighting. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-5-05 | Keep the interface responsive across narrow and wide layouts using the existing Tailwind and component-library patterns. | Needs verification | Unassigned | — | Record implementation and verification evidence. |

### 6 Technical requirements

| ID | Requirement | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| REQ-6-01 | Node.js-compatible front-end project managed with npm; Bun lockfiles are also present. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-02 | Vite 5 for development and production builds. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-03 | React 18 with TypeScript. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-04 | React Router for client-side routes. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-05 | Tailwind CSS 3 with the project theme configuration. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-06 | shadcn-style components built on Radix UI primitives. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-07 | Lucide and Phosphor icons as used by existing components. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-08 | Shared UI primitives and design tokens should be reused rather than duplicated. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-09 | Use React component state for local interaction and the existing lightweight external-store pattern (`useSyncExternalStore`) for shared client-side state. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-10 | Use `localStorage` for selected demo state that should survive reloads, such as portal view, pass visits, and row review state. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-11 | Use `sessionStorage` for the demo access-gate session. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-12 | Use mock data and in-memory stores for submissions, datasets, and transactions. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-13 | No production API, database, file-processing service, authentication provider, or durable server persistence is currently defined. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-14 | Vitest with jsdom is configured for unit/component tests. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-15 | ESLint is configured for linting. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-16 | TypeScript checks should pass under the repository's configured compiler options. | Needs verification | Unassigned | — | Record implementation and verification evidence. |
| REQ-6-17 | Provide runnable dev, build, lint, and test scripts (`npm run dev`, `npm run build`, `npm run lint`, `npm test`). | Needs verification | Unassigned | — | Record implementation and verification evidence. |

## NEXT white-label adoption — PRD §12.2

**Required reference:** [NEXT Design System 6.3.1](https://www.figma.com/design/IP7UpMBipYr1A9cGUNpPQd/Next-Design-System-6.3.1?node-id=0-1). The supplied node `0:1` is the cover, not an application screen. These are planned adoption tasks; verified Figma access does not establish implementation completion. Owners and dates remain unassigned.

| ID | Requirement / task | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| WL-01 | Inspect NEXT foundations and record exact token values, component variants, states, and source nodes. | In progress | Unassigned | — | 2026-11-13 design audit: live Button/Input/Dialog metadata and primary-button screenshot inspected. Confirmed default button mismatch (DS-02); exact foundation tokens and remaining component states still unverified. See DESIGN_AUDIT.md. |
| WL-02 | Map NEXT typography, colors, spacing, borders, and focus treatment to shared application theme tokens. | To do | Unassigned | — | Depends on WL-01; reuse shared primitives and theme configuration. |
| WL-03 | Apply NEXT header and navigation patterns with configurable branding and brand-neutral sales-facing names. | In progress | Unassigned | — | Identity configuration in src/config/brand.ts supports five presets (ercot default, acme, placeholder, neutral, spp); three-preset browser check confirms logo switching. Visual theme is fixed (DS-01); storage/precedence caveats DS-06. Apply NEXT header/navigation patterns and resolve GAP-03/04/09; see DESIGN_AUDIT.md. |
| WL-04 | Adapt shared buttons, inputs, selection controls, tabs, badges, search, pagination, and tables to the matching NEXT variants. | To do | Unassigned | — | Inspect relevant component pages and Table 759:116616; preserve sorting, filtering, grid editing, and lifecycle meaning. |
| WL-05 | Apply NEXT patterns to file uploads, import steps, dialogs, tooltips, notifications, and validation feedback. | To do | Unassigned | — | Inspect File Uploader 324:82682, Wizard 687:262330, Dialog 324:43335, Tooltip 88:44328, and Notification 672:188628. |
| WL-06 | Apply the shared theme across BRM, MEM, submission details, transactions, and both portal perspectives. | To do | Unassigned | — | Record screen-by-screen coverage and source component references; preserve existing workflows. |
| WL-07 | Verify responsive layouts and keyboard, focus, disabled, error, and touch interactions after component adoption. | To do | Unassigned | — | Compare implemented states with inspected NEXT variants and document exceptions. |
| WL-08 | Validate updated screens against Figma and rerun supported participant and engineer demo workflows. | To do | Unassigned | — | Capture comparison screenshots and AC-01 through AC-07 results before marking adoption complete. |

## Product design reference — PRD §12.4

[BRM — Intake Flow Prototype](https://www.figma.com/design/uuEDF0zS746imujffOsc75/Base-Reliability-Model--Copy-?node-id=8004-18175): file `uuEDF0zS746imujffOsc75`, page `8004:18175`. Access and page identity verified 2026-11-13. Use for product layout and workflow intent; apply NEXT 6.3.1 for white-label styling.

| ID | Requirement / task | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| REQ-12.4-01 | Register the supplied BRM reference in project documentation and build rules. | Done | Unassigned | — | Figma metadata confirms Intake Flow Prototype page; reference recorded in PRD §12.4 and AGENTS.md. |
| REQ-12.4-02 | Map relevant Figma frames to existing routes and workflows, then implement interactive screens with NEXT styling. | To do | Unassigned | — | Inspect frame context and screenshots, record frame-to-code mappings and adaptations; verify interactions before completion. |

## Acceptance checks

Run these end-to-end checks after the related requirements are verified. Record the date, browser or environment, result, and linked defects in Evidence.

| ID | PRD criterion | Verification procedure | Result | Evidence |
| --- | --- | --- | --- | --- |
| AC-01 | §9.1 | Open each BRM tab; search directories and open available submission, dataset, and transaction workflows. | Not run | — |
| AC-02 | §9.2 | For topology, ratings, profiles, and transaction imports, try allowed and disallowed extensions, complete the configured steps, and check draft/submit feedback. | Not run | — |
| AC-03 | §9.3 | For Topology, Ratings, and Profiles, inspect Review Needed issues, navigate to cells, resolve issues, and verify synchronized state. Check that the other lifecycle states suppress issue UI and preserve terminal/in-flight state. | Not run | — |
| AC-04 | §9.4 | Exercise CP1/CP2 acknowledgments, counter-offers, entry into the EP queue, engineer approval, and return with notes and acknowledgment reset. Confirm the explainer leaves records unchanged. | Not run | — |
| AC-05 | §9.5 | Switch between participant and engineer views; verify supported actions share state and the selected view survives navigation and reload. | Not run | — |
| AC-06 | §9.6 | Exercise Generation and Load checklists, dataset editing and validation, row review, focus mode, handoff, and pass changes. Verify visit persistence and pass-specific reset. | Not run | — |
| AC-07 | §9.7 | Run npm run build, npm run lint, npm test, and the configured TypeScript checks; record exit results. Confirm npm run dev starts the app. | Partial / lint failed | 2026-11-13 local workspace: build, both tsc checks, and one placeholder test pass; lint: 33 errors, 10 warnings. Dev startup not checked. See GITHUB_PAGES_AUDIT.md. |

| AC-08 | §12.2 / §12.8.2 | Compare all updated screens and interaction states with the referenced NEXT components; verify consistent theme and branding, responsive and accessible interactions, and no regressions in AC-01 through AC-07. | Not run | — |

## GitHub Pages hosting readiness

| ID | Requirement / task | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| HOST-01 | Audit the current interactive build for GitHub Pages compatibility. | Done | Unassigned | — | [Audit](./GITHUB_PAGES_AUDIT.md), 2026-11-13: build and TypeScript pass; hosting configuration gaps identified. |
| HOST-02 | Configure repository asset base, static-host routing, and home recovery. | Done | Unassigned | — | Added .env.github-pages, build:pages, optional HashRouter, base-aware favicon, and router home link. Verified direct hash entry, refresh, back/forward, recovery, sample downloads, and brand assets under /brm-prototype/ on a plain static server (Chromium, 2026-11-13). |
| HOST-03 | Configure Pages build/deployment and verify hosted demo workflows. | In progress | Unassigned | — | Manual-only .github/workflows/github-pages.yml added with locked install, TypeScript/test checks, configured Pages base, artifact upload, and deployment. GITHUB_PAGES.md documents activation. Re-audit: clean npm ci is blocked by stale package-lock.json (GAP-HOST-03). GitHub settings, workflow execution, and live demo workflows remain unverified; no deployment requested. |

## Initial follow-ups

| ID | Finding | Next action | Status |
| --- | --- | --- | --- |
| GAP-01 | `src/App.tsx` redirects `/transaction/:id` to `/`, while PRD §4.1 calls for transaction detail routes. | Verify whether an alternative detail interaction satisfies the intended workflow; reconcile the route or PRD and link REQ-4.1-04 / AC-01. | Needs verification |
| GAP-02 | `src/test/example.test.ts` contains only a placeholder assertion. | Add meaningful coverage for lifecycle transitions, acknowledgment/return behavior, and pass resets as those requirements are verified. Existing test presence is not acceptance evidence. Partial 2026-11-13: `src/test/topologyPrj.test.ts` covers topology intake (7 cases). | In progress |
| GAP-03 | Sample data still uses real utility names from the original client's footprint (e.g. AEP, Westar, OG&E, KCP&L, KEPCO, Xcel Energy, City of Wichita) in `mockTransactions.ts`, `mockProfileSeries.ts`, `mockRatingsSubmission.ts`, `transactionDetailMock.ts`, `loadDatasets.ts`, `genDatasets.ts`, `TransactionImport.tsx` and `TransactionActivitySheet.tsx`. | Replace with fictional names per PRD §12.5 / §12.8.1. | To do |
| GAP-04 | (Accent part decided 2026-11-13: stays NEXT-fixed, not in brand config.) The brand accent color isn't in the brand config; `og:image`/`twitter:image` in `index.html` still show a Lovable screenshot of the original build. | Decide whether the accent belongs in `brand.ts` or stays with the NEXT theme tokens (WL-02); replace the share image. | To do |
| GAP-05 | `npm run lint` reports 33 errors and 10 warnings (`no-explicit-any`, `no-require-imports`). None are on lines changed by the white-label work; they are pre-existing. `npm ci` fails because `package-lock.json` is out of sync with `package.json` (Lovable uses `bun.lock`). | Fix the lint errors or relax the rules; regenerate the npm lockfile or standardize on Bun. Affects AC-07. | To do |
| GAP-06 | Topology intake demo was built without consulting the BRM Intake Flow Prototype Figma frames: Figma access is not authorized in this session. Upload error, resubmission dialog and banners reuse existing components. | Authorize Figma, compare against frames in page 8004:18175 and adjust copy and layout. | To do |
| GAP-07 | Simulated intake covers Topology (.prj) only; Ratings and Profiles imports still only check the file extension, and the engineer intake queue doesn't show newly uploaded submissions. | Extend sample files and parsing to Ratings/Profiles; connect the intake queue to the changeset store. | To do |
| GAP-08 | Uncommitted GitHub Pages changes have no work log entry: `vite.config.ts`, `src/App.tsx`, `package.json`, `.github/workflows/github-pages.yml`, `.env.github-pages`; the HOST-01 entry says configuration is unchanged. `.playwright-cli/` (browser-session logs) is untracked and not in `.gitignore`. | The author of the hosting work should log it (HOST-02/HOST-03) and add `.playwright-cli/` to `.gitignore` before committing. | To do |
| GAP-09 | The ERCOT preset uses a temporary text wordmark. The demo uses a real organization's name and should only be shown privately: a public GitHub Pages deployment with ERCOT branding could be mistaken for an official ERCOT site. | Get the official logo through the account team (with permission to use it in the pitch) and replace `public/brand/ercot/logo.svg` / `mark.svg`. Keep ERCOT-branded hosting private, or deploy publicly with `VITE_BRAND=acme`. | To do |

| GAP-HOST-01 | Pages asset base, router, home recovery, and deployment workflow were not configured. | Local configuration and browser checks complete; HOST-03 retains future GitHub activation and live verification. See GITHUB_PAGES.md. | Done |
| GAP-HOST-02 | Current ESLint run fails: 33 errors and 11 warnings (2026-11-13 re-audit). | Resolve errors before making lint a required deployment check. | To do |

| GAP-HOST-03 | package-lock.json is out of sync with package.json; clean npm ci fails before the Pages build. | Synchronize the lockfile and verify a clean install plus build/tests. Confirmed by npm ci --dry-run (EUSAGE); see latest GITHUB_PAGES_AUDIT.md. | To do |

## Design audit follow-ups

See [DESIGN_AUDIT.md](./DESIGN_AUDIT.md) for evidence, severity and component coverage. Existing GAP-03, GAP-04 and GAP-09 remain applicable.

| ID | Finding / task | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| DESIGN-AUDIT-01 | Audit white-label configurability and NEXT component usage. | Done | Unassigned | — | Source inventory, live NEXT Button/Input/Dialog metadata, primary-button screenshot, and three-preset browser theme comparison recorded in DESIGN_AUDIT.md. |
| DS-01 | Visual theme is not configured by brand; NEXT foundation mapping incomplete. | To do | Unassigned | — | WL-01/WL-02: define permitted overrides and shared semantic theme application. |
| DS-02 | Shared button defaults differ from the inspected NEXT primary specimen. | To do | Unassigned | — | WL-04: map NEXT variants/states; validate 32px pill versus current 40px/6px-radius default and document exceptions. |
| DS-03 | Component color overrides bypass shared theme tokens. | To do | Unassigned | — | WL-02/WL-06: 536 hex occurrences in 58 TS/TSX files; consolidate semantic tokens and remove call-site style duplication. |
| DS-04 | Custom controls lack documented NEXT mapping. | To do | Unassigned | — | WL-03/WL-04/WL-05: inventory native/custom controls and reuse shared variants where applicable. |
| DS-05 | File upload target is not keyboard operable in current source. | To do | Unassigned | — | WL-05/WL-07: accessible upload trigger, instructions and validation; compare NEXT states. |
| DS-06 | Brand URL selection depends on successful storage writes; saved brand overrides build default. | Done | Unassigned | — | 2026-11-13: URL choice applies even if storage throws; pick kept in sessionStorage (per tab), so an old pick no longer overrides a new default/build. Precedence documented in WHITE_LABEL.md; `src/test/brand.test.ts`. |

## Neutral sales-demo vision — proposed work

See DESIGN_AUDIT.md, “Neutral sales-demo vision and NEXT adoption strategy”. These proposals support PRD §§12.1–12.8; they are not implemented functionality or promised sales outcomes.

| ID | Task | Status | Owner | Target date | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| PITCH-01 | Establish a neutral identity, fictional scenario catalog and neutral sharing/download content. | In progress | Unassigned | — | 2026-11-13: default is now `neutral`; DS-06 done. Remaining: fictional data (GAP-03), neutral share metadata (GAP-04). |
| PITCH-02 | Build traceable NEXT product patterns for status, validation, decisions, import and review. | To do | Unassigned | — | Complete WL-01–WL-05 and DS-01–DS-05 along the core walkthrough first. |
| PITCH-03 | Separate identity from scenario configuration and provide reliable presenter setup/reset. | To do | Unassigned | — | Verify reset of in-memory/stored state and quick/reviewer walkthrough selection. |
| PITCH-04 | Rehearse the core diagnosis-to-outcome narrative and the supported reviewer branch. | To do | Unassigned | — | Distinguish simulated auto-acceptance; do not imply GAP-07 dashboard synchronization. |
| PITCH-05 | Verify NEXT state parity, accessibility, shared-screen readability and permitted accent propagation. | To do | Unassigned | — | Paired screenshots, keyboard/touch checks, long names, wide/narrow layout and replay results. |
| PITCH-06 | Prepare a neutral presenter guide and evidence-based pilot/discovery questions. | To do | Unassigned | — | Use demonstrated session evidence; no invented ROI, compliance or production-capability claims. |

## Next actions (sequenced from DESIGN_AUDIT.md)

Order follows the audit's recommended sequence, with the core demo path first. Owners and dates unassigned.

| # | Action | IDs | Needs | Done when |
| --- | --- | --- | --- | --- |
| 1 | ~~Decide default preset and accent policy.~~ **Decided 2026-11-13:** neutral default; accent stays NEXT-fixed. Default switched to `neutral`. | PITCH-01 · DS-01 · GAP-04 · GAP-09 | — | Done |
| 2 | Make the upload dropzone keyboard-operable (button semantics, Enter/Space, focus ring, instructions). | DS-05 · WL-05 | Code only | Keyboard upload works in Import and Resubmit; test added |
| 3 | ~~Make `?brand=` work when storage is blocked; document precedence~~ (done 2026-11-13); size the PasswordGate logo from the brand config. | DS-06 · GAP-09 | Code only | Verified with storage disabled and an old saved brand |
| 4 | Record NEXT foundations (color, type, spacing, radius, focus) and the component → Figma node matrix. | WL-01 · PITCH-02 | Figma access in this session | Token table + matrix in DESIGN_AUDIT.md |
| 5 | Central semantic theme: one NEXT token layer in `index.css`/`tailwind.config.ts`, status tokens separate from the accent; no per-brand colour overrides (decision #1). | WL-02 · DS-01 · DS-03 | #4 | Changing the NEXT accent token in one place reaches all intended controls with no feature edits |
| 6 | Align shared Button to NEXT (32px pill primary, variants, states) and remove call-site overrides on the walkthrough path: SubmitWithWarningsDialog, ValidationSummaryBanner, statusBadge, IssueResolutionPanel, ResubmitDialog. | WL-04 · DS-02 · DS-03 · DS-04 | #4, #5 | Paired Figma/app screenshots per state |
| 7 | Map dialogs, banners, toasts, tooltips, status tags, uploader/stepper to NEXT along the walkthrough. | WL-05 · PITCH-02 | #4 | Matrix rows marked verified |
| 8 | Presenter setup/reset: one control that clears submission, status and changeset stores and stored brand; choose quick vs reviewer depth. | PITCH-03 | Code only | Reset then replay gives the same start state |
| 9 | Fictional demo data catalog per scenario (replace AEP, Westar, etc.). | GAP-03 · PITCH-01 | #1 | No real utility names on the demo path |
| 10 | Rehearse the walkthrough in the browser and record results (incl. REQ-4.3/4.4 click-through). | PITCH-04 · AC-* | #2–#7 | Results and defects logged here |
| 11 | Responsive, keyboard, touch, long-name and shared-screen checks. | WL-07 · PITCH-05 | #6, #7 | Checks logged with environment |
| 12 | Presenter guide with honest prototype limits and pilot questions. | PITCH-06 | #10 | Guide linked from DEMO_SUBMISSIONS.md |

Not sequenced yet: WL-06 (theme across MEM/transactions), GAP-07 (engineer queue), GAP-05/HOST lint and lockfile.

## Scope boundaries and decisions

- 2026-11-13 (user): sales demos use the **neutral** company name and logo by default (`DEFAULT_BRAND_ID = "neutral"`); client presets such as `ercot` stay available via `?brand=`.
- 2026-11-13 (user): the accent colour **stays fixed to NEXT** for now. Brand presets change identity (names, logo, favicon) only, not colours. Revisit only if a pitch needs it.

- Follow PRD §§7–8: mock data, browser-local state, and demo access controls are intentional prototype constraints.
- Production authentication, backend ingestion, durable multi-user storage, notifications, and production validation services are out of scope.
- Verify historical plan references against the current application. Per PRD §10, MEM hub module activity cards and the timeline callout were removed; their absence is not a missing requirement.
- Store bugs and scope decisions below with the relevant requirement ID; do not silently expand prototype scope.

## Work log

Newest first. Add each new entry at the **top** of the table. The **Commit message** column holds a ready-to-use [Conventional Commits](https://www.conventionalcommits.org/) subject line; after committing, replace it with `Committed — <short hash> <subject>`.

| Date | Requirement / check | Change or decision | Evidence / defect | Commit message |
| --- | --- | --- | --- | --- |
| 2026-11-13 | PITCH-01 / DS-01 / DS-06 / GAP-04 / GAP-09 | User decisions: neutral company name and logo by default; accent stays NEXT-fixed (recorded under Scope boundaries). Switched `DEFAULT_BRAND_ID` to `neutral` (ERCOT kept as `?brand=ercot`). Fixed DS-06: `?brand=` applies even when storage is blocked, and the pick is kept per tab in sessionStorage instead of localStorage, so an old ERCOT pick no longer overrides the default. Updated WHITE_LABEL.md (default, precedence) and DEMO_SUBMISSIONS.md (`{client}` instead of ERCOT). | `vitest run` 20/20 (new `brand.test.ts`); `tsc --noEmit` passed; eslint on changed files clean; `npm run build` passed. Not run: browser check of the neutral header/password screen. | `feat(brand): make the neutral preset the default and keep brand picks per tab` |
| 2026-11-13 | PITCH-01–06 / WL-01–08 / DS-01–06 / GAP-03/04/09 | Sequenced the DESIGN_AUDIT.md recommendations into a 12-step "Next actions" table: one user decision first, then code-only fixes (DS-05, DS-06), then Figma-dependent NEXT token and component work along the demo path, then reset, data, rehearsal and presenter guide. Planning only; no code changes. | DESIGN_AUDIT.md and tracker rows reviewed. | `docs(tracker): sequence next actions from the design audit` |
| 2026-11-13 | PITCH-01–PITCH-06 / WL-01–WL-08 / PRD §12 | Extended DESIGN_AUDIT.md with neutral sales-demo strategy: stable NEXT patterns, separate identity/scenario configuration, repeatable value narrative, presenter reset, audience emphasis, honest outcome evidence and pilot follow-up. Added proposed implementation tasks. | Reviewed against existing design findings and current simulated acceptance / GAP-07 limitations. Documentation only; no app/Figma changes or runtime tests. | `docs(design): define neutral sales-demo vision and NEXT rollout steps` |
| 2026-11-13 | DESIGN-AUDIT-01 / WL-01–WL-08 / DS-01–DS-06 / GAP-03/04/09 | Created DESIGN_AUDIT.md: identity configurability substantially centralized; visual theming incomplete and NEXT conformance not established. Added component matrix and actionable gaps. No application or Figma edits. | Inspected source, live NEXT Button/Input/Dialog metadata and primary-button screenshot; browser preset/theme comparison. Counts: 536 color literals in 58 TS/TSX files. Full visual/state/accessibility verification and new build/tests not run. | `docs(design): audit white-label configurability and NEXT adoption` |
| 2026-11-13 | REQ-4.4-03–06 / §12.7 / GAP-07 | Removed the engineer step from the default demo: after Submit for {client} Review (clean v3 or submit-as-is with warnings), **Pending Acceptance** turns into **Accepted** on its own after `SIMULATED_VALIDATION_MS` (3 s, same as validation), with a toast and an Activity entry "Accepted for the model build by {client} Engineering". New `submitForReview` in `topologySubmissionStore` handles it and skips acceptance if the status changed or a newer version was uploaded. `AUTO_ACCEPT_ON_SUBMIT` is on by default; `VITE_DEMO_ENGINEER_REVIEW=true` turns it off and brings back the "Demo: review as {client} engineer" link and the Return / Accept panel (code kept). The Accepted banner now names any warnings the submitter accepted instead of always saying "0 Warnings". Updated `DEMO_SUBMISSIONS.md` step 7. | `vitest run` 17/17 (new `autoAccept.test.ts`: timing, status-changed guard, off switch); `tsc --noEmit` passed; eslint on changed files clean; `npm run build` passed. Not run: browser click-through. | `feat(review): auto-accept submissions after a simulated review delay` |
| 2026-11-13 | HOST-01 / HOST-03 / GAP-HOST-02 / GAP-HOST-03 / AC-07 | Re-audited edited prototype and updated GITHUB_PAGES_AUDIT.md. App/configuration left unchanged; found clean-install blocker from stale npm lockfile. | Final Pages build, both TypeScript checks, and 13 tests pass. Normal build also passed earlier; lint: 33 errors/11 warnings. Chromium plain-static project-path route/refresh/navigation, five brands, and sample-download smoke checks pass. npm ci dry-run fails EUSAGE. Remote deployment/settings, full workflows, and clean install not verified. | `docs(hosting): re-audit Pages readiness and record lockfile blocker` |
| 2026-11-13 | REQ-4.4-03–06 / REQ-4.9-03 / REQ-4.9-06 / §12.7 / GAP-06 | Matched the submit-with-warnings pop-up to the supplied design screenshot (Figma still not authorized, so the design file wasn't searched): new `SubmitWithWarningsDialog` ("Submit File with Unresolved Warnings?", passed-critical-checks text, engineers may return it, Cancel / Submit for {client} Review). It replaces `AcceptResponsibilityDialog` (removed with its test). Header button now reads "Submit for {client} Review". Added engineer review and send-back on the detail page: Pending Acceptance shows a "Demo: review as {client} engineer" switch; the engineer panel lists the accepted warnings with **Return to Submitter** (reuses `ReturnSubmissionModal`, required notes) and **Accept**. Return → Review Needed, a red "Returned by {client} Engineering" banner quoting the note, View Comments, and Upload Corrected Version; a newer upload supersedes the note. Accept → Accepted. The activity trail now lives in `topologySubmissionStore` (uploads, validation results, submissions, engineer comments), so it's shared by both views and survives navigation. | `tsc --noEmit` passed; eslint on changed files clean; `vitest run` 13/13 (new `submitWithWarnings.test.tsx`, `engineerReturn.test.ts`); `npm run build` passed. Not run: browser click-through; Figma comparison. The engineer dashboard intake queue still isn't linked to these submissions (GAP-07). | `feat(review): add unresolved-warnings submit dialog and engineer return-to-submitter flow` |
| 2026-11-13 | REQ-4.4-03–06 / §12.7 / §12.8.5 | Completed the Review Needed resolution flow. **Required fixes (errors):** can't be accepted. Submit is locked with the reason "upload a corrected version", and the red banner offers Inspect Issues + Upload Corrected Version. **Optional fixes (warnings):** the amber banner offers (A) Upload Corrected Version or (B) Submit As-Is. Submit with open warnings opens the new `AcceptResponsibilityDialog` (lists the warnings, reminder, required acknowledgement checkbox, "Upload corrected version" alternative), then sets Pending Acceptance, records accepted warnings in the store (`markSubmittedAsIs`), the Activity log and the Pending Acceptance banner. Resubmit dialog explains the offline correction and links the current-version download. Reworked sample files: v1 = 4 required + 3 optional; v2 = 0 required + 3 optional; v3 = clean (the old "still failing" v2 was retired). `ValidationSummaryBanner` gained `onUploadNewVersion` / `onSubmitAsIs` (Ratings/Profiles unchanged). Updated `DEMO_SUBMISSIONS.md` and the in-app sample list. | `tsc --noEmit` passed; `vitest run` 11/11 (v2/v3 expectations updated; new `acceptResponsibility.test.tsx` checks submit stays disabled until acknowledged); `npm run build` passed; eslint 0 errors on changed files (2 warnings in untouched files). Not run: browser click-through; engineer queue doesn't show the accepted warnings yet (GAP-07). | `feat(topology): separate required vs optional fixes and add submit-as-is with responsibility acknowledgement` |
| 2026-11-13 | §12.7 / §12.8.4 / REQ-5-01 | Status descriptions: every status pill now explains what the status means and the next step. It opens on hover, keyboard focus (Tab) and tap on touch screens; a tap on a pill shows the help instead of opening the row. Added `src/components/shared/StatusHelpTooltip.tsx` and `STATUS_HELP` (all 10 statuses, client name from `brand`) in `statusBadge.tsx`. `StatusPill` shows it by default (`showHelp={false}` turns it off), so every directory, queue, detail header and transaction badge gets it. MEM row pills (`RowStatusPill.tsx`) have their own row-level descriptions. | `tsc --noEmit` passed; `vitest run` 10/10 (new `src/test/statusHelp.test.tsx`: every status has help text; tooltip opens on focus); `npm run build` passed; eslint 0 errors (fast-refresh warning on `statusBadge.tsx`, which already had one). Not run: browser hover/touch check. Acknowledgement dots (`ackBadge.tsx`) not covered. | `feat(status): explain each status and next step on hover, focus and tap` |
| 2026-11-13 | WL-03 / §12.1 / GAP-09 | Personalized the demo for an ERCOT pitch: added preset `ercot` (Electric Reliability Council of Texas / "ERCOT" in sentences and data codes) and made it `DEFAULT_BRAND_ID`. The logo is a temporary text wordmark in `public/brand/ercot/` (`logo.svg`, `mark.svg`); the official ERCOT logo was not available and was not recreated. Deduplicated the sample entity list in `transactionDetailMock.ts`, which already contained ERCOT. Updated the presets table in `WHITE_LABEL.md`. | `tsc --noEmit` passed; `vitest run` 8/8; `npm run build` passed; dev server serves `/brand/ercot/logo.svg` (200). Not run: browser visual check. | `feat(brand): add ERCOT pitch preset as default with temporary wordmark` |
| 2026-11-13 | Process / GAP-08 | Work log reordered newest-first and given a Commit message column; past entries mapped to their commits (`a0bb9ae`, `c786b0a`) or a proposed subject. Updated the tracking rules in `CLAUDE.md` and `AGENTS.md`. Found uncommitted GitHub Pages changes not covered by any log entry (GAP-08). | Verified order and messages by listing every row; `git log` / `git show` checked for committed entries. | `docs(tracker): order work log newest-first with commit-ready messages` |
| 2026-11-13 | HOST-01–HOST-03 / AC-07 | Audited GitHub Pages compatibility and created GITHUB_PAGES_AUDIT.md. Build and both TypeScript checks passed; placeholder test passed; lint failed with 33 errors and 10 warnings. App and deployment configuration unchanged. | Static dist inspection confirmed asset-base, routing, and workflow gaps. Browser/live Pages checks not run. | `docs(hosting): add GitHub Pages compatibility audit` |
| 2026-11-13 | WL-03 / §12.1 / §12.5 | White-label dummy brand: added presets `acme` (new default: "Acme Power & Grid", fictional demo logo) and `placeholder` ("[Client Name]", "Your logo here" box) next to `neutral` and `spp`. Moved every logo to `public/brand/<preset>/` (`logo.svg` + `mark.svg`; SPP logo moved from `src/assets/spp-logo.png` to `public/brand/spp/logo.png`) so designers can swap files without code changes. Added `faviconSrc`, `showProductNameInHeader` and `applyDocumentBranding()` (tab title + favicon). Header shows logo + divider + product name; the password screen shows the logo. Rewrote `WHITE_LABEL.md` with design, code and prompt-level guides (copy-paste prompt), and added a white-label rule to `AGENTS.md`. | `tsc --noEmit` passed; eslint on changed files clean; `vitest run` 8/8; `npm run build` passed (`dist/brand/` contains the assets); dev server returns 200 for all preset logos. Not run: browser visual check; NEXT header comparison (WL-03, GAP-06). | `feat(brand): add Acme demo and placeholder presets with swappable logo assets` |
| 2026-11-13 | REQ-4.3-03 / WL-04 / REQ-5-04 | Fixed the Project Type dropdown overflow: the shared `SelectItem` mirrored its whole content (label + description) into the closed field. Added a `description` prop to `src/components/ui/select.tsx` that shows only in the open list. The trigger now truncates one line and uses Dawn tokens (hover/open border #4D4D4D, placeholder #6C6B6B, selected row #E0E6F5, keyboard-only focus ring). Import step shows the selected type's description as helper text (`aria-describedby`) and the label is linked to the field. Other dropdowns (engineer dashboard, equipment, ratings, MEM grid, BRM) only get the new hover/selected styling. | `tsc --noEmit` passed; eslint on changed files clean; `vitest run` 8/8; `npm run build` passed. Not run: browser visual check; comparison with NEXT Select/Dropdown in Figma (WL-01/GAP-06, Figma not authorized). | `fix(ui): keep select option descriptions out of the closed field` |
| 2026-11-13 | REQ-4.3-01–05 / REQ-4.4-01–06 / §12.7 / GAP-02, GAP-06, GAP-07 | Made topology submission demonstrable end to end. Added a demo .prj parser with naming/type/format checks and illustrative reliability rules (`src/lib/topologyPrj.ts`), plus a store with a 3 s simulated validation (`src/store/topologySubmissionStore.ts`). Added 7 sample files in `public/sample-submissions/` (happy path; v1→v2→v3 correction; naming, file-type and malformed rejections) and the in-app 'Demo sample files' list. Upload errors now give specific reasons and next steps (`UploadErrorCard`). The detail page uses the uploaded file's data and live status, shows validation banners, and adds the resubmission dialog (`ResubmitDialog`) and working Upload New Version / Submit for Review (`Header`). Dismissing the last warning moves the submission to Pending Submittal. Widened `datasetStatusStore` with Validation in Progress / Pending Acceptance. Demo script in `DEMO_SUBMISSIONS.md`. | `tsc --noEmit` passed; `npm run build` passed; `vitest run` 8/8 passed (7 new); eslint on changed files: 0 errors (repo-wide pre-existing errors in GAP-05). Dev server serves the sample files (HTTP 200). Not run: manual click-through in the browser, Figma comparison (GAP-06). REQ-4.3/4.4 rows left at Needs verification until a click-through is recorded. | `feat(topology): simulate .prj intake, validation and resubmission with demo sample files` |
| 2026-11-13 | WL-03 / §12.1 / GAP-03–05 | White-label setup: added `src/config/brand.ts` (one config for product name, client name, short name, data code, logo, coordinator title and demo password; presets `neutral` (default) and `spp`; picked with `?brand=`, `VITE_BRAND` or `DEFAULT_BRAND_ID`) and the placeholder logo `src/assets/brand/neutral-logo.svg`. Sent every visible "SPP" string in 28 source files, plus `index.html` and `main.tsx`, through `brand`. Internal keys (`SPP_ENGINEER`, "Pending SPP Review", `spp/` folder) were left as they are; only the row-status label changed. Wrote `WHITE_LABEL.md`. | `tsc --noEmit` passed; `npm run build` passed; `npm test` passed (1/1, placeholder only); `npm run lint` failed with pre-existing errors (GAP-05). Grep found no visible SPP strings left outside `brand.ts`. Dependencies were installed with `npm install --no-save --package-lock=false`, so lockfiles are unchanged. Not run: visual check in a browser. | `feat(brand): add white-label brand config and route visible client names through it` |
| 2026-11-13 | REQ-12.4-01 / REQ-12.4-02 / Process | Registered BRM Intake Flow Prototype as the product reference in PRD.md and AGENTS.md; added mandatory tracking of every change in AGENTS.md and linked it from CLAUDE.md. | Verified Figma page metadata and documentation references. UI implementation and runtime checks not performed; implementation remains To do. | `docs: add AGENTS.md with change-tracking rules and Figma references` |
| 2026-11-13 | §12.5 / §12.7 / WL-03 | Made three interactive concept directions for the stakeholder pitch: A Guided Story, B Two Sides One Record, C Command Center. Brand name and accent can be changed. Built from the Dawn tokens in `src/index.css` and the `statusBadge.tsx` pills, not yet from the NEXT 6.3.1 Figma components (WL-01 is still open). These are concepts only; nothing was changed in the app code. | Claude Design canvas https://claude.ai/artifact/GHxEwMEWZygk2SRYbwXJiT | `docs(tracker): log stakeholder concept directions A–C (design canvas only)` |
| 2026-11-13 | WL-01–WL-08 / AC-08 | Added supplied NEXT 6.3.1 reference and white-label adoption tasks; verified file access and component page inventory only. | PRD §12.2 | Committed — `c786b0a` claude rule to update the tracker |
| 2026-11-13 | Process | Added a project rule requiring TRACKER.md to be updated after every completed task. | [CLAUDE.md](./CLAUDE.md) | Committed — `c786b0a` claude rule to update the tracker |
| 2026-11-11 | All | Created tracker from PRD §§4–6 and acceptance checks from §9. Implementation has not been certified. | [PRD.md](./PRD.md) | Committed — `a0bb9ae` added trackers |
| 2026-11-13 | HOST-02 / HOST-03 / GAP-HOST-01 | Added optional Pages mode (.env.github-pages), build:pages output to ignored dist-pages/, Vite base configuration, mode-selected hash routing, router home recovery, base-aware favicon, and manual-only deployment workflow. Added GITHUB_PAGES.md, README link, and audit follow-up. Existing standard build/routing retained. | Both builds pass; 8/8 tests pass; both TypeScript projects and ESLint on changed TS files pass; workflow YAML parses and git diff --check passes. Chromium on plain static /brm-prototype/: direct MEM hash entry, refresh, back/forward, unknown-route home recovery pass; sample file and brand assets HTTP 200. Live GitHub settings/deployment and full business-workflow regression not run. Existing repo-wide lint issues remain separately tracked. |
