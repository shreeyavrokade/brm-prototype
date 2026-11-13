# GitHub Pages readiness audit

## Final pre-deployment review — 2026-11-13

**Decision: suitable for GitHub Pages as an interactive browser-local prototype; hold deployment until the dependency lockfile is synchronized.** This review covers commit `676bd4f` plus the current sidebar edit. Audit/documentation only; no dependencies, app code, GitHub settings or deployment were changed.

| Gate | Final evidence |
| --- | --- |
| Deployment install | **Fail.** `npm ci --dry-run --ignore-scripts --no-audit --no-fund` exits 1, EUSAGE: package-lock.json is missing @fontsource/inter, @phosphor-icons/react and peer/transitive dependencies. GAP-HOST-03 remains open. The workflow would fail before building. |
| Builds | `npm run build:pages` and `npm run build` pass. Pages artifact 1,305,987 bytes; entry JS/CSS/favicon exist under /brm-prototype/. JS approximately 943 kB / 276 kB gzip; nonblocking chunk-size warning. |
| Tests and types | 20/20 tests pass across seven files, including brand selection, validation, warning submission, engineer return and auto-accept guards. Both TypeScript projects pass --noEmit. |
| Lint | 33 errors and 11 warnings remain. Not currently part of the deployment workflow. |
| Browser interaction proof | Chromium on a plain static server mounted at /brm-prototype/: neutral-preset access gate, v1 .prj upload, project-type selection, submit, simulated validation, detail/issue display and disabled submission with 4 required fixes; corrected v2 upload and revalidation; optional-warning confirmation; simulated acceptance. Final banner explicitly retains 3 accepted warnings. |
| Static-host navigation | Direct hash entry and refresh on MEM Generation pass; unknown-route home recovery stays inside the repository path. |
| Design readiness | Neutral default now exists; current brand configuration uses session-scoped selection. Full NEXT component adoption, generalized demo data and audience-specific scenario preparation remain design/sales follow-ups, not static-host prerequisites. Do not treat successful hosting as design sign-off. |
| Remote hosting | Repository Pages source, account eligibility, workflow execution, actual deployment URL and live-host regression checks not verified or changed. |

The browser script initially waited for a different acceptance phrase; inspecting the actual state and explicitly asserting “Dataset Accepted” and the retained-warning banner confirmed success. No application change was needed.

### Release requirements

1. Synchronize package-lock.json against the intended package.json, commit it, and validate an actual clean install plus tests/types/Pages build. A local build with existing node_modules is not a substitute.
2. Include the intended sidebar and other application edits in the release commit. Keep unrelated in-progress design documents separate if desired.
3. Select GitHub Actions in Settings → Pages, then run the existing manual workflow for the intended revision when ready to publish. Verify the resulting live URL and the neutral demo path.
4. Keep HOST-03 open until remote deployment and live checks pass. No full-module regression or production-readiness claim is made by this audit.

### Continuing development after hosting

Future UI, branding, sample-data and browser-side interaction changes can use the same hosting approach. Edit locally → test/type-check → build:pages → commit and push → run the manual Pages workflow → verify the published URL. The workflow has no push trigger: local edits and pushes alone do not update the hosted site. A successful new deployment replaces the published artifact; a failed install/build does not publish that new revision.

Treat each release as a checked snapshot, not a guarantee that any edit will work. Preserve hash routing, deployment-base-aware asset paths, dependency-lock consistency and static/browser-compatible features. Build-time VITE settings require rebuilding. Long-open tabs may need a refresh after a deployment; do not rely on in-memory demo sessions surviving reload or redeployment. Existing browser storage follows its documented scope and should be included in replay/reset checks.

GitHub Pages does not add server authentication, shared databases, persistent upload processing or external workflow integrations. If future requirements add those capabilities, the static frontend will need separate services and another hosting/security assessment.


## Latest re-audit — 2026-11-13

**Verdict: the edited interactive app remains suitable for static Pages hosting, but the current deployment workflow is blocked by an out-of-sync npm lockfile.**

