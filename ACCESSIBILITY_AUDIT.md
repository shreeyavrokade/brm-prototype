# Accessibility and regression audit

**Date:** 2026-11-13. **Final rebuilt revision:** `85d23d2`. **Verdict:** the prototype runs and the refined submission journey works, but the reviewed application is **not ready for a WCAG AA conformance claim**. Accessibility and deployment blockers remain.

This audits the current refined build, including shared infrastructure used by the additions; it does not assert every issue was introduced by NEXT refinement. Contrast/layout changes landed during testing, so both builds and the automated screen scans were repeated on the final revision. Initial transition/background false positives were replaced with stable, component-scoped dialog results.

## Scope and evidence

- Chromium, desktop 1280×900 and narrow 320×800, neutral brand, default toast-feedback and simulated auto-acceptance modes.
- axe-core **4.10.3**, WCAG 2 A/AA, WCAG 2.1 A/AA, available WCAG 2.2 AA rules, plus best-practice rules. These tags do not cover every success criterion.
- **26 screen/state scans**, plus ten toast color measurements (five types × light/dark theme classes), keyboard/focus checks, reflow and limited text-spacing checks.
- Source review covers branding, shell/navigation, shared controls, uploader/stepper, issue grids/cards, resubmission/warning dialogs, tooltip/toast feedback, and MEM review controls.
- [Machine-readable summary](./output/accessibility/summary.json), raw results [1](./output/accessibility/batch1.json), [2](./output/accessibility/batch2.json), [3](./output/accessibility/batch3.json), [4](./output/accessibility/batch4.json), [toast measurements](./output/accessibility/toasts.json), [manual checks](./output/accessibility/manual.json), [dropdown keyboard check](./output/accessibility/keyboard.json).

The final scans report **10 distinct automated rule IDs** across the reviewed states. Shared findings repeat across screens and are not separate defects. Three component-scoped dialog scans have no automated violations: resubmission, unresolved-warning confirmation, and transaction Workflow Guide. This does not mean those dialogs pass all manual criteria. There are 105 incomplete node-review appearances across scans (including duplicates); these are unresolved checks, not confirmed failures.

## Functional and quality results

| Check | Result and practical limit |
| --- | --- |
| `npm test` | **20/20 pass**, seven test files: sample parsing/validation, brand selection, status help, warning confirmation, engineer-return store and auto-accept guards. One is a placeholder assertion. No claim of full module/branch coverage. |
| App and node TypeScript projects | **Pass**, both `tsc -p … --noEmit`. |
| `npm run build` | **Pass**. |
| `npm run build:pages` | **Pass**. Correct separate Pages artifact; approximately 943 kB JS uncompressed. Existing chunk-size warning remains. |
| `npm run lint` | **Fail: 33 errors, 11 warnings**. See [log](./output/accessibility/lint.log). An initial concurrent build/lint attempt hit a disappearing output file; the final lint run was repeated after building and the counts above are the stable result. |
| Clean deployment install | **Fail**, `npm ci --dry-run --ignore-scripts --no-audit --no-fund`: stale lockfile, EUSAGE. Existing GAP-HOST-03 remains a deployment blocker. See [log](./output/accessibility/clean-install.log). No dependencies were changed. |
| Browser submission regression | **Pass**: sample v1 upload → project type → review/submit → required errors block review submission → corrected v2 upload/revalidation → warning confirmation → simulated acceptance retaining warnings. |
| Brand selection | Existing three brand tests pass; neutral used for screen scans. Previous five-preset visual checks are historical evidence, not rerun as part of these 26 scans. |
| Runtime modes | Default toast feedback/auto-accept mode tested. Alternative banner mode and manual engineer-review browser branch not fully exercised; related store tests pass. |

Logs: [tests](./output/accessibility/tests.log), [normal build](./output/accessibility/build.log), [Pages build](./output/accessibility/pages-build.log).

## Confirmed findings and follow-ups

Severity is an audit assessment; axe impact labels are retained separately in raw evidence. Criteria references identify the relevant assessment area, not an external certification.

