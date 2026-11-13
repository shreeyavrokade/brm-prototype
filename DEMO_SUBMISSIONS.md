# Demo submission files: Topology Changeset

`{client}` is the active brand's short name (default `neutral` preset: "Grid Operator").

Sample `.prj` files for walking stakeholders through the submission flow. They're in [`public/sample-submissions/`](./public/sample-submissions/), and you can download them inside the app from **Import Submission → Upload File → Demo sample files**.

> Everything here is **simulated in the browser**. The `.prj` format is a simplified demo format (not PSS/E), validation rules are illustrative, and "validation" is a ~3-second timer. No file leaves the browser.

## Required vs optional fixes

| | Required fix (error) | Optional fix (warning) |
| --- | --- | --- |
| Meaning | Critical data-quality problem; blocks the workflow | Potential issue to review; may be intentional |
| Can it be accepted? | **No.** Submit is locked | **Yes.** Submit as-is and accept responsibility |
| How to resolve | Correct the source data offline → upload a new version (`_v2`, `_v3`…) → re-validated | **A:** correct it in a new version, or **B:** Submit for Review → *Submit File with Unresolved Warnings?* pop-up → **Pending Acceptance**. Engineers may still return it |

## The files

| File | Result | What the audience sees |
| --- | --- | --- |
| `527_NRE_BoswellTap_Rebuild.prj` | Passes everything | **Happy path.** Validation in Progress → **Pending Submittal** → Submit for Review → **Pending Acceptance** → **Accepted** |
| `612_CVP_Ashford_Reconductor.prj` (v1) | 4 required fixes, 3 optional fixes | **Review Needed** (red): flagged cells, **Submit locked**, "Upload Corrected Version" |
| `612_CVP_Ashford_Reconductor_v2.prj` | Required fixes corrected; 3 optional fixes left | **Review Needed** (amber): choose **Upload Corrected Version** (A) or **Submit As-Is…** (B) |
| `612_CVP_Ashford_Reconductor_v3.prj` | Optional fixes corrected too | **Pending Submittal**, the clean end of path A |
| `Ashford reconductor FINAL.prj` | Rejected at upload | **Naming convention** (spaces, no area number) |
| `612_CVP_Ashford_Reconductor.csv` | Rejected at upload | **Wrong file type**. Drag and drop it, since the picker only shows `.prj` |
| `614_CVP_Bellmont_Tap.prj` | Rejected at upload | **Malformed file**, with line numbers |

## Suggested walkthrough (about 6 minutes)

1. **Reliability Model → Topology Changeset → Import Submission.**
2. **File conventions:** drop `Ashford reconductor FINAL.prj`, `612_CVP_Ashford_Reconductor.csv` and `614_CVP_Bellmont_Tap.prj`. Each is rejected with the reason and the next step.
3. **Submit v1:** upload `612_CVP_Ashford_Reconductor.prj` → Next → pick a Project Type → Next → **Submit**. The row goes from *Validation in Progress* to *Review Needed*.
4. **Required fixes:** open the row. The red banner shows 4 required fixes and 3 optional fixes. Hover a status pill to explain it. In the issue panel, errors are marked *Required Fix* and warnings *Optional Fix*. **Submit for Review is locked**; its tooltip says to upload a corrected version.
5. **Correct and resubmit:** **Upload Corrected Version** → the dialog explains the process (download the current version, fix it offline, next version number). Drop `…_v2.prj` → **Resubmit** → *Pending Validation* → required fixes resolved; the banner turns amber with 3 optional fixes.
6. **Choose a path for the optional fixes:**
   - **A, correct them:** Upload Corrected Version → `…_v3.prj` → no fixes left → **Pending Submittal** → Submit for Review → **Pending Acceptance**.
   - **B, accept responsibility:** **Submit for {client} Review** (or Submit As-Is… in the banner) → pop-up *"Submit File with Unresolved Warnings?"*: the file passed critical error checks, engineers will evaluate the warnings and may return it → **Submit for {client} Review** → **Pending Acceptance**. Activity records which warnings were submitted unresolved.
7. **Acceptance (simulated):** after submitting, the status shows **Pending Acceptance** for ~3 seconds (same delay as validation), then moves to **Accepted** on its own. Activity records "Accepted for the model build by {client} Engineering". No engineer view needed.
   - *Optional, off by default:* manual engineer review (Return to Submitter with comments / Accept). Run with `VITE_DEMO_ENGINEER_REVIEW=true` to turn off auto-accept; the Pending Acceptance banner then shows **Demo: review as {client} engineer**.
8. To show both paths, run step 3 again to create a second submission.

Statuses also update in the Topology Changeset directory. State resets on page reload.

## Demo `.prj` format

```
PROJECT=612_CVP_Ashford_Reconductor     # must match the file name (without _vN)
AREA=612                                # must match the 3-digit prefix
EFFECTIVE_DATE=07/15/2027
DESCRIPTION=…

[BUS]
bus,name,baskv,ide,area,zone,vm,va,owner
[GENERATOR]                             # optional
busNumber,genId,pgen,qgen,pmax,pmin,mbase
[BRANCH]
fromBus,toBus,circuit,status,resistance,reactance,charging,rateA,rateB,length
```

**File naming:** `[Area #]_[OWNER]_[Description].prj`, with no spaces. Add `_v2`, `_v3`… for corrected versions.

**Validation rules (illustrative):**
- **Errors:** bus voltage < 0.95 PU · non-standard base kV · generator PGEN > PMAX or PMIN > PMAX · generator or branch connected to an undefined bus · branch status not 0/1 · Rate B < Rate A.
- **Warnings:** voltage 0.95–0.97 PU or > 1.05 PU · generator Q > 30% of MBASE · branch R/X > 0.12.

## Where it lives in code

| Piece | File |
| --- | --- |
| Parser, naming and format checks, validation rules | `src/lib/topologyPrj.ts` |
| Stored files + simulated validation and acceptance timers (`AUTO_ACCEPT_ON_SUBMIT`) | `src/store/topologySubmissionStore.ts` |
| Upload step, error card, sample file list | `src/pages/ImportSubmission.tsx`, `src/components/import/UploadErrorCard.tsx`, `src/components/import/DemoSampleFiles.tsx` |
| Detail page: banners, resubmission, submit, submit as-is | `src/pages/SubmissionDetail.tsx`, `src/components/submission/ValidationSummaryBanner.tsx`, `ResubmitDialog.tsx`, `SubmitWithWarningsDialog.tsx`, `src/components/spp/ReturnSubmissionModal.tsx`, `src/components/dashboard/Header.tsx` |
| Tests for every sample file | `src/test/topologyPrj.test.ts` |

To add a scenario, drop a new `.prj` into `public/sample-submissions/`, list it in `DemoSampleFiles.tsx`, and add a test case.
