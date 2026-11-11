# Role-Scoped Acknowledgment States & EP Rejection Flow

## Decisions applied
- Current role comes from a single fixed demo constant (`CURRENT_ROLE`), easy to flip between `CP1` / `CP2` / `EP`.
- No new status pill: the existing **Pending Acceptance** status and status column stay as-is; it represents the EP review queue.

## 1. Data model (`src/store/transactionsStore.ts`)
Add per-party acknowledgment fields to `TransactionRecord`:
- `cp1Ack: "Action Needed" | "Acknowledged"`
- `cp2Ack: "Action Needed" | "Acknowledged"`
- `origin: "non-firm" | "firm"` (who created it)
- `rejectionReason?: string`

Seeding rules on creation:
- Non-Firm (created by CP1): status `Review Needed`, `cp1Ack = Acknowledged`, `cp2Ack = Action Needed`.
- Firm (uploaded by EP Engineer): status `Review Needed`, both `Action Needed`.

New store actions:
- `setAck(id, party, state)` — writes the party state, then runs the auto-transition.
- Auto-transition: when both parties are `Acknowledged` and status is `Review Needed`, status becomes `Pending Acceptance` (EP queue).
- `approveTransaction(id)` → `Accepted`.
- `rejectTransaction(id, reason, mode)` → `Rejected` or back to `Review Needed` (resets both acks to `Action Needed`), storing the reason and appending an activity entry.

Existing rows are back-filled from their current status so the grid stays coherent.

## 2. Role-scoped Acknowledgment column
New helper module `src/components/topology/ackRole.ts` holding `CURRENT_ROLE`, party resolution, and label logic. `ackBadge.tsx` is extended (existing lifecycle badge kept for the detail views):
- Role CP1 → render CP1's state only.
- Role CP2 → render CP2's state only.
- Role EP → render a summary badge `CP1: Ack | CP2: Action Needed` using neutral/amber tokens.

Colors from the shared token set: `Action Needed` uses the amber pending tokens, `Acknowledged` uses the green accepted tokens.

## 3. Clickable badge launcher
In `TransactionsTable.tsx`, when the badge shown for the current role is `Action Needed`, render it as a button with `cursor-pointer hover:scale-105 transition-transform` and an aria-label. Clicking opens the existing **Counter Offer** slide-over scrolled to the seasonal matrix. EP summary badges are not clickable.

## 4. Counter loop (`CounterOfferDialog.tsx`)
Rewire footer actions to the party model instead of directly setting statuses:
- **Send Counter** (from CP2): `cp2Ack = Acknowledged`, `cp1Ack = Action Needed`, status stays `Review Needed`, counter MW values + justification saved.
- **Approve as Countered** (label replaces "Accept Counter" when the acting party is reviewing a received counter): sets the acting party to `Acknowledged`; if both are then acknowledged the store flips status to `Pending Acceptance`.
- **Reject Offer** stays, routed through `rejectTransaction`.
- Panel header shows both party states so the acting user sees whose turn it is.

## 5. EP Engineer review & rejection
For `CURRENT_ROLE === "EP"` and status `Pending Acceptance`:
- Row kebab menu + the activity slide-over footer gain **Approve for Model Build** and **Reject Transaction**.
- Approve → `Accepted` (green pill) + toast.
- Reject → new `RejectTransactionDialog.tsx` modal: required reason textarea plus a choice of outcome — *Reject outright* (`Rejected`, black pill per the token set) or *Return for revision* (`Review Needed`, both acks reset). Reason is written to the record and the activity feed.

Non-EP roles do not see these actions.

## Technical details
- All state is in-memory in `transactionsStore.ts`; no backend calls.
- Status pills continue to come from `src/components/shared/statusBadge.tsx` — no local color overrides.
- Existing `getAckStage`/`AckBadge` lifecycle logic is preserved for `TransactionActivitySheet` and detail views; the grid column switches to the new role-scoped renderer.

## Out of scope
- Real authentication or a user_roles table.
- Notifications/emails to counterparties.