Scope: commit `44220a9` plus ongoing working-tree edits. Submission-dialog and engineer-return edits arrived during the audit, so the Pages build, tests, and TypeScript checks were repeated. No application, dependency, or deployment configuration was changed by this audit.

| Area | Current result |
| --- | --- |
| Clean CI install | **BLOCKER:** `npm ci --dry-run --ignore-scripts --no-audit --no-fund` exits 1 (EUSAGE). Lockfile lacks `@fontsource/inter`, `@phosphor-icons/react`, and required peer/transitive packages including `@testing-library/dom`. The existing Actions workflow uses `npm ci` and would stop here. Local node_modules masks this mismatch. |
| Pages build | Pass on latest edits: `npm run build:pages`; correct `/brm-prototype/` entry asset paths and hash router. Latest JS about 945 kB (276 kB gzip); chunk-size warning remains nonblocking. |
| Normal build | Pass earlier in this audit; Pages output remains isolated in dist-pages/. |
| Tests | Final rerun: 13/13 pass across five files, including updated warning-submission and engineer-return tests. One test remains a placeholder. |
| TypeScript | Both app and node configurations pass with --noEmit on final rerun. |
| ESLint | Fails: 33 errors, 11 warnings. Workflow currently does not gate on lint. |
| Static-server browser checks | Chromium under `/brm-prototype/`: deep entry, refresh, back/forward, home recovery, topology and transaction import screens, MEM Load and Load Review, and seeded submission detail render. All five brand presets load and decode their header logos; corrected sample download HTTP 200. No failed resources or uncaught exceptions in the route/brand smoke check. |
| Brand assets | All ten configured logo/favicon paths exist in the generated Pages artifact, including the new ERCOT preset. |
| Workflow | Tracked workflow YAML parses and has only workflow_dispatch; base path comes from configure-pages and the deploy job has Pages/OIDC permissions. Remote execution and repository settings remain unverified. |

### Required before deployment

1. Synchronize and commit package-lock.json with the intended package.json dependencies. Re-run a clean `npm ci`, tests, TypeScript, and the Pages build in a clean environment. This audit only ran the non-mutating install preflight and did not repair dependencies.
2. Enable/verify the GitHub Pages publishing source and run the manual workflow when deployment is authorized, then smoke-test the live URL. No deployment or GitHub settings changes were performed.

Existing limitations remain: the demo password is browser-side, state is local/in-memory, and uploads/validation are simulated. These are compatible with static hosting but provide no production authentication, shared persistence, or server processing. Full end-to-end user acceptance, new dialog click-throughs, and live-host behavior were not certified. The old Lovable social-preview image remains in index.html; it affects sharing/branding, not runtime hosting.

The sections below preserve the historical audit and configuration evidence.


Date: 2026-11-13. Scope: current local working tree, including existing uncommitted white-label work. No deployment or application/configuration changes were made.

**Follow-up (2026-11-13):** Configuration fixes are now implemented; see [GITHUB_PAGES.md](./GITHUB_PAGES.md). Findings below preserve the original audit snapshot. Live deployment remains unverified.

**Original verdict: technically compatible, but not ready to deploy unchanged at the default project URL.**

The app builds into static HTML/CSS/JS and uses browser-side demo stores. No production backend dependency was found in the inspected application sources. Based on the configured origin, the expected default project URL would be `https://shreeyavrokade.github.io/brm-prototype/`; repository Pages settings, visibility, plan eligibility, and any existing remote deployment were not inspected.

