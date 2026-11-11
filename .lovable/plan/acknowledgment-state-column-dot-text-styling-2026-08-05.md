# Acknowledgment State Column — Dot + Text Styling

Restyle the Acknowledgment State cell in the Transactions grid to match the screenshot: a small colored dot followed by colored label text, with no pill background or border.

## Visual spec

- `Action Needed` — red dot + red label (`#C82333`).
- `Acknowledged` — green dot + green label (`#146C2E`).
- Dot: 6px filled circle, 8px gap before the label.
- Label: 14px regular weight, no uppercase, no background, no border, no checkmark icon.
- Left-aligned in the cell; hover/zebra row backgrounds show through unchanged.
- Actionable rows keep their click behavior and focus ring, just without the pill chrome.

## Technical notes

- Edit `src/components/topology/ackBadge.tsx`: replace the `ACK_TOKENS` pill classes and `PILL` base string with a dot-and-text renderer; drop the `Check` icon import.
- `AckStatePill` stays the exported component name so `RoleAckBadge` and any other call sites keep working.
- EP role still renders the macro `TxStatusBadge` pill — that is unchanged.
- Colors reuse the existing status hexes already in the palette; no new tokens.