| ID | Severity / criterion | Evidence | Recommended correction |
| --- | --- | --- | --- |
| A11Y-01 | High — 2.4.3, 2.4.11 | `src/components/auth/PasswordGate.tsx:33`: children remain active behind the overlay. Shift+Tab from the password field focuses the underlying page's Cancel button. The covered page is also scanned/exposed. | Render protected demo content only after entry, or use proper modal semantics with inert background and contained focus. This fixes access behavior, not production authentication. |
| A11Y-02 | High — 2.1.1 | `src/components/import/FileDropzone.tsx:27`: upload target is a DIV, tabindex -1, no role/key handling; file input display:none. | Supply a real keyboard-operable upload trigger and labelled file input, with Enter/Space activation and accessible instructions. Existing DS-05. |
| A11Y-03 | High — 4.1.2 | Unnamed controls: four Changeset pagination buttons (`ChangesetTable.tsx:160`), profile-directory control, topology detail pagination (`FileInspector.tsx:524`), engineer combobox, and eight dataset row-menu buttons (`DatasetGrid.tsx:357`). | Give controls specific accessible names, including row context where needed. Disable nonfunctional controls or implement their behavior. |
| A11Y-04 | High — 1.4.3 | Final contrast failures persist: inactive header/footprint text #696969 on #E2E8F0 **4.45:1**; MEM PASS badge white on #0284C7 **4.09:1**; Not Required text **1.99:1**; dataset “Datasets” label **2.52:1**. References: `GlobalHeader.tsx:40`, `PassHandoffBanner.tsx:47`, MEMLoadReview status map and DatasetGrid workspace labels. | Apply semantic foreground tokens that meet 4.5:1 at actual size/background. Do not round 4.45 up to a pass; verify normal, hover, selected and focus states. Small bold text still needs 4.5:1. |
| A11Y-05 | Medium — 1.3.1, 3.3.2, 4.1.2 | `src/pages/ImportSubmission.tsx:447` and `:453`: Project Name and Submitter Name read-only/disabled inputs have visible text labels but no programmatic association; axe label failures. | Associate labels using id/htmlFor or use labelled display text for non-editable values. |
| A11Y-06 | High — 1.3.1 | `src/components/layout/AppSidebar.tsx:64`: DIV wrappers are direct UL children, with LI descendants not directly parented by a list. Repeats across BRM, MEM and engineer views. | Use valid list/nested-list structure while preserving hierarchy and expansion behavior. |
| A11Y-07 | Medium — 4.1.2 | `src/pages/MEMLoadReview.tsx:209`: progressbar has values but no accessible name. | Link it to the existing overall-progress text and verify determinate value announcement. |
| A11Y-08 | High — 2.4.3 | Resubmission dialog Tab containment and Escape dismissal pass, but after closing and finishing animation **focus is BODY**, not Upload New Version. | Use DialogTrigger or explicitly restore focus to the actual opener in onCloseAutoFocus; cover Cancel, Escape and completed resubmission. |
| A11Y-09 | High — 1.4.10 | At 320px the import page scrollWidth is **378px** and the stepper is visibly clipped. BRM tablist is **628px** inside a 320px main area; MEM main reports 365px internal content. See [320px screenshot](./output/accessibility/import-320.png). | Reflow the stepper and essential navigation/actions; allow deliberate keyboard-operable scrolling only for content that needs two-dimensional layout, such as data tables. Do not treat an entire clipped workflow as a table exception. Verify hidden overflow and offscreen actions manually. |
| A11Y-10 | Medium — 2.1.1; component review | Shared table overflow container `src/components/ui/table.tsx:7` is not focusable; axe flags detail grid scrolling. Project-type listbox also gets a scroll-region flag, **but keyboard Space/ArrowDown/Enter selection and return to trigger pass**. | Make static overflow grids keyboard reachable with a meaningful region name. Investigate listbox semantics separately; do not break Radix keyboard behavior solely to silence axe. |
| A11Y-11 | High — 2.1.1 | Source review: issue-card selection and table-row navigation are click-only (`IssueResolutionPanel.tsx:59`, `IssueSidebar.tsx:99`, `FileInspector.tsx:384`), without equivalent keyboard handlers/selection controls on those targets. | Provide clear keyboard actions for row selection/issue targeting; use buttons/links rather than making entire cards pseudo-buttons with nested controls. This is not reliably detected by axe. |
| A11Y-12 | Medium — bypass/structure review | Detail screens have no main landmark; region findings recur; import headings skip levels. No explicit skip-to-content pattern found in app source. Missing landmarks alone are best-practice findings, not automatic proof of a specific WCAG failure. | Add a coherent main/heading structure and a tested keyboard bypass mechanism; check sticky header focus visibility. |
| A11Y-13 | Recommendation / AAA motion review | With prefers-reduced-motion:reduce, tested dialog still has `animation-name: enter`, duration **0.15s**. | Add reduced-motion treatment across shared primitives. This short animation alone is not an automatic WCAG AA failure; SC 2.3.3 is AAA. |

Recent corrections **did remove** the earlier topology issue-panel/grid contrast failures on the tested default state. Raw results from the final revision supersede the initial scan; the older 4.19:1 phase-header/issue-copy findings should not be reopened from the initial snapshot. Every hover combination is not certified: for example #6C6B6B on #E8E8E8 is about 4.34:1 and still needs assessment wherever those colors actually meet.

## Checks that pass or are limited

