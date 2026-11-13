import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CalendarIcon, ChevronRight, FileText, Upload, X } from "lucide-react";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import Stepper from "@/components/import/Stepper";
import FileDropzone from "@/components/import/FileDropzone";
import UploadedFileRow, { type UploadedFile } from "@/components/import/UploadedFileRow";
import UploadErrorCard from "@/components/import/UploadErrorCard";
import CommentsThread, { type CommentItem } from "@/components/import/CommentsThread";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { addRow, nextChangesetId } from "@/store/changesetStore";
import type { ReviewStatus } from "@/components/topology/mockChangeset";
import { brand } from "@/config/brand";
import DemoSampleFiles from "@/components/import/DemoSampleFiles";
import { NAMING_EXAMPLE, NAMING_RULE, countIssues, parsePrj, type FatalProblem, type ParsedPrj } from "@/lib/topologyPrj";
import { storeTopologyFile, statusForIssues } from "@/store/topologySubmissionStore";

const STEPS = ["Upload File", "Review Submission Details", "Supporting Information"];

const CURRENT_USER = "Eddie Lake";

type ProjectType =
  | "Modeling Correction"
  | "Approved Transmission System Upgrade"
  | "Planned Transmission System Upgrade"
  | "Speculative"
  | "Requested"
  | "Acknowledged"
  | "Generation Interconnection"
  | "Attachment AQ"
  | "System Intact Alteration"
  | "Network Status";

const projectTypes: { value: ProjectType; description: string }[] = [
  { value: "Modeling Correction", description: "Changes to correct or update existing representation. Added upon review and approval by " + brand.clientShortName + "." },
  { value: "Approved Transmission System Upgrade", description: "Materially modifies the " + brand.clientShortName + " system with a corresponding Project ID, NTC, or SUS number. Must use correct naming format rules." },
  { value: "Planned Transmission System Upgrade", description: "Planned changes not part of an NTC, SUS, GI, AQ, or internal " + brand.clientShortName + " study." },
  { value: "Speculative", description: "Forecasted, unbudgeted changes; excluded from CPP model sets." },
  { value: "Requested", description: "Pending " + brand.clientShortName + " review and not yet committed into models." },
  { value: "Acknowledged", description: "Reviewed by " + brand.clientShortName + " and flagged for inclusion into the models." },
  { value: "Generation Interconnection", description: "Generation/transmission adjustments with an executed Generation Interconnection Agreement." },
  { value: "Attachment AQ", description: "Load and transmission alterations tied to an approved Attachment AQ load modification." },
  { value: "System Intact Alteration", description: "Corrects base case setpoints of existing topology (voltage/thermal criteria violations). Equipment must already exist in the network database." },
  { value: "Network Status", description: "Places applicable, pre-existing equipment in or out-of-service." },
];

const requiredDocs: Partial<Record<ProjectType, string[]>> = {
  "Modeling Correction": [
    "Proof of coordination for corrections modifying tie lines owned or partially owned by an entity outside the " + brand.clientShortName + " footprint.",
  ],
  "Approved Transmission System Upgrade": [
    "Corresponding NTC/SUS/etc. document.",
    "Proof of coordination for modified tie lines with entities outside the " + brand.clientShortName + " footprint.",
  ],
  "Planned Transmission System Upgrade": [
    "TOP Project Evaluation Process Request form (to move from Requested to Acknowledged).",
    "Proof of coordination for modified tie lines with entities outside the " + brand.clientShortName + " footprint.",
  ],
  "Generation Interconnection": [
    "Signed Generation Interconnection Agreement.",
    "Proof of coordination for modified tie lines with entities outside the " + brand.clientShortName + " footprint.",
  ],
  "Attachment AQ": [
    "Associated Load Interconnection Study.",
    "Proof of coordination for modified tie lines with entities outside the " + brand.clientShortName + " footprint.",
  ],
};

const seedComments: CommentItem[] = [];

type SubmissionKind = "topology" | "ratings" | "profiles";

const KIND_CONFIG: Record<SubmissionKind, {
  breadcrumb: string;
  accept: string;
  acceptExts: string[];
  returnTo: string;
  nameLabel: string;
  hint: string;
}> = {
  topology: {
    breadcrumb: "Topology Changeset",
    accept: ".prj",
    acceptExts: [".prj"],
    returnTo: "/?tab=topology",
    nameLabel: "Project Name",
    hint: "Max. file size 10MB (.prj)",
  },
  ratings: {
    breadcrumb: "Ratings",
    accept: ".csv",
    acceptExts: [".csv"],
    returnTo: "/?tab=ratings",
    nameLabel: "Rating Set Name",
    hint: "Max. file size 10MB (.csv) — Season, LTE, Norm, STE, LD columns",
  },
  profiles: {
    breadcrumb: "Profiles",
    accept: ".csv,.xlsx",
    acceptExts: [".csv", ".xlsx"],
    returnTo: "/?tab=profiles",
    nameLabel: "Submission Name",
    hint: "Max. file size 10MB (.csv, .xlsx)",
  },
};

