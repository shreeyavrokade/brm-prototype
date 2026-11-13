# Unified Submission Portal: interactive prototype

A clickable sales prototype of the data-submitter experience: upload a topology file, see validation results, correct and resubmit, then submit for review. Everything runs in the browser with mock data. Nothing is sent anywhere, and a page reload resets the demo.

## Presenter guide

### 1. Before you present (2 min)

```sh
npm install
npm run dev            # opens on http://localhost:8080
```

- **Password:** `SPP2026`
- **Branding:** neutral by default ("Regional Grid Operator"). To show a client preset, add `?brand=acme` (or `placeholder`, `ercot`) to the URL. Details are in [WHITE_LABEL.md](./WHITE_LABEL.md).
- **Fresh start:** reload the page before every run. Use a full-screen browser window at 1440×900 or larger.

### 2. The test files

The test files are in [`public/sample-submissions/`](./public/sample-submissions/). You can also download them inside the app: **Import Submission → Upload File → Demo sample files**. Download them to your desktop before you start.

| File | Use it to show |
| --- | --- |
| `612_CVP_Ashford_Reconductor.prj` | **v1:** 4 required fixes + 3 optional fixes. Submit is blocked |
| `612_CVP_Ashford_Reconductor_v2.prj` | **v2:** required fixes resolved, 3 optional fixes left |
| `612_CVP_Ashford_Reconductor_v3.prj` | **v3:** clean, ready to submit |
| `527_NRE_BoswellTap_Rebuild.prj` | Short happy path: passes on the first upload |
| `Ashford reconductor FINAL.prj` | Rejected at upload: naming convention |
| `612_CVP_Ashford_Reconductor.csv` | Rejected at upload: wrong file type (drag and drop it) |
| `614_CVP_Bellmont_Tap.prj` | Rejected at upload: malformed file, with line numbers |

**Rule of thumb:** use v1 → v2 → v3 for the main story. Use the three rejected files only if the audience asks about file checks.

### 3. Main walkthrough (about 5 minutes)

| # | Do this | What the audience sees | Say this |
| --- | --- | --- | --- |
| 1 | **Base Reliability Model → Topology Changeset** | Submission list with live statuses | "Every submission and its status in one place." |
| 2 | **Import Submission** → drop **v1** → **Next** → choose a **Project Type** → **Next** → **Submit** | Status goes *Validation in Progress* → *Review Needed* after ~3 s, with a red toast | "Validation runs automatically and tells you what to do next." |
| 3 | Open **612_CVP_Ashford_Reconductor** | Flagged cells, tab badges, Issue Resolution panel (**Required Fix** / **Optional Fix**), **Submit locked** | "Required fixes must be corrected. Optional fixes are the submitter's call." Hover a status tag to show its explanation. |
| 4 | Click a fix card in the panel | The affected row and cell are highlighted in the grid | "Feedback points straight to the data." |
| 5 | **Upload New Version** (header) → drop **v2** → **Resubmit for validation** | *Pending Validation* → yellow toast: required fixes resolved, 3 optional left. **Submit unlocks** | "Correct offline, upload the next version, and it's re-checked against the same rules." |
| 6 | Choose an ending, **A** or **B** (below) | | |

**A: clean ending.** **Upload New Version** → **v3** → no fixes left → **Submit for … Review** → *Pending Acceptance* → *Accepted* after ~3 s.

**B: submit with warnings.** **Submit for … Review** on v2 → pop-up *"Submit File with Unresolved Warnings?"* → **Submit for … Review** → *Pending Acceptance* → *Accepted* after ~3 s.

Close with the **Activity** icon (speech bubble, header). It shows every upload, validation result and submission in order. "Full audit trail."

### 4. Tips

- **Timings are simulated.** Validation and acceptance each take ~3 seconds, so pause and let the status change happen on screen.
- **Acceptance is simulated.** There's no engineer step by default. To show an engineer accepting or returning a file with comments, start the app with `VITE_DEMO_ENGINEER_REVIEW=true npm run dev`.
- **To run both endings,** do step 2 again: each upload creates a new submission.
- **If something goes wrong,** reload. Uploaded submissions and statuses reset.
- **Wrong version in the dialog?** The resubmit dialog only accepts the next version of the same project (e.g. `_v2` after v1). That's a feature; you can show it.
- **Keep it honest:** the validation rules and file format are illustrative, and there's no back-end.

More detail (file format, rules, extra paths) is in [DEMO_SUBMISSIONS.md](./DEMO_SUBMISSIONS.md).

---

## Developer notes (Lovable project)

### Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

### How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

### What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

### Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

### Optional GitHub Pages hosting

See [GITHUB_PAGES.md](./GITHUB_PAGES.md) for the separate Pages build and manual deployment workflow. Run `npm run build:pages` to create `dist-pages/`; regular builds remain unchanged.
