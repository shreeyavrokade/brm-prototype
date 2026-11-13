# GitHub Pages deployment

The optional Pages build uses hash routing and repository-relative assets. The normal Lovable/Vite build keeps browser routing and its existing root base.

## Build locally

```sh
npm run build:pages
```

Output: `dist-pages/` (ignored by Git). Default site path: `/brm-prototype/`, configured in `.env.github-pages`. Standard `npm run build` still writes `dist/`.

To target a different repository, override the base:

```sh
VITE_BASE_PATH=/another-repository/ npm run build:pages
```

For an account site or custom domain:

```sh
VITE_BASE_PATH=/ npm run build:pages
```

Pages URLs use a hash: `https://shreeyavrokade.github.io/brm-prototype/#/market-economic`. Keep brand selection before the hash: `/brm-prototype/?brand=neutral#/market-economic`. Route-specific query strings remain after the hash, e.g. `#/market-economic?track=load`.

Use hash links when sharing Pages screens. Clean path links such as `/brm-prototype/market-economic` are not supported by this configuration. No 404 redirect workaround is required for hash routes.

## Deploy when ready

1. Commit and push the intended project files, including `.env.github-pages`, this configuration, and `.github/workflows/github-pages.yml`. The manual workflow must exist on the repository default branch to appear in Actions.
2. Verify the repository/account supports Pages. In Settings → Pages, select **GitHub Actions** as the source. For a custom domain, configure it there before running the workflow.
3. Open Actions → **Deploy to GitHub Pages (manual)** → **Run workflow** and select the intended branch.
4. The workflow installs locked dependencies with `npm ci`, checks both TypeScript projects, runs tests, builds using the base path returned by `actions/configure-pages`, uploads `dist-pages/`, and deploys to the `github-pages` environment.
5. Verify the reported live URL, direct hash links, refresh, navigation, assets, sample-file downloads, brand selection, and participant/engineer workflows.

There is no push trigger, so committing or pushing these changes does not automatically deploy. This task has not enabled repository Pages settings or run a deployment.

Existing repository-wide ESLint errors remain tracked separately; lint is not included as a deployment gate yet. The existing large-bundle warning is also unchanged. The browser demo gate and browser-local state retain their documented prototype limitations.

Reference: [Vite Pages deployment guidance](https://vite.dev/guide/static-deploy#github-pages).
