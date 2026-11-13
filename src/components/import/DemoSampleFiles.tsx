import { Download, FlaskConical } from "lucide-react";

/** Sample files served from `public/sample-submissions/` for the sales demo. */
const TOPOLOGY_SAMPLES: { file: string; outcome: string; tone: "pass" | "fix" | "reject" }[] = [
  { file: "527_NRE_BoswellTap_Rebuild.prj", outcome: "Happy path — passes validation, ready to submit", tone: "pass" },
  { file: "612_CVP_Ashford_Reconductor.prj", outcome: "v1 — Review Needed: 4 required fixes, 3 optional fixes", tone: "fix" },
  { file: "612_CVP_Ashford_Reconductor_v2.prj", outcome: "v2 — required fixes corrected; 3 optional fixes: fix (v3) or submit as-is", tone: "fix" },
  { file: "612_CVP_Ashford_Reconductor_v3.prj", outcome: "v3 — optional fixes corrected too; ready to submit", tone: "pass" },
  { file: "Ashford reconductor FINAL.prj", outcome: "Rejected — breaks the naming convention", tone: "reject" },
  { file: "612_CVP_Ashford_Reconductor.csv", outcome: "Rejected — wrong file type (drag & drop it)", tone: "reject" },
  { file: "614_CVP_Bellmont_Tap.prj", outcome: "Rejected — malformed file structure", tone: "reject" },
];

const TONE: Record<"pass" | "fix" | "reject", string> = {
  pass: "bg-[#DEEDE2] text-[#146C2E]",
  fix: "bg-[#FCF2D9] text-[#6D4D09]",
  reject: "bg-[#FBE5E8] text-[#C82333]",
};
const TONE_LABEL = { pass: "Pass", fix: "Fix", reject: "Reject" } as const;

const sampleUrl = (file: string) => `${import.meta.env.BASE_URL}sample-submissions/${encodeURIComponent(file)}`;

const DemoSampleFiles = () => (
  <details className="mt-6 bg-atmo-0 border border-dashed border-atmo-5 rounded-md group">
    <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-foreground flex items-center gap-2 list-none">
      <FlaskConical className="h-4 w-4 text-atmo-9" />
      Demo sample files
      <span className="ml-1 text-xs font-normal text-muted-foreground">Simulated data for walkthroughs — download, then upload above</span>
    </summary>
    <ul className="px-4 pb-4 space-y-1.5">
      {TOPOLOGY_SAMPLES.map((s) => (
        <li key={s.file} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${TONE[s.tone]}`}>{TONE_LABEL[s.tone]}</span>
          <a
            href={sampleUrl(s.file)}
            download={s.file}
            className="inline-flex items-center gap-1 font-mono text-xs text-[#2064B4] hover:underline"
          >
            <Download className="h-3 w-3" />
            {s.file}
          </a>
          <span className="text-atmo-9 text-xs">{s.outcome}</span>
        </li>
      ))}
    </ul>
  </details>
);

export default DemoSampleFiles;
