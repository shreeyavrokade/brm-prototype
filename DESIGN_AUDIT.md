# White-label and NEXT design-system audit

Date: 2026-11-13. Scope: current application source, brand configuration, shared primitives, representative feature components, live NEXT Figma metadata, and a browser check of the existing Pages artifact. Audit only: no app or Figma designs changed.

**Verdict: identity white labeling is substantially centralized; configurable visual theming is incomplete; NEXT 6.3.1 component conformance is not established and has a confirmed button mismatch.** This build should not yet be described as fully NEXT-compliant or fully theme-configurable.

## What works

- `src/config/brand.ts` provides five presets, names, codes, coordinator title, logo, favicon, and header-name visibility. Names/images can be changed without editing business logic.
- `GlobalHeader.tsx`, `PasswordGate.tsx`, submission dialogs, and status help consume the brand configuration. `applyDocumentBranding()` sets title/favicon. Asset URLs respect the deployment base.
- 32 source files import the shared brand configuration. This is reuse evidence, not proof that all visible content is generalized.
- Shared Button, Input, Select, Dialog, Tooltip, Tabs and StatusPill provide useful places to apply NEXT styling. Retaining Radix interaction foundations is compatible with a NEXT implementation; replacing the entire component stack is not inherently necessary.
- Business statuses are centralized in StatusPill, including contextual next-step guidance. Existing internal SPP keys can remain unchanged as instructed.

## Findings

| ID | Severity | Finding and evidence | Required correction |
| --- | --- | --- | --- |
| DS-01 | High | BrandConfig has no theme fields or theme application. Browser checks of ERCOT, Acme and Neutral change logos but all retain `--brand: 0 100% 40%`, the same active-tab red and Inter font. CSS is labeled Dawn and Tailwind repeats literal palettes. See `src/config/brand.ts`, `src/index.css:14`, `tailwind.config.ts`. | Establish verified NEXT foundations, semantic tokens and an explicit white-label policy. Provide only permitted per-brand overrides (e.g. accent and on-accent), apply them once, and derive hover/focus/active treatment centrally. Keep semantic success/error meaning independent of the client accent. Typography may remain NEXT-fixed if that is the agreed policy; it need not vary per client. |
| DS-02 | High | Shared components are shadcn/Radix-derived, with no documented NEXT variant mapping. Live NEXT Primary/Enabled/No Icon `10:4143` is 79×32 and pill-shaped (screenshot inspected). `src/components/ui/button.tsx:8` uses rounded-md, and its default at line 21 is h-10 (40px); the configured radius is 6px. This is a concrete default mismatch, even though some call sites override sizes. | Map NEXT primary/secondary/ghost/text-link/context buttons and all states to the shared Button API. Verify geometry, typography, colors, focus, hover and disabled treatment. Document any deliberate larger touch target or product-specific exception. |
| DS-03 | High | Literal colors bypass the theme in validation, dialogs, status pills and tables. Static scan found 536 hex-color occurrences across 58 TS/TSX files. Largest: IssueResolutionPanel 43, ValidationSummaryBanner 40, statusBadge 30. These counts are lexical occurrences, not unique colors or 536 separate defects. SubmitWithWarningsDialog overrides Button background/hover directly. | Replace component-level appearance literals with semantic tokens and variants. Review status tokens separately from brand tokens. Keep visual values in one foundation layer rather than both CSS and Tailwind literal palettes. |
| DS-04 | Medium | Components bypass shared primitives: 42 native button tags, 5 native input tags and 7 native table tags outside `components/ui`. Examples include the custom header view switcher and password-screen pill button. Counts include valid specialized controls; native markup alone is not a violation. | Inventory and consolidate controls that duplicate shared UI. Give custom widgets a documented NEXT mapping instead of assuming a shared theme reaches them. Retain appropriate native file inputs and semantic tables. |
| DS-05 | Medium | FileDropzone's visible clickable div has no keyboard focus, button semantics, or Enter/Space handler; its file input is `display:none`. See `src/components/import/FileDropzone.tsx:27`. NEXT file-upload adoption has not been verified. | Provide a keyboard-operable upload button/label and associated file input, accessible instructions and validation feedback; then compare drag/drop and upload states with NEXT File Uploader. |
| DS-06 | Medium | Brand selection is resolved once at module load. Precedence is URL → stored preset → VITE_BRAND → default. An old browser preset overrides a new build default. If localStorage.setItem throws for a valid URL preset, the catch skips that URL selection and falls through to the build/default preset. See `src/config/brand.ts:142`. | Document precedence and reload behavior; make URL selection independent of storage write success. Decide whether a build-pinned pitch may override remembered preferences. Verify with storage disabled and with an old saved brand. |
| GAP-03 | Medium | Sample identifiers and utility names remain client-specific across tables, import hints and MEM datasets (WFEC, AEP, Westar, etc.). The brand preset does not configure the footprint or sample-data catalog. | Generalize or select demo datasets by preset. Do not rename internal role/store keys or blindly replace domain data. |
| GAP-04 | Medium | Static OG/Twitter metadata and the old Lovable preview image do not follow brand selection. JavaScript document-title updates do not supply preset-specific social previews to ordinary crawlers. | Configure build-time share metadata/assets, or use an intentionally neutral preview and document that URL-selected branding does not alter the crawler preview. |
| GAP-09 | Medium | ERCOT default uses a temporary wordmark, already documented in the config. Header sizes come from logoClassName but PasswordGate fixes its image to h-10. | Replace the placeholder when the intended asset is available; verify both logo placements, long product names and narrow layouts. Centralize logo size rules if separate header/gate sizing must be configurable. |

