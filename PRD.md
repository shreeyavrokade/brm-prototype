# Product Requirements Document

## Unified Submission Portal — BRM Prototype

**Status:** Reconstructed from the current application and its `.lovable/plan` implementation notes  
**Product type:** Interactive front-end prototype  
**Repository:** `shreeyavrokade/brm-prototype`

> This document consolidates the product and technical requirements represented by the running application. The repository does not contain a separate approved business PRD or backend specification. Historical implementation notes may describe UI that has since changed; the current app is the source of truth for delivered behavior.

## 1. Product overview

The Unified Submission Portal prototype demonstrates submission, review, and model-build workflows for SPP planning data. It provides participant-facing workspaces for Base Reliability Model (BRM) and Market Economic Model (MEM) activities, plus an SPP engineer view for reviewing shared demo data.

The application is intended for workflow demonstration and user testing. It uses mock and in-memory data, with selected browser `localStorage` persistence. It is not a production submission or system-of-record platform.

## 2. Goals

- Demonstrate submission intake and review for topology changesets, profiles, ratings, equipment, and bilateral transactions.
- Make validation and review states visible in directory tables, detail screens, and issue-resolution workflows.
- Demonstrate participant and SPP engineer perspectives over shared client-side data.
- Guide users through Generation and Load MEM checklists, dataset review, and pass-state messaging.
- Keep interaction patterns and status colors consistent across modules.

## 3. Users and perspectives

### Participant

Uses BRM and MEM workspaces to inspect submissions and datasets, resolve validation issues, upload demo submissions, and participate in bilateral transaction acknowledgment workflows.

### SPP engineer

Uses the engineer dashboard to inspect a BRM intake queue, filter by footprint and cycle, review validation exceptions, and approve or return submissions and transactions.

### Access model

The prototype has a shared demo password gate and a view switcher. These are demonstration controls, not user identity, authorization, or role-based security. Transaction roles are represented by fixed demo configuration rather than authenticated user roles.

## 4. Product scope and functional requirements

### 4.1 Application shell and navigation

- Provide a global header, participant navigation, responsive application layout, and status notifications.
- Support the participant and SPP engineer perspectives through a global view switcher.
- Preserve the selected portal perspective across page navigation and browser reloads where browser storage is available.
- Provide routes for BRM, submission details and imports, transaction imports and details, Profiles, Ratings, MEM, and MEM Load Review.

### 4.2 BRM workspace

- Provide tabs for Topology Changeset, Profiles, Ratings, Equipment Details, and Transactions.
- Allow users to search relevant directories and inspect submission/detail views.
- Display submission status and review-needed counts using the shared status system.
- Support opening submission details and related issue-resolution experiences.
- Mark tracked modules as visited when their corresponding BRM tab is opened during the current MEM pass.

### 4.3 Submission intake

- Provide a multi-step import experience for topology, ratings, and profiles submissions.
- Accept the configured file types for each submission kind and display selected file metadata.
- Collect the applicable submission details and supporting information.
- Allow draft and submit actions, with visible confirmation feedback and return navigation.
- Use client-side demo stores to reflect topology submissions in the BRM workspace.

### 4.4 Submission review and validation [P1] [P3]

- Support a shared dataset lifecycle for Topology, Ratings, and Profiles:
  - Draft
  - Review Needed
  - Pending Validation
  - Pending Submittal
  - Accepted
  - Rejected
- Derive review state from issue counts only for active Draft or Review Needed datasets; preserve terminal or in-flight states such as Accepted, Rejected, Pending Validation, and Pending Submittal.
- When a dataset is under Review Needed, show relevant validation errors and warnings, highlight affected cells, and provide issue resolution.
- Allow users to navigate between issue cards and affected grid rows/cells where supported.
- Suppress issue indicators and issue-resolution UI for datasets not in Review Needed.
- When issues are cleared, update the displayed state and status indicators consistently.

### 4.5 Ratings and Profiles [P2] [P6]

- Provide searchable directories and submission detail pages for Ratings and Profiles.
- Support inspection grids with row/cell issue details and shared review interactions.
- Support dataset-specific details such as rating seasons and profile categories.
- Keep status indicators and issue counts in sync with the current client-side review state.

### 4.6 Equipment Details

- Provide BRM equipment inspection and equipment-specific grids.
- Support equipment detail requirements and review treatment through the existing equipment schemas and components.

