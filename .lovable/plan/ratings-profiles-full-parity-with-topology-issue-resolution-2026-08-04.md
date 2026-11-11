# Ratings & Profiles: Full Parity with Topology Issue Resolution

Replace the overlay Issue Resolution sheet on the Ratings and Profiles submission detail screens with the same docked, resizable panel and two-way grid sync used on the Topology Changeset screen.

## What changes for the user

1. **Docked panel instead of an overlay drawer**
   - The issue panel sits to the right of the grid as a resizable column (default 30% width, min 20%, max 50%), with a drag handle between grid and panel.
   - A toggle button hides the panel so the grid takes the full width.
   - The banner's "Inspect & Resolve Issues" / "View Warnings" button now opens (or focuses) this docked panel instead of a slide-over.

2. **Two-way sync between grid and panel**
   - Hovering an issue card highlights that exact row and cell in the grid.
   - Clicking an issue card selects the row, scrolls it into view, and gives it a colored left border plus a selection ring.
   - Clicking a row in the grid filters the panel to that row's issues, opens the panel if hidden, and scrolls to the matching card. Clicking the same row again clears the filter.
   - Clicking an error/warning cell selects that row and highlights its card.

3. **Panel structure matching Topology**
   - Sticky header: "Issue Resolution", switching to "Issues for Row {n}" when filtered, with a "Show All" reset.
   - Grouped accordion: dataset section (Ratings tab / Load Gen, Bus, Generator) then rule category, each with error and warning count badges and a green check when clean.
   - Issue card: severity-colored left border, `Row {n} | FIELD` header, "Required Fix" / "Optional Fix" badge, rule code, and description.
   - Warnings get a "Dismiss" action with an optional reason; dismissed cards fade and show who dismissed them and why.
   - Empty state: green check with "No issues found".

4. **Quick filter pills stay** above the grid (All / Errors / Warnings / Valid) and continue to filter rows.

5. **Submit gate** remains locked while any non-dismissed error exists; dismissing a warning does not unlock or block anything.

## Technical approach

- **Shared panel component**: extract the Topology panel behavior into `src/components/submission/IssueResolutionPanel.tsx`, modeled on `src/components/dashboard/IssueSidebar.tsx` but driven by the existing `CellIssue` shape in `src/components/submission/validationIssues.ts`. Keeps Hitachi tokens already in use (`#C82333`/`#FBE5E8`, `#FFBE2E`/`#FCF2D9`, `#DEEDE2`/`#146C2E`).
- **Issue state**: add `dismissed` and `dismissReason` to `CellIssue`; hold the issue list in page state on `RatingsSubmissionDetail.tsx` and `ProfilesSubmissionDetail.tsx` so dismissals persist within the session.
- **Cross-highlight context**: extend `SubmissionIssueContext.tsx` from a single `hoveredRef` to `{ hoveredRowId, hoveredCellKey, selectedRowId }` plus setters, so grids and panel share state without prop drilling.
- **Shell layout**: add an optional `sidePanel` slot plus panel visibility state to `SubmissionShell.tsx`, rendering content and panel inside a `ResizablePanelGroup` (`ResizablePanel` / `ResizableHandle`, already in the project) when a panel is supplied.
- **Grids**: update `RatingsInspectorGrid.tsx` and `ProfilesInspectorGrid.tsx` to read hovered/selected state from context, apply cell-level hover highlight, row selection ring and left accent, scroll the selected row into view, and call row-select on row click. `IssueCell` keeps its tooltip and calls row-select on click.
- **Retire** `IssueInspectorSheet.tsx` once both pages use the docked panel.
- `ValidationSummaryBanner.tsx` keeps its current markup; its button now opens/focuses the docked panel.

## Out of scope

- No changes to Topology Changeset itself, to validation rule data, or to backend/persistence — dismissals are session-only, matching current Topology behavior.
