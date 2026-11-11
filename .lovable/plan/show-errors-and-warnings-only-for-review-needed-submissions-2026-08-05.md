# Show errors and warnings only for "Review Needed" submissions

## What's happening today

Every submission detail screen loads the same mock issue list regardless of the submission's status:

- `RatingsSubmissionDetail` seeds state from `ratingsIssues`, `ProfilesSubmissionDetail` from `profilesIssues`, and the Topology `SubmissionDetail` from `initialIssues` — with no check against the row's status.
- `deriveDatasetStatus` then forces `Review Needed` whenever any issue exists, so a row that started as Accepted, Draft, or Rejected is overridden the moment the detail page opens.
- The helper `showsIssueStyling(status)` already exists in `datasetStatus.ts` but is never used anywhere.

Result: Accepted / Draft / Rejected / Pending Validation submissions still show the amber banner, red cells, and the Issue Resolution panel.

## The fix

1. **Gate the issue data by status.** On each detail page, load the mock issues only when the submission's own status is `Review Needed`. For any other status the issue list is empty, so counts are 0.

2. **Stop the status override.** Update `deriveDatasetStatus` so only a submission that is already in `Review Needed` (or `Draft`, which is the pre-validation working state) can be pushed into `Review Needed` by issue counts. Accepted, Rejected, Pending Submittal, and Pending Validation are respected as-is and never flipped.

3. **Suppress issue chrome outside Review Needed.** Use `showsIssueStyling(status)` as the single switch that controls, on all three detail screens:
   - the Issue Resolution panel (closed and not rendered)
   - the issue filter bar (error/warning counts and filters)
   - row/cell tints, warning icons, and inline error indicators in the grids (`RatingsInspectorGrid`, `ProfilesInspectorGrid`, `FileInspector`)
   - the banner: non-Review-Needed states show only their own state banner (e.g. Accepted verified banner), never an error/warning summary

4. **Topology detail.** Replace the hardcoded `deriveDatasetStatus("Review Needed", ...)` with the actual status of the changeset row being viewed, so the same rules apply there.

5. **Directory pills stay in sync.** Since detail pages no longer publish a spurious `Review Needed` override into `datasetStatusStore`, the per-tab "Review Needed" counters on the dashboard will only count genuinely flagged submissions.

## Technical notes

Files touched: `src/components/submission/datasetStatus.ts`, `src/pages/RatingsSubmissionDetail.tsx`, `src/pages/ProfilesSubmissionDetail.tsx`, `src/pages/SubmissionDetail.tsx`, `src/components/submission/ValidationSummaryBanner.tsx` (guard), and the three grid components for conditional highlighting.

No data model or backend changes; this is presentation and derivation logic only.
