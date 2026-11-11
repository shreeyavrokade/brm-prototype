# Expandable Branch Rows with Nested Seasonal Ratings

Add rating information to branch equipment in the Topology Changeset submission detail (File Inspector). Each BRANCH row gains an expand chevron that opens a nested "Seasonal Ratings" sub-grid beneath it, matching the reference design.

## Main branch grid

Sticky left (pinned during horizontal scroll):

1. Expand/collapse chevron (`ChevronRight` / `ChevronDown`)
2. From Bus ID
3. To Bus ID
4. Circuit ID

Scrollable columns keep their current data and monospace numeric styling, including the existing validation badge treatment on out-of-bounds cells (amber `#FEF3C7` / `#92400E`, crimson for errors):

5. Resistance (R1)
6. Reactance (X1)
7. Charging Susceptance (B1)
8. Base Rating (Rate A)

## Expandable seasonal ratings drawer

Clicking the chevron opens a full-width panel directly below the branch row:

- Container: `bg-[#F8FAFC]`, top and bottom borders `#E2E8F0`, `p-4 pl-12`.
- Label: `SEASONAL RATINGS` — `text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2`.
- Nested table: `SEASON` (left), `NORMAL HIGH` (right, MVA), `EMERGENCY HIGH` (right, MVA).
- Rows: Summer, Winter, Shoulder (Sp/Fa).

Seasonal values are derived per branch from its Rate A so every branch has plausible data: Summer = Rate A, Winter = 1.08 × Rate A, Shoulder = 1.03 × Rate A; Emergency High = 1.15 × Normal High, all shown to one decimal. For `BR003` (Rate A 450) this yields exactly the reference figures: 450.0 / 517.5, 486.0 / 558.9, 463.5 / 533.0.

## Interaction

- Smooth height transition on expand/collapse (CSS grid-rows transition — no new animation dependency).
- Expanded state is tracked per row, so multiple branches can stay open at once for side-by-side comparison.
- Expansion state resets when switching record type or phase filter; chevrons appear only on the BRANCH tab.
- Row selection, hover cross-highlighting with the Issue Resolution sidebar, and the sticky bus columns continue to work unchanged; clicking the chevron does not change row selection.

## Technical notes

- `src/components/dashboard/types.ts`: add `seasonalRatings?: { season: string; normalHigh: number; emergencyHigh: number }[]` to `FileRow`, and reorder the `BRANCH` entry of `RECORD_COLUMNS` so From Bus / To Bus / CKT carry `sticky: true`.
- `src/components/dashboard/mockData.ts`: attach derived `seasonalRatings` to `BR001`–`BR004`.
- `src/components/dashboard/FileInspector.tsx`: hold `expandedRows: Set<string>` in local state; render a leading chevron cell (fixed ~32px, sticky left, offsetting the existing sticky-left math for the branch view) and, when expanded, a second `<TableRow>` with a `colSpan` cell containing the drawer and nested table. Clear the set in an effect keyed on `activeRecordType` / `activePhase`.
- New `src/components/dashboard/SeasonalRatingsPanel.tsx` for the drawer markup, keeping FileInspector readable.
- Styling uses the existing table token classes; the specified hexes above match the palette already in use.

## Out of scope

- Editing seasonal ratings inline (read-only, like the rest of the inspector).
- Transformer seasonal ratings and any change to the standalone Ratings module.
