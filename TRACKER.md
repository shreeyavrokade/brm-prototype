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
| WL-01 | Inspect NEXT foundations and record exact token values, component variants, states, and source nodes. | In progress | Unassigned | — | File access and page inventory verified 2026-11-13; foundations and variants still to inspect. |
| WL-02 | Map NEXT typography, colors, spacing, borders, and focus treatment to shared application theme tokens. | To do | Unassigned | — | Depends on WL-01; reuse shared primitives and theme configuration. |
| WL-03 | Apply NEXT header and navigation patterns with configurable branding and brand-neutral sales-facing names. | To do | Unassigned | — | Inspect Header 324:100878 and Navigation System 600:173477; coordinate with PRD §12.1. |
| WL-04 | Adapt shared buttons, inputs, selection controls, tabs, badges, search, pagination, and tables to the matching NEXT variants. | To do | Unassigned | — | Inspect relevant component pages and Table 759:116616; preserve sorting, filtering, grid editing, and lifecycle meaning. |
| WL-05 | Apply NEXT patterns to file uploads, import steps, dialogs, tooltips, notifications, and validation feedback. | To do | Unassigned | — | Inspect File Uploader 324:82682, Wizard 687:262330, Dialog 324:43335, Tooltip 88:44328, and Notification 672:188628. |
| WL-06 | Apply the shared theme across BRM, MEM, submission details, transactions, and both portal perspectives. | To do | Unassigned | — | Record screen-by-screen coverage and source component references; preserve existing workflows. |
| WL-07 | Verify responsive layouts and keyboard, focus, disabled, error, and touch interactions after component adoption. | To do | Unassigned | — | Compare implemented states with inspected NEXT variants and document exceptions. |
| WL-08 | Validate updated screens against Figma and rerun supported participant and engineer demo workflows. | To do | Unassigned | — | Capture comparison screenshots and AC-01 through AC-07 results before marking adoption complete. |

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
| AC-07 | §9.7 | Run npm run build, npm run lint, npm test, and the configured TypeScript checks; record exit results. Confirm npm run dev starts the app. | Not run | — |

| AC-08 | §12.2 / §12.8.2 | Compare all updated screens and interaction states with the referenced NEXT components; verify consistent theme and branding, responsive and accessible interactions, and no regressions in AC-01 through AC-07. | Not run | — |

## Initial follow-ups

| ID | Finding | Next action | Status |
| --- | --- | --- | --- |
| GAP-01 | `src/App.tsx` redirects `/transaction/:id` to `/`, while PRD §4.1 calls for transaction detail routes. | Verify whether an alternative detail interaction satisfies the intended workflow; reconcile the route or PRD and link REQ-4.1-04 / AC-01. | Needs verification |
| GAP-02 | `src/test/example.test.ts` contains only a placeholder assertion. | Add meaningful coverage for lifecycle transitions, acknowledgment/return behavior, and pass resets as those requirements are verified. Existing test presence is not acceptance evidence. | To do |

## Scope boundaries and decisions

- Follow PRD §§7–8: mock data, browser-local state, and demo access controls are intentional prototype constraints.
- Production authentication, backend ingestion, durable multi-user storage, notifications, and production validation services are out of scope.
- Verify historical plan references against the current application. Per PRD §10, MEM hub module activity cards and the timeline callout were removed; their absence is not a missing requirement.
- Store bugs and scope decisions below with the relevant requirement ID; do not silently expand prototype scope.

## Work log

| Date | Requirement / check | Change or decision | Evidence / defect |
| --- | --- | --- | --- |
| 2026-11-11 | All | Created tracker from PRD §§4–6 and acceptance checks from §9. Implementation has not been certified. | [PRD.md](./PRD.md) |
| 2026-11-13 | Process | Added a project rule requiring TRACKER.md to be updated after every completed task. | [CLAUDE.md](./CLAUDE.md) |
| 2026-11-13 | WL-01–WL-08 / AC-08 | Added supplied NEXT 6.3.1 reference and white-label adoption tasks; verified file access and component page inventory only. | PRD §12.2 |
