# Global View Switcher + SPP Engineer Command Center

Add a header toggle between the market participant experience (today's screens) and a new SPP engineer dashboard, with both views reading and writing the same live data.

## 1. View switcher in the header

- Pill segmented control in the top-right of the global header, beside the user badge: "Participant View (USP)" and "SPP Engineer View (EP)".
- Selection is stored globally and persists across pages; switching never clears drafts, submissions, or edits.
- Participant view keeps the current sidebar and tabs. Engineer view swaps the main area for the command center and hides participant-only actions (Import Submission, Create Non-Firm Transaction).

## 2. SPP engineer command center

Header controls
- Cycle dropdown (2026-2029, default 2028).
- Footprint segmented control: All Footprint | East (EDST) | West (Workbook).
- Milestone stepper: Pass 1 Review (active, dark chip with green ACTIVE pill), Pass 2 Review, Pass 3 Review, Initial Final Case, Final Model Commit.

Metric cards
1. Topology Submissions - 78 .prj files, with a "View 7 Project Types" popover: Approved Upgrades 18, Planned Upgrades 25, GI 9, Attachment AQ 14, Modeling Corrections/Intact/Status 12.
2. Profiles & Base Ratings - 127 datasets (107 BLG profiles, 20 ratings CSVs).
3. Validation Exceptions - 3 files flagged, rose alert styling.
4. Member Participation - 65% (65 / 100), 65 active / 35 no submissions.

Two-column workspace
- Left (two thirds): BRM Dataset Intake Queue table listing incoming .prj, .raw profile, and .csv ratings files with submitter, type, timestamp, and a validation badge (green "All Rows Valid" or red "Line 42 Reactance Error"). Row actions: dark "Approve" button (sets status Accepted) and red "Review Needed" button (opens return modal).
- Right (one third): Bilateral Transactions widget headed "Bilateral Transactions (Dual-Ack)" with a blue "N Ready" counter. Lists only transactions where both counterparties have acknowledged (Pending Acceptance). Each card shows name/ID, MW amount, season and term, and the two counterparty entities, with Approve Transaction and Review Needed (Notes) actions.

Bottom report card bar
- East (EDST): 42 members responded, 12 pending review. West (Workbook): 23 responded, 23 confirmed no change. Button: "Full Member Report Card" (opens the participation matrix; scoped as a placeholder panel listing members by footprint and response state).

## 3. Return modal

- Title "Return Submission for Revision", mandatory notes textarea, Confirm Return disabled until notes are entered.
- For transactions, shows the notice that returning resets acknowledgement to Action Needed for both counterparties.
- Confirming sets the submission to Review Needed, records the note, and the participant view reflects it immediately (including the red counts on the tabs).

## Technical notes

- New `src/store/portalContextStore.ts`: `activePortalView: 'STAKEHOLDER' | 'SPP_ENGINEER'`, `useSyncExternalStore` subscription + localStorage persistence, matching the existing store pattern.
- `GlobalHeader.tsx` renders the switcher; `Index`/`BaseReliabilityModel` branch on the view to render either the current tabs or the new `SppEngineerDashboard`.
- New components under `src/components/spp/`: `SppEngineerDashboard.tsx`, `MilestoneStepper.tsx`, `MetricCards.tsx`, `IntakeQueueTable.tsx`, `BilateralTransactionsWidget.tsx`, `ReportCardBar.tsx`, `ReturnSubmissionModal.tsx`.
- Cross-view sync reuses existing stores: dataset approvals/returns go through `setDatasetStatus` in `datasetStatusStore.ts` (keyed by the same submission ids used by the changeset, ratings, and profiles directories) so tab badges and directory pills update live; transaction approve/return uses `transactionsStore.ts`, resetting `cp1Ack`/`cp2Ack` to "Action Needed" and status to "Review Needed" on return, storing the note on the record.
- Intake queue rows derive from existing mocks (`mockChangeset`, `mockRatingsDirectory`, `mockProfileProjects`) so both views show one dataset, plus a small validation-message map for the flagged files.
- Status pills continue to come from `src/components/shared/statusBadge.tsx`; no local color overrides. Metric counts in the cards stay as the specified fixed figures except Validation Exceptions and the transactions "Ready" pill, which count live.
