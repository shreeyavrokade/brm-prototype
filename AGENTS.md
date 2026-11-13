# Project instructions

- Answer to the point. Elaborate only when asked.

## Required change tracking

- Use `TRACKER.md` (the canonical filename; do not create a separate `tracker.md`) to track every code, design, documentation, configuration, scope, and verification change.
- Before reporting any task complete, update the affected requirement/task statuses and evidence, and add a dated Work log entry **at the top of the table (newest first)** with IDs, what changed, affected file paths, checks and results, any remaining work, and a ready-to-use Conventional Commits subject in the Commit message column (replace it with `Committed — <hash> <subject>` once committed). Apply this to all task IDs, including `REQ-*`, `WL-*`, and `AC-*`.
- Add tracker rows for new requirements and follow-up rows for discovered defects, design conflicts, or open questions. Leave owners, dates, and priorities unassigned unless supplied.
- Mark Done only when the relevant behavior or deliverable has been checked and evidence recorded. Explicitly record checks that were not run.
- Preserve existing tracker entries and history. Documentation and rule changes must also log themselves.

## Prototype design references

- Product screens and workflow intent: [BRM — Intake Flow Prototype](https://www.figma.com/design/uuEDF0zS746imujffOsc75/Base-Reliability-Model--Copy-?node-id=8004-18175), file `uuEDF0zS746imujffOsc75`, page `8004:18175`.
- White-label components and styling: [Hitachi NEXT Design System 6.3.1](https://www.figma.com/design/IP7UpMBipYr1A9cGUNpPQd/Next-Design-System-6.3.1?node-id=0-1). Node `0:1` is its cover; inspect relevant component pages.
- Consult PRD §§12.2–12.4 and these references when building the interactive prototype. Fetch relevant frame context and screenshots before implementation. Adapt client-specific branding to NEXT while preserving demonstrable workflows and existing client-side state. Record design conflicts and resolutions in `TRACKER.md`.

## White-label branding

- Client name, product name, logo and favicon come only from `src/config/brand.ts` (presets) and `public/brand/<preset>/` (`logo.svg` 200×40, `mark.svg` 32×32). Follow `WHITE_LABEL.md`.
- To rebrand, add or edit a preset and its asset folder; don't hard-code client names or logos in components. New visible text that names the client must use `brand.clientShortName` (or another `brand` field).
- Keep internal identifiers (`SPP_ENGINEER`, `"Pending SPP Review"`, `spp/` folder, `Spp*` names) unchanged.
