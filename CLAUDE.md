# Project rules

## Keep TRACKER.md current

After completing **every** task (code change, verification, PRD edit, scope decision, or bug found), update [TRACKER.md](./TRACKER.md) before reporting the task as done:

1. **Work log** — append a row: date (YYYY-MM-DD), requirement/check IDs touched, what changed or was decided, and evidence (file paths, commands run and their results, defect IDs).
2. **Requirement rows** — update Status and Evidence / next action for every affected `REQ-*` row. Use only the statuses defined in the tracker (Needs verification · To do · In progress · Blocked · Done). Mark Done only when behavior was actually checked and evidence is recorded.
3. **Acceptance checks** — if an `AC-*` check was run, record result, date, and environment.
4. **Follow-ups** — add a `GAP-*` row for any new defect, mismatch between PRD and code, or open question; close existing ones when resolved.
5. **New requirements** — if the PRD gains requirements (e.g. §12 sales-prototype items), add matching `REQ-*` rows.

Do not invent owners, target dates, or priorities — leave them as Unassigned / — unless the user provides them. Mention the tracker update in the task summary.