| Finding | Evidence | Required action |
| --- | --- | --- |
| Project asset base is incorrect for the expected repository URL. | `vite.config.ts` has no `base`; built `dist/index.html` requests `/assets/index-exq7Cuja.js` and `/assets/index-DGZQPVib.css`. | Set the Pages build base to `/brm-prototype/`. Keep `/` for a root/custom-domain deployment. |
| Routing does not accommodate project hosting or direct route requests. | `src/App.tsx` uses BrowserRouter without basename. Build emits only index.html, no nested-route HTML or 404.html. | Prefer HashRouter for this static demo, producing `/brm-prototype/#/market-economic`. Alternatively configure BrowserRouter basename and a tested Pages 404 redirect/fallback; basename alone does not solve refresh/deep-link 404s. |
| Home recovery escapes the project path. | `src/pages/NotFound.tsx` uses `<a href="/">`. | Replace with a router Link to `/`, compatible with the chosen router. |
| No repository deployment workflow is present locally. | `.github/` does not exist. | Add a workflow to install locked dependencies, build, upload dist, and deploy with the required Pages permissions; enable the publishing source in repository settings. Raw source is not the deployable artifact. |
| Demo gate is not access control. | `PasswordGate.tsx` compares against a value supplied by browser-bundled brand configuration; children render under the gate. | Suitable only for the documented mock-data demonstration. Hosting does not turn this into authentication or durable shared storage. |
| Existing lint failures limit quality-gate readiness. | ESLint reports 33 errors and 10 warnings. | Resolve before requiring lint in a deployment gate. They do not prevent the current Vite build. |
| Runtime behavior still needs hosting verification. | No browser or live Pages test was performed in this audit. | After configuring hosting, test initial entry, direct links, refresh, back/forward, unknown-route recovery, brand selection, assets, and participant/engineer workflows. |

## Checks performed

| Check | Result |
| --- | --- |
| `npm run build` | Pass. Static dist artifact: 1,259,510 bytes. JS bundle about 909 kB uncompressed; Vite emits a chunk-size warning, not a hosting blocker. |
| `npm test` | Pass: one placeholder assertion; does not establish workflow coverage. |
| `npm run lint` | Fail: 33 errors, 10 warnings. |
| `./node_modules/.bin/tsc -p tsconfig.app.json --noEmit` | Pass. |
| `./node_modules/.bin/tsc -p tsconfig.node.json --noEmit` | Pass. |
| Build asset and route inspection | Root-relative assets confirmed; no nested HTML or 404 fallback; no local Pages workflow. |
| GitHub settings / live hosting / browser flows | Not checked. |

## Recommended implementation

1. Add a deployment-specific Vite base and static-host-compatible router so existing Lovable hosting can retain its routing if needed.
2. Replace root-level native home navigation with router navigation. If using hash routing, keep brand selection before the hash (`/brm-prototype/?brand=neutral#/market-economic`), because brand configuration reads `window.location.search`.
3. Add a Pages Actions workflow that publishes dist; verify repository eligibility and settings.
4. Smoke-test the built artifact under `/brm-prototype/` on a plain static host, then verify the live Pages URL after deployment.

Client-side interactions, selected localStorage persistence, and simulated uploads can run on Pages. In-memory state still resets on reload and does not synchronize between users. This audit does not establish production readiness.

## Documentation consulted

- [Vite: GitHub Pages deployment](https://vite.dev/guide/static-deploy#github-pages) — repository base path and build/deployment workflow.
- [GitHub: What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) — static hosting, default project URL, repository eligibility.
- [React Router 6.30.1: HashRouter](https://reactrouter.com/6.30.1/router-components/hash-router) — hash location is not sent to the server.
- [GitHub: Custom 404 pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site) — handling nonexistent static paths.

## Configuration follow-up verification

2026-11-13: implemented HOST-02 and the workflow portion of HOST-03. Normal and Pages builds pass; all 8 current tests pass; both TypeScript projects and ESLint on changed TypeScript files pass. Workflow YAML parses. Chromium verified the isolated `dist-pages/` artifact on a plain static server mounted at `/brm-prototype/`: direct MEM hash link, reload, back/forward, unknown-route recovery, sample download, logo, and favicon. Expected app 404 logging occurs for the unknown route. Repository activation, remote workflow execution, and full hosted business-workflow regression remain pending.
