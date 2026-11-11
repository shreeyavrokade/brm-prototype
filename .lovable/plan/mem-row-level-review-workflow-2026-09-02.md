# MEM Row-Level Review Workflow

Add an accept/revise review loop to every MEM dataset table: rows carry their own status, SPP-changed cells are flagged with a dot and hover card, and expanding a row shows WAS/NOW values with Accept / Save Changes / Revise actions. Dataset module status follows from row activity and resets when a new pass opens.

## 1. Row status model

Three row states, rendered as pills in a new leading STATUS column:

- Review Needed — red pill. Default for any row not yet acted on, and for rows SPP touched in the prior pass.
- Accepted — green pill. Set when the user clicks Accept without editing.
- Pending SPP Review — purple/blue pill. Set when the user edits one or more cells and clicks Save Changes.

Pills reuse the shared status tokens (`src/components/shared/statusBadge.tsx`) so colors stay consistent with the rest of the app.

## 2. SPP cell-level change indicators

- Rows carry an `sppChanges` map: cell key to `{ previous, current }`.
- While a row is Review Needed, each changed cell renders a small red dot after its value.
- Hovering the cell opens a micro-card popover: "SPP Modified Value — Baseline `<previous>` → SPP Updated `<current>`".
- Once the row is Accepted or Pending SPP Review, the dot is suppressed (the change has been dispositioned).

## 3. Row expansion and edit mode

- A chevron in the right action column expands the row inline (full-width sub-row inside the same table).
- The expanded panel lists every editable column as a stacked pair:
  - WAS: previous/baseline value — 11px muted gray
  - NOW: editable input with the current value — bold dark text
- Any input the user changes gets an amber border; validation errors keep the existing red border/message behavior from the current grid.
- Bottom action tray:
  - Accept (solid green) — keeps SPP values, sets row to Accepted, collapses.
  - Save Changes (solid dark accent, only visible once something is edited) — validates, commits, sets row to Pending SPP Review, collapses.
  - Revise / Cancel (outline) — discards pending edits back to baseline and collapses.
- The existing kebab Edit path is replaced by this expansion so there is one edit mechanism per row. Add / Delete row behavior for CRUD datasets stays.

## 4. Dataset module and pass lifecycle

- When a pass opens, every editable dataset module starts at Review Needed.
- Opening a dataset (clicking Review Dataset / viewing it) flips that module to Complete, matching the existing visit-tracking pattern.
- When the pass number changes (SPP edits close and reopen a pass), the visit/status record for the new pass starts empty, so affected modules return to Review Needed automatically.

## Technical notes

- `src/components/mem/genDatasets.ts` / `loadDatasets.ts`: add optional `sppChanges` per row on a few representative rows (Annual Load Factor, Generator, and one Load dataset) so the demo shows dots and WAS/NOW without touching every row.
- New `src/components/mem/rowReviewStore.ts`: row status map keyed by pass + dataset + row id, `useSyncExternalStore` + localStorage, same pattern as `memPassStore.ts`; resets on new pass.
- New `src/components/mem/RowStatusPill.tsx` and `src/components/mem/SppCellDot.tsx` (dot + hover card via existing `HoverCard`/`Tooltip` primitive).
- `src/components/mem/DatasetGrid.tsx`: replace the current single-row inline-edit machine with expand-to-edit; add the STATUS column and the expanded action tray. Reuse existing `validateCell`.
- `src/components/mem/ForecastGrid.tsx`: same STATUS column, dot indicators and expansion so the matrix grids behave identically.
- `src/pages/MarketEconomicModel.tsx` / `ChecklistEngine.tsx`: dataset status derives from pass visits — Review Needed until opened, then Complete; keep view-only datasets auto-complete.
- Lucide icons for chevron/check/x; no new dependencies.