A Dawn comment or lack of a NEXT npm package is not by itself proof of noncompliance. The issue is the verified mismatch and missing traceability/state validation. Figma components do not automatically become runtime React components.

## Component coverage and next checks

| Application component | Current implementation | NEXT source / comparison state |
| --- | --- | --- |
| Button | CVA + Radix Slot; default 40px, rounded-md | [Button](https://www.figma.com/design/IP7UpMBipYr1A9cGUNpPQd?node-id=10-4143): primary specimen visually inspected; mismatch confirmed. |
| Input / textarea | Shared native wrappers; label/help/error composed at call sites | [Input](https://www.figma.com/design/IP7UpMBipYr1A9cGUNpPQd?node-id=56-13625): metadata shows Enabled, Hover, Focus, Error, Disabled and Read Only. Full 58px specimen includes composed content; do not compare that directly to a bare input height. Detailed styling unverified. |
| Select / dropdown | Radix; selected-row/hover tokens and description prop | `.Dropdown Menu` page 147:48500 and selection/input patterns: variant/state comparison pending. |
| Tabs / header / navigation | Radix tabs; custom header switcher and sidebar | Tab 88:42079, Header 324:100878, Navigation System 600:173477: mapping pending. |
| Status pills / status help | Badge + literal semantic palette; Radix tooltip with touch/focus handling | Badge 3:596, Tag 88:42845, Tooltip 88:44328: status-to-NEXT mapping and interaction parity pending. |
| Warning/resubmit/return dialogs | Radix Dialog with feature-specific dimensions and color overrides | [Dialog](https://www.figma.com/design/IP7UpMBipYr1A9cGUNpPQd?node-id=324-43335): metadata confirms modal/nonmodal and informative/positive/critical variants. No claim that a 412px simple or 684px advanced reference must replace every product-specific width. Full comparison pending. |
| Upload / import stepper | Custom file dropzone and stepper | File Uploader 324:82682, Stepper 687:250350, Wizard 687:262330: mapping pending; keyboard gap confirmed in source. |
| Tables / inspection grids | Shared helpers plus multiple feature/native grids | Table 759:116616: density, header, editing, row/cell selection and validation treatment pending. |
| Notifications | Existing Sonner/shadcn toast components | Notification 672:188628: severity, duration, placement and action mapping pending. |
| Icons | Mixed Lucide and Phosphor imports | Icons 1150:99070: approved icon family/size/weight mapping pending; no new package implied. |

## Recommended sequence

1. Complete WL-01: record authoritative NEXT tokens and variants, establish the component-to-source matrix, and define permitted client-brand overrides.
2. Complete WL-02: introduce central semantic theme application and remove duplicated foundation values. Verify accent contrast without recoloring validation semantics.
3. Work through WL-04/WL-05: adapt shared primitives first, then custom switches, uploader, grids and feature overrides. Keep current workflows and client-side stores.
4. Finish WL-03/WL-06: check content, imagery, client data and branding across participant and engineer views, BRM, MEM and all submission screens.
5. Complete WL-07/WL-08 with a component state gallery and paired Figma/app screenshots: default, hover, focus, selected, disabled, error, read-only, long text, narrow layout, keyboard and touch. Verify changing a permitted brand override requires no feature-component edits.

## Evidence and limits

- NEXT file `IP7UpMBipYr1A9cGUNpPQd`: live Button, Input and Dialog metadata fetched. Primary button screenshot fetched and visually inspected. `get_design_context` returned a Code Connect setup prompt rather than detailed styles; no connection was created, and unreturned token values were not guessed.
- Source inspection and lexical inventory cover TS/TSX files, CSS theme, Tailwind configuration, components.json, package dependencies, brand guide and HTML metadata.
- Chromium check on the existing built Pages artifact under `/brm-prototype/`: ERCOT, Acme and Neutral logo paths switch; computed brand/active-text values and font remain identical. This verifies the configuration behavior, not all source edits or whole-screen visual parity.
- No Figma writes, app changes, new build/tests, full accessibility certification, full responsive review or exhaustive component-state screenshot comparison were performed. Audit completion does not complete NEXT adoption.

## Neutral sales-demo vision and NEXT adoption strategy

The prototype should make a buyer confident that the platform understands their submission and review problems, can guide a user through them, and has a credible path to adoption. NEXT should give every screen a consistent interaction language while the demonstration supplies the evidence. Visual consistency supports the pitch; it cannot guarantee a sale.

### Keep the product neutral and the conversation relevant

Use a neutral product identity, generic operator terminology, fictional organizations and representative datasets as the default demonstration. Neutrality must include table records, filenames, activity authors, counterparties, diagrams, browser metadata and downloaded files—not just the header logo. Use “Submitting organization”, “Planning team”, and “Reviewing organization” where these communicate the role more clearly than client-specific acronyms. Retain established energy-planning terms where they are meaningful.

The current source defaults to ERCOT. Switching the sales baseline to `neutral`, generalizing the demo catalog and neutralizing share metadata are **proposed changes**, not completed work. Explicit customer branding can remain an optional preset when requested. A presenter should be able to prepare a relevant pitch without modifying feature components or business logic.

Separate three concerns:

| Layer | What belongs here | What can change for a pitch |
| --- | --- | --- |
| NEXT foundations and shared components | Typography, spacing, surfaces, control anatomy, focus treatment, semantic status/severity and interaction states | Keep stable across pitches; permit only documented brand overrides that preserve contrast and meaning. |
| Product identity | Neutral/default name and mark; optional client name, logo, favicon and permitted accent | Select a preset; no screen-specific styling patches. |
| Demonstration scenario | Fictional organizations, sample submissions, issue examples, role labels, presenter checkpoints and starting state | Choose a coherent scenario and depth of walkthrough. This configuration is separate from the identity preset. |

Do not ship one layout for each prospective customer. Build reusable product patterns on verified NEXT primitives and let content make the audience connection.

### Lead with a short, repeatable proof of value

Prepare one core walkthrough that can be delivered in roughly five minutes, with optional deeper branches. Start with a concrete problem: “A planning team receives a submission with inconsistent data and needs a clear path to an accepted model input.” Show the outcome through working interactions:

| Moment | Demonstrable evidence | NEXT components to apply | Message the presenter can support |
| --- | --- | --- | --- |
| Orient | Queue identifies the item requiring attention and a clear next action | Header, navigation, table, status tag, tooltip | The team can see what needs attention and why. |
| Diagnose | Validation summary leads to a specific issue and affected grid cell | Notification/banner, table/grid state, panel, contextual help | Feedback connects a problem to the data that needs correction. |
| Correct | Download the example, upload the corrected version, and see changed validation results | File Uploader, Stepper/Wizard, Input, Button, feedback states | The user has an understandable correction path. |
| Decide | Required errors block submission; optional warnings receive explicit guidance and confirmation | Semantic status, Dialog, primary/secondary actions | The workflow distinguishes mandatory correction from a documented review decision. |
| Close the loop | Submission progresses to a clear final state and visible activity history | Status tag, notification, activity list/panel | The user can understand what happened and what comes next. |

The current default auto-accepts after a simulated review delay. Identify that step as **simulated review** in the demonstration; it is not evidence of a real engineer's approval. Use the existing engineer-review mode for a deeper reviewer walkthrough, after confirming the supported behavior. Do not imply that the engineer dashboard queue is synchronized with the new submission store while the documented GAP-07 remains open.

Close on the visible outcome and a concrete discovery question: which validation rules, handoffs or review decisions would the buyer need to validate in a pilot? Capture those as follow-ups rather than promising integrations that the prototype does not implement.

### Use NEXT to create reusable product patterns

Implement a small, traceable product layer over the shared components:

- **Submission status:** one status tag, meaning, next action and allowed action set across queues, detail pages and activity. NEXT supplies the visual/state treatment; product logic supplies the lifecycle meaning.
- **Validation feedback:** one consistent structure for severity, issue description, affected data and correction action. Use the same semantics in banners, cells, tooltips and dialogs.
- **Submission decisions:** one dialog structure with a clear title, consequence, primary action and cancel action. Button hierarchy should make the intended next step obvious without pressuring users past warnings.
- **Import and resubmission:** one uploader/stepper pattern with selected-file metadata, progress, specific error recovery and confirmation. Keyboard and touch access are part of completion.
- **Review workspace:** consistent table density, selected-row treatment, inspection panel and activity presentation across Topology, Ratings, Profiles and MEM where their behavior genuinely overlaps.

For each pattern, record the NEXT source node, mapped code component, supported states and approved exceptions. Adapt the existing Radix components when they can express the verified NEXT specification. Use official code mappings when available; do not import a similarly named library or rebuild working interactions solely to claim adoption. Component galleries and optional Code Connect mappings can make future Lovable/Claude changes easier to review, but neither alone proves conformity.

### Prepare the demonstration as carefully as the screens

Provide a presenter-only setup/reset path. It should select a neutral scenario, restore a known starting state and let the presenter choose the quick narrative or reviewer deep dive. Keep presentation controls separate from ordinary user tasks. Reset must clear the relevant in-memory state and stored demo selections consistently; the current stores do not yet provide a verified unified reset.

Use deterministic examples: a clean submission, one with mandatory corrections, one with optional warnings and a corrected version. Make seeded activity and numbers internally consistent. Keep a tested recovery route if a file is uploaded incorrectly. Use short, readable content at shared-screen sizes, not only on the developer's laptop.

Offer audience emphasis through presenter notes and walkthrough depth:

| Audience interest | Show first | Optional depth |
| --- | --- | --- |
| Leadership | A submission moving from unresolved issues to an understandable outcome | Summarize the handoff and next pilot question. |
| Planning / operations | Issue diagnosis, correction, status and resubmission | Inspect affected rows and review history. |
| Technical / delivery | Shared lifecycle behavior, configurable identity and consistent interactions | Explain current browser-local simulation and identify production integration work separately. |

The product stays neutral in all three cases. Do not infer the buyer's workflow solely from organization size, title or industry reputation; confirm their priorities during discovery.

### Show evidence without inventing business results

If an outcome summary is useful, derive it from the demonstrated session: issues identified, required fixes resolved, warnings retained, versions reviewed and current submission state. Label counts from seeded data as demo examples. Do not present claims such as hours saved, error-rate reductions, regulatory compliance, production security or integration readiness as measured results without evidence.

A valuable pitch outcome is a buyer agreeing that the workflow addresses a real problem and identifying the scope and success criteria of a pilot. Track those sales observations separately from product completion. A visually successful demo is not proof of business impact.

### Suggested implementation order and completion checks

These are proposed delivery steps, with owners and dates unassigned:

1. **PITCH-01 — Establish the neutral baseline.** Select the neutral default, generalize the scenario catalog and remove client-specific artifacts from the demo path. A fresh browser and an intentionally reset browser must show the same neutral experience.
2. **PITCH-02 — Define the NEXT product patterns.** Complete the source-node/component/state matrix and semantic-token policy, then fix DS-01–DS-05 in the walkthrough path before expanding across every secondary screen. Keep existing workflow capabilities intact.
3. **PITCH-03 — Configure the scenario and presenter setup.** Separate identity from scenario content; add an explicit, reliable reset and role-depth selection. Verify URL/build/stored-preference behavior, including DS-06.
4. **PITCH-04 — Rehearse the complete value story.** Exercise diagnosis, correction, optional-warning decision, submission and simulated closure. Verify the reviewer branch only for the connected features. No unexplained dead ends or success toasts that hide an incomplete action.
5. **PITCH-05 — Validate presentation quality.** Compare the chosen NEXT states with rendered screens, then test narrow and wide layouts, keyboard focus, touch, long neutral organization names and shared-screen readability. Verify one permitted accent change reaches all intended controls without editing feature components.
6. **PITCH-06 — Prepare the pilot conversation.** Supply a short presenter guide with the opening problem, demonstrated evidence, honest prototype limits and follow-up questions. Record buyer-specific requests for later assessment instead of modifying the neutral core during the pitch.

Readiness means the same neutral core can tell a coherent story, survive an incorrect input, be reset and replayed, and support a relevant follow-up discussion. Record actual rehearsal results and defects in TRACKER.md; do not mark these proposals implemented because they have been documented here.
