# MEM Overview — Pass Tracking, SPP Lock, Diff Summary

Update the existing MEM Overview (the checklist hub at `/market-economic?track=gen|load`) so it shows the current pass window, tracks which modules have been inspected, and surfaces SPP's changes when a new pass opens.

## 1. Existing Overview screen

- No new route or view param. The changes are added to the current MEM hub for both tracks (Generation and Load), which keeps its title, sidebar, and existing checklist.
- New order on the screen: page title → pass handoff banner → SPP modifications card (conditional) → existing timeline callout → module activity matrix → existing checklist engine.
- Focus mode (the full-screen dataset wizard) is unchanged.


## 2. State-aware handoff banner (top, full width)

Two states, driven by a single pass-state value:

- **Participant Review Turn** (default for the demo): light-blue card, `PASS 1 ACTIVE` badge, "Market Participant Review Window Is Open", pulsing clock with "Window Closes In: 04 Days 12 Hours 30 Mins", and the auto-tracking subtext.
- **SPP Review Turn**: slate card, `PASS 1 — IN SPP REVIEW` badge, "Pass Locked — Under SPP Engineering Review", lock icon with "SPP Window Closes: Sept 04, 2026", read-only subtext, plus a next-pass line for Sept 05, 2026 at 08:00 AM CST.

The demo starts in Participant Review Turn. The lock is visual only — module grids are not disabled.

## 3. SPP Modifications Summary card

Rendered directly beneath the banner only when the pass state is "Pass 2+ open after an SPP review". Amber card with an info icon, header "SPP Engineering Modifications (Pass 1 Review)", the two summary lines (Ratings emergency ratings, Transactions NSI profiles), and a "View Detailed SPP Diff Log →" outline button (no-op / toast for now).

## 4. Module activity matrix (4 cards)

Cards for Topology, Ratings, Profiles, Transactions in a responsive grid:

- Icon + title + status badge: **Incomplete** (red tokens) or **Complete** (green tokens).
- Incomplete subtext: "Attention Needed — Module not yet inspected." Complete subtext: "Inspected / Updated on <timestamp>" using the recorded visit time.
- Middle line: validation summary per module (errors/warnings counts from the existing live status data; Transactions shows a reviewed count).
- "Open & Inspect Grid →" navigates to the Base Reliability Model tab for that module and marks it Complete.

### Completion tracking

- Opening a module from the Overview, or landing on that module's tab in the Base Reliability Model, records a visit for the current pass.
- Visits persist in `localStorage`, keyed by track + pass number, so Complete survives reloads. Starting a new pass resets the matrix.

## Technical notes

- New `src/store/memPassStore.ts`: pass number, pass state (`participant` | `spp-review` | `participant-after-spp`), module visit map with timestamps, localStorage persistence, and a `useSyncExternalStore` hook (same pattern as `datasetStatusStore.ts`).
- New components under `src/components/mem/`: `PassHandoffBanner.tsx`, `SppModificationsCard.tsx`, `ModuleActivityCard.tsx`.
- `MarketEconomicModel.tsx` renders the three new blocks in its existing checklist-hub branch only; the focus-mode branch and checklist logic stay as they are.
- `BaseReliabilityModel.tsx` records a module visit whenever its active tab maps to one of the four tracked modules.

- Status pill colors reuse the existing shared tokens rather than new hardcoded values where they match.
