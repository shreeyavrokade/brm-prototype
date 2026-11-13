# GitHub Pages readiness audit

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
