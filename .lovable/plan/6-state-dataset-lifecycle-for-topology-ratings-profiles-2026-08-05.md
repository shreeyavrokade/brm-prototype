# 6-State Dataset Lifecycle for Topology, Ratings & Profiles

Add the full six-state lifecycle to the dataset tabs and their submission detail screens, with "Review Needed" driven automatically by live error/warning counts, in-grid correction of flagged cells, and an automatic transition to "Pending Submittal" once every issue is cleared.

## Status model

Six states shared by Topology, Ratings and Profiles: Draft, Review Needed, Pending Validation, Pending Submittal, Accepted, Rejected.

Colors stay on the locked palette already in use — Review Needed keeps crimson (#C82333 on #FBE5E8) and Rejected keeps the solid black pill. Two new pills are added in the same style:

- Pending Validation — soft blue `#E0E6F5` / `#2064B4`
- Pending Submittal — soft purple `#F0EAF8` / `#5B2C6F`

The dataset status is always derived, never hand-set: errors + warnings >= 1 forces Review Needed, regardless of what the mock row says. Directory rows carrying Accepted/Rejected/Draft keep those unless issues exist.

## Submission detail screens

Banner, CTA and grid treatment switch on the derived status:

- **Review Needed** — crimson banner "Review Needed: X Errors, Y Warnings Found" with a black `Inspect & Resolve Issues` button that opens the right-side Issue Resolution Panel. Flagged cells keep the red/amber tint, bold text and warning icons.
- **Pending Validation** — blue skeleton overlay across the grid reading "Running automated SPP validation rules...".
- **Pending Submittal** — clean grid, purple banner, primary CTA `Submit to SPP Model Build`.
- **Accepted** — green banner "Dataset Accepted / 0 Warnings, 0 Errors. All parameters meet model build specifications." with an outline `View Verified Grid` button. Zero tints, badges or icons anywhere in the grid.
- **Rejected** — red callout showing the EP engineer's rejection notes.
- **Draft** — no banner, editable grid.

Ratings gets the banner it already has; Profiles gets the banner restored under this state logic.

## Resolution loop

Flagged cells become editable directly in the grid. On commit the new value is re-checked against the issue's rule; if it passes, the cell tint clears instantly and the matching card disappears from the panel. Dismissing a warning counts as resolved, as today.

When the last issue clears: panel auto-closes, success toast "All issues resolved!", and both the detail banner and the parent tab badge flip from Review Needed to Pending Submittal.

## Technical notes

- `src/components/shared/statusBadge.tsx`: add `Pending Validation` and `Pending Submittal` to `StatusKey` + `STATUS_TOKENS`. No changes to existing hexes.
- New `src/components/submission/datasetStatus.ts`: `DatasetStatus` union, `deriveDatasetStatus(baseStatus, errors, warnings)`, and shared banner copy per state.
- `ValidationSummaryBanner.tsx`: take a `status` prop and render the five banner variants (currently only error/warning variants exist), including the Accepted and Rejected states and their CTAs.
- New `GridValidationOverlay` skeleton for the Pending Validation state, rendered by `SubmissionShell` over the tab content.
- `IssueCell.tsx`: add an editable mode — click to edit, Enter/blur commits, Escape cancels; calls `onResolve(issue, value)` when the value satisfies the rule.
- `validationIssues.ts`: add an optional `validate?: (value: string) => boolean` per issue so resolution can be checked; default to "any changed non-empty value resolves".
- `RatingsInspectorGrid.tsx` / `ProfilesInspectorGrid.tsx`: thread `onResolve` and local value overrides through to `IssueCell`; suppress all issue styling when status is Accepted.
- `RatingsSubmissionDetail.tsx` / `ProfilesSubmissionDetail.tsx` / `SubmissionDetail.tsx` (topology): hold the resolved-values map, compute derived status, run the auto-close + toast + transition effect, and pass status into shell/banner.
- Tab-level badges: `RatingsDirectory.tsx`, `ProfilesDirectory.tsx` and `ChangesetTable.tsx` render `StatusPill` from the derived status; `DirectoryStatus` / `ProfileDirectoryStatus` unions widen to the six states.