- Status help opens on keyboard focus and closes with Escape after its exit animation. Touch support is present in source but was not physically/device-tested.
- Resubmission dialog contains focus during eight Tab presses and closes with Escape. Focus-return failure remains A11Y-08.
- Resubmission, warning-confirmation and transaction Workflow Guide dialogs have **zero automated violations when scanned in isolation after opening animations complete**. Initial background-page/transition results were excluded from the final dialog conclusion.
- All five toast types use readable opaque foregrounds in both light/dark theme classes: neutral/info **9.98:1**, success **6.53:1**, warning **9.59:1**, error **5.61:1**, including sampled icons/actions/close controls. Scoped error-toast axe check has no violations; a polite live region is present. This is markup/contrast evidence, not a screen-reader announcement test.
- At desktop width, injected WCAG text-spacing values did not introduce document-level horizontal overflow on the tested import state (1280px). See [text-spacing screenshot](./output/accessibility/import-text-spacing.png). This does not certify every component for text spacing or 200% text resize.
- Page reflow checks cover three representative screens, not every dialog/long-data permutation. Tables may legitimately scroll; surrounding controls still need to remain usable.

## Screen/state coverage

Raw counts are rule categories per scan, not unique affected components. Shared issues repeat.

| Screen/state | Automated violation rules | Unresolved manual-review rules |
| --- | --- | --- |
| access-gate | color-contrast, heading-order, region | color-contrast |
| brm-topology | button-name, color-contrast, list, listitem, region | aria-prohibited-attr |
| brm-profiles | button-name, color-contrast, list, listitem, region | aria-prohibited-attr |
| brm-ratings | color-contrast, list, listitem, region | aria-prohibited-attr |
| brm-equipment | color-contrast, list, listitem, region | aria-prohibited-attr, color-contrast |
| brm-transactions | color-contrast, list, listitem, region | aria-prohibited-attr |
| topology-import | color-contrast, heading-order | color-contrast |
| ratings-import | color-contrast | color-contrast |
| profiles-import | color-contrast | color-contrast |
| transaction-import | color-contrast | color-contrast |
| ratings-detail | color-contrast, landmark-one-main, region | aria-prohibited-attr, aria-valid-attr-value |
| profiles-detail | color-contrast, landmark-one-main, region | aria-prohibited-attr |
| topology-detail | button-name, landmark-one-main, region, scrollable-region-focusable | aria-prohibited-attr |
| mem-generation | color-contrast, list, listitem, region | None returned |
| mem-load | color-contrast, list, listitem, region | None returned |
| mem-load-review | aria-progressbar-name, color-contrast, region | color-contrast |
| engineer-dashboard | button-name, color-contrast, list, listitem, region | aria-prohibited-attr |
| import-details-step | color-contrast, label | color-contrast |
| project-type-dropdown | scrollable-region-focusable | None returned |
| import-review-step | color-contrast | None returned |
| uploaded-required-errors | button-name, landmark-one-main, region, scrollable-region-focusable | aria-prohibited-attr |
| resubmit-dialog | None in scoped scan | None returned |
| warning-confirmation-dialog | None in scoped scan | None returned |
| accepted-submission | button-name, landmark-one-main, region, scrollable-region-focusable | aria-prohibited-attr |
| mem-dataset-workspace | button-name, color-contrast | aria-prohibited-attr, color-contrast |
| transaction-explainer | None in scoped scan | aria-prohibited-attr, color-contrast |

## Remediation and release order

1. Fix gate focus/background exposure, keyboard upload and click-only selection/navigation, control names, and dialog focus restoration.
2. Fix shared header/MEM contrast and validate all control states; retain the corrected notification palette and issue-card treatment.
3. Repair sidebar structure, field associations, progress naming, grid scrolling and 320px workflow reflow.
4. Complete landmark/bypass and reduced-motion improvements; validate touch and small targets with their WCAG exceptions rather than using a blanket pixel-size rule.
5. Rerun the affected axe states, keyboard journey, both builds, tests and TypeScript. Resolve source lint errors and synchronize the lockfile before a clean Pages deployment.
6. Finish human checks before claiming AA: VoiceOver/NVDA/JAWS navigation and announcements, reading order, keyboard-only end-to-end completion, visible/obscured focus, touch target sizing, high contrast/forced colors, 200% text resize, full text-spacing behavior and long-content reflow.

No app or Figma changes were made by this audit. The raw scans are an audit record, not a new CI suite. Full transaction acknowledgment/counter-offer flows, all Ratings/Profiles edit paths, every MEM dataset/editor, alternate validation/banner modes, cross-browser/mobile-device behavior, production security, dependency vulnerability scanning and live GitHub hosting were not comprehensively tested. NEXT visual parity remains a separate open design requirement. Broader source lint and lockfile failures predate this audit.

## References

- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) — success criteria and manual assessment areas.
- [axe-core](https://github.com/dequelabs/axe-core) — automated accessibility engine; limited to machine-testable rules.
- [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) — supplementary interaction, focus, layout and form checks. These guidelines are not the WCAG standard.
