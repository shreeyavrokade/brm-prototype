# Workflow Explainer Modal (Transaction Lifecycle Demonstrator)

An interactive, presentation-ready modal that shows how Macro Status and Acknowledgment State differ across Client, Counterparty, and SPP Engineer views.

## Entry point
A "Workflow Guide" button (help-circle icon + label) placed in the Transactions tab toolbar only — next to the Transactions search/filter controls in `BaseReliabilityModel.tsx`. It does not appear in the global header or on any other tab.

## New component: `src/components/topology/WorkflowExplainerModal.tsx`
Self-contained, no store writes — pure simulation state.

### Layout
- `Dialog` content `w-[800px] max-w-[95vw] rounded-2xl p-6`.
- Title: "Transaction Lifecycle & Role Scoping Architecture"; subtitle: "Simulate how statuses change across Client, Counterparty, and SPP Engineer views."
- Role switcher: 3 radio-style segmented tabs — Client (Submitting Entity), Counterparty (Confirming Entity), SPP / EP Engineer.
- Stage stepper: 4 clickable numbered steps with a connecting line, active step highlighted:
  1. Initial Non-Firm Submission
  2. Counterparty Counter-Offer
  3. Agreement Reached (EP Queue)
  4. EP Engineer Approval / Rejection
  - Step 4 gets a small Approve / Reject toggle so the final outcome pill can be demonstrated both ways.

### Preview card (3 columns, updates on role + stage)
- Col 1 — Macro Status: `StatusPill` from `src/components/shared/statusBadge.tsx`, labeled "Pending Approval" for `Pending Acceptance` (same mapping as `txStatusBadge`).
- Col 2 — Role-Scoped Acknowledgment: `Action Needed` (`bg-[#FCF2D9] text-[#6D4D09]`) when it is the selected role's turn, `Acknowledged` (`bg-[#DEEDE2] text-[#146C2E]`) once signed off. For the EP role, show the macro-status framing note instead of a party badge (matches production behavior where EP sees status, not acks).
- Col 3 — Available Actions banner: short sentence per role/stage, e.g. "Counter Panel Enabled", "Commercial Edits Frozen — Waiting on SPP Review", "Approve for Model Build / Reject Transaction".

### Simulation matrix (drives the card)
| Stage | Macro | Client ack | Counterparty ack | EP actions |
|---|---|---|---|---|
| 1 | Review Needed | Acknowledged | Action Needed | Read-only, not in queue |
| 2 | Review Needed | Action Needed | Acknowledged | Read-only, not in queue |
| 3 | Pending Approval | Acknowledged | Acknowledged | Approve / Reject enabled |
| 4a Approve | Accepted | Acknowledged | Acknowledged | Locked, model build |
| 4b Reject | Rejected | Action Needed (return for revision) | Action Needed | Rejection reason recorded |

### Callout cards (persistent, below simulator)
- Box 1 — "Macro Status = Model Build Journey": Review Needed → Pending Approval → Accepted/Rejected.
- Box 2 — "Acknowledgment State = Action Needed vs Acknowledged": each party sees only their own binary turn state.

## Technical notes
- Local `useState` for `role`, `stage`, `outcome`; no changes to `transactionsStore` or the live grid.
- Status pills reuse the shared token source; no local color overrides for macro status. Ack badge colors use the hex values specified in the request.
- Existing `ackRole.ts` / `CURRENT_ROLE` behavior is untouched — this modal is explanatory only.