### 4.7 Bilateral Transactions [P4] [P5] [P12] [P13]

- Provide a searchable Transactions view and transaction detail/activity experiences.
- Support transaction import with a three-step demo flow and optional proof file for applicable external counterparties.
- Represent CP1 and CP2 acknowledgment independently.
- Move a transaction into the EP review queue when both parties have acknowledged.
- Support the participant counter-offer/acknowledgment loop and the SPP engineer approve or reject/return flow.
- Store rejection/return notes in the in-memory transaction record and reset acknowledgments when returned for revision.
- Provide a workflow explainer that simulates lifecycle states without mutating live transaction records.

### 4.8 Market Economic Model [P7] [P8] [P9] [P10]

- Provide separate Generation and Load tracks with a guided checklist, section workspace, and reference datasets.
- Provide dataset grids for reviewing or editing demo data, with validation feedback and row-level review affordances.
- Include pass handoff messaging and SPP modification summaries where applicable.
- Support focus mode for opening an individual dataset from the checklist.
- Track pass number and participant/SPP review state in the demo store.
- Persist module visits by track and pass in browser storage when available.
- Reset pass-specific review state when the pass changes.

### 4.9 SPP engineer command center [P11]

- Provide cycle selection and footprint filters.
- Show the review milestone stepper and BRM metric cards.
- Provide a BRM intake queue with validation state and approve/return actions.
- Show bilateral transactions ready for SPP review and actions to approve or return them.
- Provide a footprint participation/report-card area.
- Reflect engineer actions in the same client-side stores used by participant views where supported.

## 5. Status, feedback, and visual system

- Use the shared status tokens and status pill component as the canonical source for common lifecycle colors.
- Use consistent visual treatment for validation severity, acknowledgment state, and actionable review states.
- Provide visible success/error feedback for user actions through the existing toast components.
- Preserve table usability, including search, sorting or filtering where implemented, horizontal scrolling, and row/cell highlighting.
- Keep the interface responsive across narrow and wide layouts using the existing Tailwind and component-library patterns.

## 6. Technical requirements

### Runtime and framework

- Node.js-compatible front-end project managed with npm; Bun lockfiles are also present.
- Vite 5 for development and production builds.
- React 18 with TypeScript.
- React Router for client-side routes.

### UI and styling

- Tailwind CSS 3 with the project theme configuration.
- shadcn-style components built on Radix UI primitives.
- Lucide and Phosphor icons as used by existing components.
- Shared UI primitives and design tokens should be reused rather than duplicated.

### State and data

- Use React component state for local interaction and the existing lightweight external-store pattern (`useSyncExternalStore`) for shared client-side state.
- Use `localStorage` for selected demo state that should survive reloads, such as portal view, pass visits, and row review state.
- Use `sessionStorage` for the demo access-gate session.
- Use mock data and in-memory stores for submissions, datasets, and transactions.
- No production API, database, file-processing service, authentication provider, or durable server persistence is currently defined.

### Validation and quality

- Vitest with jsdom is configured for unit/component tests.
- ESLint is configured for linting.
- TypeScript checks should pass under the repository's configured compiler options.
- Available project commands:
  - `npm run dev` — local development server
  - `npm run build` — production build
  - `npm run lint` — ESLint
  - `npm test` — Vitest run

## 7. Data, security, and prototype limitations

- Data is illustrative and is not authoritative SPP data.
- Upload flows currently demonstrate browser-side file selection and workflow metadata; they do not establish server-side ingestion, durable storage, or a production validation service.
- Shared stores are browser-local/in-memory and do not synchronize across users or devices.
- Demo password gating and fixed demo roles must not be treated as security controls.
- The prototype has no defined production authorization, audit logging, retention, privacy, availability, or recovery requirements.
- Counts and dashboard metrics may be seeded demonstration values rather than live operational metrics.

## 8. Out of scope

- Production identity management, user/role administration, and secure authorization.
- Backend APIs, database schema, durable multi-user synchronization, and production file ingestion.
- Email or external notifications to counterparties.
- Production-grade validation rule services or integration with model-build systems.
- Treating illustrative mock records, seeded metrics, or prototype statuses as operational data.

## 9. Acceptance criteria

The prototype meets its current product intent when:

