# MEM Inline Cell Editing Refactor

Move the MEM row review workflow from an expanded form drawer into true inline, column-aligned editing, and simplify the surrounding chrome.

## 1. Left datasets menu cleanup
`SectionWorkspace.tsx`
- Remove the green check icon next to verified dataset names; show plain text labels only.
- Keep active-state styling: subtle blue fill plus left blue border accent (already in place).

## 2. Footer cleanup
`SectionWorkspace.tsx`
- Remove the verification checkbox and its acknowledgment text from the fixed footer.
- Footer keeps only Cancel (left) and Next (right). Next enables whenever there are no validation errors.
- The `ACK_TEXT` import and `acked` state are dropped; advance gating uses `hasErrors` only.

## 3. Inline row edit mode (grid-preserving)
`DatasetGrid.tsx` and `ForecastGrid.tsx`
- Delete the expanded `<tr>` drawer with the grid-of-fields layout.
- When a row enters edit mode it stays a single `<tr>`; only the editable columns swap their content for a stacked two-line display:
  - Top line: `WAS: <baseline/SPP value>` in 11px muted gray, with the red dot when SPP changed that cell.
  - Bottom line: compact input, full cell width, 13px bold, tabular numerals, blue focus ring, amber border when the value differs from the stored value.
- Non-editable columns (Submittal Year, Demand Group Name, Zone, Status, etc.) keep normal single-line text and stay horizontally aligned. Row height grows slightly via cell padding only.
- Validation errors render as a small red message beneath the input in the same cell.

## 4. Row action controls (rightmost column)
- Normal state: status pill stays in its Status column; the actions cell shows an Edit button plus the existing kebab menu (Review Row entry removed, Activity/Delete kept).
- Edit state: the actions cell renders an inline button group — Accept (solid green), Save Changes (solid dark accent, enabled only when 1+ inputs changed), Cancel (ghost/outline, discards edits and exits).
- Accept sets the row to Accepted; Save Changes sets Pending SPP Review; both collapse back to single-line cells.
- The leading chevron/expander column is removed since there is no longer an expanded region.

## 5. Read-only SPP indicator
- Unchanged behavior: rows in Review Needed show the red dot in modified cells with the hover card reading `SPP Update: Baseline <was> → SPP <now>`.
- Update the `SppCellDot` hover card copy to that exact wording.

## Technical notes
- Files touched: `src/components/mem/DatasetGrid.tsx`, `src/components/mem/ForecastGrid.tsx`, `src/components/mem/SectionWorkspace.tsx`, `src/components/mem/SppCellDot.tsx`.
- Store logic (`rowReviewStore.ts`), dataset definitions, and SPP change seeds stay as-is; only rendering and edit UI change.
- `editingId` replaces `expandedId`; draft/error state and the Accept/Save/Cancel handlers are reused.
- Icons: `Pencil` for Edit, `Check` for Accept, `X` for Cancel (lucide-react).
