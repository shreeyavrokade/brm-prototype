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