1. A user can navigate the BRM tabs and open the available submission, dataset, and transaction workflows.
2. The import flows enforce their configured file extensions and present the applicable review steps.
3. Review-needed issues, cell highlighting, issue resolution, and status changes are visible and consistent across supported dataset screens.
4. The transaction demo supports party acknowledgments, the EP queue, approval, and rejection/return actions.
5. A user can switch between participant and SPP engineer perspectives and see supported shared changes reflected in both.
6. The MEM Generation and Load checklists, dataset review workspace, and pass-related UI are usable.
7. Project build, lint, and test commands are available and can be run using the repository scripts.

## 10. Source notes

This PRD was consolidated from the current route structure, pages, components, stores, package configuration, and the historical implementation notes listed below. The plan files capture feature-specific requests and design decisions; they are not assumed to be a complete or current standalone specification. The September 2026 MEM overview note [P10] removes the module activity cards and timeline callout from the hub while retaining checklist and pass-related functionality.

## 11. References

### Product and implementation notes

- **[P1]** [6-State Dataset Lifecycle for Topology, Ratings & Profiles](./.lovable/plan/6-state-dataset-lifecycle-for-topology-ratings-profiles-2026-08-05.md)
- **[P2]** [Ratings & Profiles: Full Parity with Topology Issue Resolution](./.lovable/plan/ratings-profiles-full-parity-with-topology-issue-resolution-2026-08-04.md)
- **[P3]** [Show Errors and Warnings Only for Review Needed Submissions](./.lovable/plan/show-errors-and-warnings-only-for-review-needed-submissions-2026-08-05.md)
- **[P4]** [Role-Scoped Acknowledgment States & EP Rejection Flow](./.lovable/plan/role-scoped-acknowledgment-states-ep-rejection-flow-2026-08-03.md)
- **[P5]** [Acknowledgment State Column — Dot + Text Styling](./.lovable/plan/acknowledgment-state-column-dot-text-styling-2026-08-05.md)
- **[P6]** [Expandable Branch Rows with Nested Seasonal Ratings](./.lovable/plan/expandable-branch-rows-with-nested-seasonal-ratings-2026-08-24.md)
- **[P7]** [MEM Overview — Pass Tracking, SPP Lock, Diff Summary](./.lovable/plan/mem-overview-pass-tracking-spp-lock-diff-summary-2026-08-21.md)
- **[P8]** [MEM Row-Level Review Workflow](./.lovable/plan/mem-row-level-review-workflow-2026-09-02.md)
- **[P9]** [MEM Inline Cell Editing Refactor](./.lovable/plan/mem-inline-cell-editing-refactor-2026-09-02.md)
- **[P10]** [Remove Module Boxes and Timeline Note from MEM Overview](./.lovable/plan/remove-module-boxes-and-timeline-note-from-mem-overview-2026-09-02.md)
- **[P11]** [Global View Switcher + SPP Engineer Command Center](./.lovable/plan/global-view-switcher-spp-engineer-command-center-2026-09-10.md)
- **[P12]** [Workflow Explainer Modal (Transaction Lifecycle Demonstrator)](./.lovable/plan/workflow-explainer-modal-transaction-lifecycle-demonstrator-2026-08-13.md)
- **[P13]** [Lighten Transactions Grid Lines](./.lovable/plan/lighten-transactions-grid-lines-2026-08-03.md)

### Project configuration and application sources

- [README.md](./README.md) — repository setup notes; currently a generic Lovable template rather than a product specification.
- [package.json](./package.json) — scripts and dependency manifest.
- [vite.config.ts](./vite.config.ts) — Vite configuration and module alias.
- [tsconfig.app.json](./tsconfig.app.json) — application TypeScript compiler options.
- [vitest.config.ts](./vitest.config.ts) — test environment and test discovery.
- [src/App.tsx](./src/App.tsx) — route declarations and application providers.
- [src/main.tsx](./src/main.tsx) — React bootstrap and password gate.
- [src/components/shared/statusBadge.tsx](./src/components/shared/statusBadge.tsx) — shared status types and visual tokens.
- [src/components/submission/datasetStatus.ts](./src/components/submission/datasetStatus.ts) — dataset status derivation.
- [src/store/transactionsStore.ts](./src/store/transactionsStore.ts) — client-side transaction state and transitions.
- [src/store/memPassStore.ts](./src/store/memPassStore.ts) — MEM pass and module-visit state.
- [src/store/portalContextStore.ts](./src/store/portalContextStore.ts) — participant/engineer view state.