const ImportSubmission = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const kindParam = (searchParams.get("kind") ?? "topology") as SubmissionKind;
  const kind: SubmissionKind = (["topology", "ratings", "profiles"] as const).includes(kindParam) ? kindParam : "topology";
  const config = KIND_CONFIG[kind];
  const isTopology = kind === "topology";
  const isProfiles = kind === "profiles";

  const [step, setStep] = useState(0);
  const [primaryFile, setPrimaryFile] = useState<UploadedFile | null>(null);
  const [uploadError, setUploadError] = useState<FatalProblem | null>(null);
  const [parsedPrj, setParsedPrj] = useState<ParsedPrj | null>(null);
  const [supportingFiles, setSupportingFiles] = useState<UploadedFile[]>([]);
  const [comments, setComments] = useState<CommentItem[]>(seedComments);

  // Form state
  const parsedProjectName = useMemo(
    () => parsedPrj?.projectName ?? primaryFile?.name.replace(/\.[^.]+$/, "") ?? "",
    [primaryFile, parsedPrj]
  );
  const submitterName = CURRENT_USER;
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [effectiveDate, setEffectiveDate] = useState<Date | undefined>();
  const [profileType, setProfileType] = useState<"load_gen" | "device_control" | "">("");
  const [studyTypes, setStudyTypes] = useState<Set<"mdag" | "itp">>(new Set());
  const [baseProfileName, setBaseProfileName] = useState<string>("");

  const toggleStudy = (v: "mdag" | "itp") =>
    setStudyTypes((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v); else next.add(v);
      return next;
    });

  // Default effective date when entering step 2
  useEffect(() => {
    if (step === 1 && !effectiveDate) {
      setEffectiveDate(new Date("2025-09-08"));
    }
  }, [step, effectiveDate]);

  const handleNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));

  const handleAddPrimaryFile = async (files: File[]) => {
    const f = files[0];
    const lower = f.name.toLowerCase();
    setParsedPrj(null);
    if (isTopology) {
      // Simulated intake checks: file type, naming convention, structure.
      const result = parsePrj(f.name, await f.text());
      if (!result.ok) {
        setUploadError(result.problem);
        setPrimaryFile(null);
        return;
      }
      setParsedPrj(result.parsed);
      setEffectiveDate(new Date(result.parsed.effectiveDate));
    } else if (!config.acceptExts.some((ext) => lower.endsWith(ext))) {
      setUploadError({
        kind: "file-type",
        title: "Unsupported file type",
        messages: [`"${f.name}" can't be imported here. Accepted: ${config.acceptExts.join(", ")}.`],
      });
      setPrimaryFile(null);
      return;
    }
    setUploadError(null);
    setPrimaryFile({
      id: crypto.randomUUID(),
      name: f.name,
      sizeKb: Math.max(1, Math.round(f.size / 1024)),
    });
  };

  const handleAddSupportingFiles = (files: File[]) => {
    const mapped: UploadedFile[] = files.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      sizeKb: Math.max(1, Math.round(f.size / 1024)),
    }));
    setSupportingFiles((prev) => [...prev, ...mapped]);
  };

  const handleAddComment = (text: string) => {
    setComments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        author: CURRENT_USER,
        body: text,
        date: format(new Date(), "dd/MM/yyyy"),
      },
    ]);
  };

  const handleCancel = () => navigate(config.returnTo);

  const createRow = (status: ReviewStatus) => {
    const name = parsedProjectName.trim() || "Untitled Submission";
    if (isTopology) {
      const id = nextChangesetId();
      addRow({
        id,
        projectName: name,
        reviewStatus: status,
        type: projectType || "Modeling Correction",
        subtype: "Network",
        submitter: submitterName,
        submissionDate: format(new Date(), "d MMM yyyy"),
        submissionTimestamp: Date.now(),
      });
      if (parsedPrj) {
        storeTopologyFile(id, parsedPrj, {
          validate: status !== "Draft",
          onDone: (p) => {
            const { errors, warnings } = countIssues(p.issues);
            const result = statusForIssues(p);
            if (result === "Review Needed") {
              if (errors > 0) toast.error(`${name}: Review Needed — ${errors} required fix${errors !== 1 ? "es" : ""}, ${warnings} optional fix${warnings !== 1 ? "es" : ""}.`, { description: "Open it to see the flagged cells, then upload a corrected version.", duration: 8000 });
              else toast.warning(`${name}: ${warnings} optional fix${warnings !== 1 ? "es" : ""} to review.`, { description: "Correct them in a new version, or submit as-is.", duration: 8000 });
            } else {
              toast.success(`${name} passed validation — ready for submittal.`);
            }
          },
        });
      }
    }
    return name;
  };

  const handleSaveDraft = () => {
    const name = createRow("Draft");
    toast.success(`Submission ${name} saved as Draft.`);
    navigate(config.returnTo);
  };

  const handleSubmit = () => {
    const name = createRow("Validation in Progress");
    toast.success(`Submission ${name} sent — Validation in Progress. Results appear in a few seconds (simulated).`);
    navigate(config.returnTo);
  };

  const canAdvanceStep1 = !!primaryFile;
  const canAdvanceStep2 = isTopology
    ? !!projectType
    : isProfiles
      ? !!profileType && studyTypes.size > 0 && !!baseProfileName
      : true;
  const docsForType = isTopology && projectType ? requiredDocs[projectType as ProjectType] : undefined;

  return (
    <SidebarProvider className="h-svh min-h-0 overflow-hidden">
      {/* Viewport-height layout: header, sub-header and footer stay put; only <main> scrolls if needed. */}
      <div className="h-full min-h-0 flex flex-col bg-atmo-1 w-full">
        <GlobalHeader />

        {/* Sub-header: breadcrumb + close */}
        <div className="bg-atmo-0 border-b border-atmo-3 px-6 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">{config.breadcrumb}</span>
            <ChevronRight className="h-3.5 w-3.5 text-atmo-7" />
            <span className="text-atmo-9">Import Submission</span>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            aria-label="Close"
            className="h-8 w-8 text-atmo-9"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <main className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
          <Stepper steps={STEPS} current={step} />

          <div className="max-w-3xl mx-auto mt-6">
            {step === 0 && (
              <section>
                <h1 className="text-2xl font-semibold text-foreground mb-2">Upload File</h1>
                {kind === "ratings" && (
                  <div className="mb-6">
                    <p className="text-sm text-atmo-10">
                      All submission names must be unique and formatted as follows:
                    </p>
                    <div className="mt-3 text-base font-semibold text-foreground">
                      [Owner/Area Number] [Rating Description]
                    </div>
                    <div className="text-sm text-atmo-10 mt-1">"548_Rating_Update"</div>
                  </div>
                )}
                {kind === "profiles" && (
                  <div className="mb-6">
                    <p className="text-sm text-atmo-10">
                      All submission names must be unique and formatted as follows:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                      <div>
                        <p className="text-sm text-atmo-10">
                          For <span className="font-semibold text-foreground">Load Gen</span> profile submission:
                        </p>
                        <div className="mt-1 text-base font-semibold text-foreground">
                          [Owner/Area Number] [Model Designation] _LG
                        </div>
                        <div className="text-sm text-atmo-10 mt-1">"548_2011ITP-17S_BLG"</div>
                      </div>
                      <div>
                        <p className="text-sm text-atmo-10">
                          For <span className="font-semibold text-foreground">Device Control</span> profile submission:
                        </p>
                        <div className="mt-1 text-base font-semibold text-foreground">
                          [Owner/Area Number] [Model Designation] _DC
                        </div>
                        <div className="text-sm text-atmo-10 mt-1">"548_2011ITP-17S_DC"</div>
                      </div>
                    </div>
                  </div>
                )}
                <FileDropzone
                  accept={config.accept}
                  hint={config.hint}
                  onFiles={handleAddPrimaryFile}
                />

                {uploadError && !primaryFile && (
                  <UploadErrorCard
                    title={uploadError.title}
                    messages={uploadError.messages}
                    nextStep={
                      uploadError.kind === "naming"
                        ? "Rename the file and upload it again."
                        : uploadError.kind === "file-type"
                          ? `Export the changeset as a ${config.acceptExts.join(" / ")} file and upload it again.`
                          : "Fix the lines listed above and upload the file again."
                    }
                  />
                )}
                {primaryFile && (
                  <UploadedFileRow
                    file={primaryFile}
                    onRemove={() => {
                      setPrimaryFile(null);
                      setParsedPrj(null);
                    }}
                  />
                )}
                {primaryFile && parsedPrj && (
                  <p role="status" className="mt-2 text-xs text-[#146C2E]">
                    File checks passed: naming convention, file type and structure ·{" "}
                    {Object.values(parsedPrj.phases).reduce((n, p) => n + p.rows.length, 0)} records read. Reliability
                    rules run after you submit.
                  </p>
                )}
                {isTopology && <DemoSampleFiles />}

                {isTopology && (
                <Accordion type="single" collapsible className="mt-8 bg-atmo-0 border border-atmo-3 rounded-md">
                  <AccordionItem value="guidelines" className="border-0">
                    <AccordionTrigger className="px-4 text-sm font-medium text-primary-200 hover:no-underline">
                      View File Naming Convention Guidelines by Project Type
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4 text-sm text-atmo-10">
                        <div>
                          <div className="font-semibold text-primary-200 mb-1">All topology files</div>
                          <p className="text-atmo-9">
                            {NAMING_RULE} — no spaces. Add _v2, _v3… when uploading a corrected version.
                          </p>
                          <p className="mt-1 font-mono text-xs text-atmo-10 bg-atmo-2 inline-block px-2 py-0.5 rounded">
                            {NAMING_EXAMPLE}
                          </p>
                        </div>
                        <div>
                          <div className="font-semibold text-primary-200 mb-1">Approved Transmission System Upgrade</div>
                          <p className="text-atmo-9">
                            Must contain area/owner/zone number, area/owner/zone abbreviated name, and an NTC/PID/UID number.
                          </p>
                          <p className="mt-1 font-mono text-xs text-atmo-10 bg-atmo-2 inline-block px-2 py-0.5 rounded">
                            -659_Patent_Gate_NTC300.prj
                          </p>
                        </div>
                        <div>
                          <div className="font-semibold text-primary-200 mb-1">Generation Interconnection</div>
                          <p className="text-atmo-9">
                            Must contain area/owner/zone number, area/owner/zone abbreviated name, and an NTC/PID/UID number.
                          </p>
                          <p className="mt-1 font-mono text-xs text-atmo-10 bg-atmo-2 inline-block px-2 py-0.5 rounded">
                            822_NextEra_Add_Blue_Cloud_Wind_GEN-20YY-###.prj
                          </p>
                        </div>
                        <div>
                          <div className="font-semibold text-primary-200 mb-1">Attachment AQ</div>
                          <p className="text-atmo-9">
                            Must contain area/owner/zone number, area/owner/zone abbreviated name, and a DPA/DPNS number.
                          </p>
                          <p className="mt-1 font-mono text-xs text-atmo-10 bg-atmo-2 inline-block px-2 py-0.5 rounded">
                            525_WFEC_MidwestFranklin_Rebuild_DPA-2018-Month-###.prj
                          </p>
                        </div>
                        <div>
                          <div className="font-semibold text-primary-200 mb-1">Other Types</div>
                          <p className="text-atmo-9">No structured naming constraint indicated in MOD guidelines.</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                )}
              </section>
            )}

            {step === 1 && (
              <section>
                <h1 className="text-2xl font-semibold text-foreground mb-1">
                  Review Submission Details
                </h1>
                <p className="text-sm text-atmo-9 mb-6">
                  {isProfiles
                    ? "Review or edit your file details. Information may be auto-generated or taken from the file submission."
                    : "Review your file's details. Pre-populated values are extracted from the submitted file."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className="text-sm font-medium text-primary-200 block mb-1.5">
                      {config.nameLabel}
                    </label>
                    <Input value={parsedProjectName} readOnly disabled aria-readonly />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary-200 block mb-1.5">
                      Submitter Name
                    </label>
                    <Input value={submitterName} readOnly disabled aria-readonly />
                  </div>
                  {isTopology && (
                    <div>
                      <label htmlFor="project-type" className="text-sm font-medium text-primary-200 block mb-1.5">
                        Project Type <span className="text-destructive">*</span>
                      </label>
                      <Select value={projectType} onValueChange={(v) => setProjectType(v as ProjectType)}>
                        <SelectTrigger id="project-type" aria-describedby={projectType ? "project-type-help" : undefined}>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 w-[var(--radix-select-trigger-width)] max-w-[min(480px,calc(100vw-2rem))]">
                          {projectTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value} description={t.description}>
                              <span className="font-medium text-primary-200">{t.value}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {projectType && (
                        <p id="project-type-help" className="mt-1.5 text-xs leading-snug text-hitachi-placeholder">
                          {projectTypes.find((t) => t.value === projectType)?.description}
                        </p>
                      )}
                    </div>
                  )}
                  {isProfiles && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-primary-200 block mb-2">
                          Profile Type <span className="text-destructive">*</span>
                        </label>
                        <RadioGroup
                          value={profileType}
                          onValueChange={(v) => setProfileType(v as "load_gen" | "device_control")}
                          className="flex items-center gap-6 h-10"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem id="pt-load-gen" value="load_gen" />
                            <Label htmlFor="pt-load-gen" className="font-normal cursor-pointer">Load Gen</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem id="pt-device-control" value="device_control" />
                            <Label htmlFor="pt-device-control" className="font-normal cursor-pointer">Device Control</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary-200 block mb-2">
                          Study Type <span className="text-destructive">*</span>
                        </label>
                        <div className="flex items-center gap-6 h-10">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="st-mdag"
                              checked={studyTypes.has("mdag")}
                              onCheckedChange={() => toggleStudy("mdag")}
                            />
                            <Label htmlFor="st-mdag" className="font-normal cursor-pointer">MDAG</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="st-itp"
                              checked={studyTypes.has("itp")}
                              onCheckedChange={() => toggleStudy("itp")}
                            />
                            <Label htmlFor="st-itp" className="font-normal cursor-pointer">ITP</Label>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-primary-200 block mb-1.5">
                          Base Profile Name <span className="text-destructive">*</span>
                        </label>
                        <Select value={baseProfileName} onValueChange={setBaseProfileName}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Profile" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2011ITP-17S_BLG">2011ITP-17S_BLG</SelectItem>
                            <SelectItem value="2011ITP-17S_DC">2011ITP-17S_DC</SelectItem>
                            <SelectItem value="2025MDAG_Base">2025MDAG_Base</SelectItem>
                            <SelectItem value="2026ITP_Base">2026ITP_Base</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  {!isProfiles && (
                    <div>
                      <label className="text-sm font-medium text-primary-200 block mb-1.5">
                        Effective Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-between font-normal",
                              !effectiveDate && "text-muted-foreground"
                            )}
                          >
                            {effectiveDate ? format(effectiveDate, "d MMM yyyy") : "Enter date"}
                            <CalendarIcon className="h-4 w-4 opacity-60" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={effectiveDate}
                            onSelect={setEffectiveDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </section>
            )}

            {step === 2 && (
              <section>
                <h1 className="text-2xl font-semibold text-foreground mb-1">
                  {isProfiles ? (
                    "Comments"
                  ) : (
                    <>Supporting Information <span className="text-atmo-7 font-medium">(Optional)</span></>
                  )}
                </h1>
                <p className="text-sm text-atmo-9 mb-6">
                  {isProfiles
                    ? "Add any comments to provide context to " + brand.clientShortName + "."
                    : "You may add supporting documents now. If you're not ready, you can submit them at a later time."}
                </p>

                {!isProfiles && docsForType && docsForType.length > 0 && (
                  <div className="mb-6 bg-atmo-1 border border-atmo-3 rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-action-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-primary-200 mb-1">
                          Required Documentation for {projectType}
                        </div>
                        <ul className="text-sm text-atmo-10 list-disc pl-5 space-y-1">
                          {docsForType.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {!isProfiles && (
                  <>
                    <FileDropzone
                      accept=".msg,.pdf"
                      multiple
                      label="Add Supporting Documents"
                      hint="Max. file size 10MB (.msg, .pdf)"
                      onFiles={handleAddSupportingFiles}
                    />
                    {supportingFiles.map((f) => (
                      <UploadedFileRow
                        key={f.id}
                        file={f}
                        onRemove={(id) => setSupportingFiles((prev) => prev.filter((x) => x.id !== id))}
                      />
                    ))}
                  </>
                )}

                <div className={isProfiles ? "" : "mt-6"}>
                  {!isProfiles && (
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-foreground">Comment</span>
                        <span className="text-xs text-muted-foreground">
                          Optional information to provide context to {brand.clientShortName}.
                        </span>
                      </div>
                    </div>
                  )}
                  <CommentsThread comments={comments} onAdd={handleAddComment} />
                </div>
              </section>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-atmo-0 border-t border-atmo-3 px-6 py-4 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          {step > 0 && (
            <Button variant="ghost" onClick={handlePrev} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          {step === 2 && (
            <Button variant="outline" onClick={handleSaveDraft} className="rounded-full">
              Save Draft
            </Button>
          )}
          {step < 2 && (
            <Button
              onClick={handleNext}
              disabled={(step === 0 && !canAdvanceStep1) || (step === 1 && !canAdvanceStep2)}
              className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90 rounded-full gap-1.5"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {step === 2 && (
            <Button
              onClick={handleSubmit}
              className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90 rounded-full gap-1.5"
            >
              <Upload className="h-4 w-4" />
              Submit
            </Button>
          )}
        </footer>
      </div>
    </SidebarProvider>
  );
};

export default ImportSubmission;
