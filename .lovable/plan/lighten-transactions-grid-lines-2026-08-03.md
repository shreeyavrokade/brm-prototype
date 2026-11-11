# Lighten Transactions grid lines

The Transactions table draws a 1px border on all four sides of every cell. Adjacent cells stack their borders, so lines read as 2px and the grid looks heavier than the Topology Changeset and Profiles tables.

## Change

- Switch Transactions header and body cells from full four-sided borders to right + bottom borders only, so neighbouring cells share a single 1px line.
- Keep the outer frame from the table container so the edges still close cleanly.
- Keep the existing `#E2E8F0` border color, `h-12 px-4` headers, `px-4 py-1.5` body cells, zebra rows, hover tint, and the sequence-block tint unchanged.
- Apply the same treatment to the sticky pinned columns (ID/Status on the left, Action kebab on the right) so their dividers match the scrollable area instead of doubling at the freeze seam.

## Technical notes

- File: `src/components/topology/TransactionsTable.tsx`, constants `TH_BASE` and `TD_BASE` (`border border-[#E2E8F0]` becomes `border-r border-b border-[#E2E8F0]`), plus the per-cell border classes on the pinned columns and the sequence block header/cells.
- No data, state-machine, or column changes.
