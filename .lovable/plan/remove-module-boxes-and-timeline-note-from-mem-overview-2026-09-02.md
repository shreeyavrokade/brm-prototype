# Remove Module Boxes and Timeline Note from MEM Overview

Clean up the MEM Overview hub (both Generation and Load tracks) by removing two blocks.

## Changes

1. **Module activity boxes** — remove the four cards (Topology, Ratings, Profiles, Transactions) shown above the checklist on both tracks.
2. **Timeline callout** — remove the blue info bar that reads "To make your review process easier and faster… deadline… March 15, 2027. View FAQs" from both tracks.

Everything else stays: page title, pass handoff banner, SPP modifications card, and the checklist engine (which moves up directly beneath those).

## Technical notes

- `src/pages/MarketEconomicModel.tsx`: drop the `<ModuleActivityMatrix>` and `<TimelineCallout>` renders in the checklist-hub branch, delete the now-unused local `TimelineCallout` component and the `ModuleActivityMatrix` / callout-text / `Info` imports if unused elsewhere.
- Leave `ModuleActivityMatrix.tsx`, `ModuleActivityCard.tsx`, and the module-visit tracking in `memPassStore.ts` in place (unused by this screen, still referenced by pass tracking) unless you want them deleted too.
- No changes to focus mode, checklist logic, or the Base Reliability Model screens.
