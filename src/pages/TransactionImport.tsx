import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronRight, Download, Upload, X, CheckCircle2, AlertTriangle, Lock } from "lucide-react";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import Stepper from "@/components/import/Stepper";
import FileDropzone from "@/components/import/FileDropzone";
import UploadedFileRow, { type UploadedFile } from "@/components/import/UploadedFileRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addPair, nextTransactionId, initialAckState, type TransactionRecord } from "@/store/transactionsStore";

const STEPS = ["Upload File", "Review Submission Details", "Supporting Information"];

const SPP_MEMBERS = new Set([
  "AEP", "SPP", "WFEC", "Westar", "OG&E", "KCP&L", "Sunflower Electric",
  "City of Wichita", "City of Topeka", "City of Liberal", "Tri-State G&T",
  "AECI", "Springfield Util",
]);

const parsed = {
  fromArea: "AEP",
  toArea: "EOR",
  startDate: "2026-10-01",
  stopDate: "2026-10-31",
  capacityType: "Non-Firm" as const,
  capacityMW: 150,
};

const RETURN_TO = "/?tab=transactions";

const TransactionImport = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [primaryFile, setPrimaryFile] = useState<UploadedFile | null>(null);
  const [proofFile, setProofFile] = useState<UploadedFile | null>(null);
  const [txName, setTxName] = useState("");

  const external = useMemo(
    () => !SPP_MEMBERS.has(parsed.fromArea) || !SPP_MEMBERS.has(parsed.toArea),
    []
  );
  const externalName = !SPP_MEMBERS.has(parsed.toArea) ? parsed.toArea : parsed.fromArea;

  const handleCancel = () => navigate(RETURN_TO);
  const handleNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));

  const handlePrimary = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum size is 10MB." });
      return;
    }
    setPrimaryFile({ id: crypto.randomUUID(), name: f.name, sizeKb: Math.max(1, Math.round(f.size / 1024)) });
    setTxName(f.name.replace(/\.[^.]+$/, ""));
  };

  const handleProof = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum size is 10MB." });
      return;
    }
    setProofFile({ id: crypto.randomUUID(), name: f.name, sizeKb: Math.max(1, Math.round(f.size / 1024)) });
  };

  const downloadTemplate = () => {
    const blob = new Blob(
      ["From Area,To Area,Start Date,Stop Date,Capacity Type,MW\n"],
      { type: "text/csv" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "non-firm-transaction-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const submit = () => {
    const primaryId = nextTransactionId();
    const now = Date.now();
    // Non-Firm intake is created by CP1: CP1 acknowledged, CP2 action needed.
    const primary = {
      id: primaryId,
      ...initialAckState("non-firm"),
      fromEntity: parsed.fromArea,
      toEntity: parsed.toArea,
      startDate: "01 Oct 2026",
      stopDate: "31 Oct 2026",
      firmType: "Non-Firm" as const,
      mwCapacity: parsed.capacityMW,
      acknowledged: false,
      submissionTimestamp: now,
      hasProof: external && !!proofFile,
    };
    const mirror = {
      ...primary,
      id: `${primaryId}-M`,
      fromEntity: parsed.toArea,
      toEntity: parsed.fromArea,
      isMirror: true,
      mirrorOf: primaryId,
    };
    addPair(primary, mirror);
    toast.success(`Transaction ${primaryId} submitted.`, {
      description: `Mirror record ${mirror.id} routed to counterparty.`,
    });
    navigate(RETURN_TO);
  };

  const canAdvanceStep1 = !!primaryFile;
  const canSubmit = external ? !!proofFile : true;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-atmo-1 w-full">
        <GlobalHeader />

        <div className="bg-atmo-0 border-b border-atmo-3 px-6 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">Transactions</span>
            <ChevronRight className="h-3.5 w-3.5 text-atmo-7" />
            <span className="text-atmo-9">Create Non-Firm Transaction</span>
          </nav>
          <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Close" className="h-8 w-8 text-atmo-9">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <main className="flex-1 px-6 py-10">
          <Stepper steps={STEPS} current={step} />

          <div className="max-w-3xl mx-auto mt-12">
            {step === 0 && (
              <section>
                <h1 className="text-2xl font-semibold text-foreground mb-2">Upload File</h1>
                <div className="mb-6">
                  <p className="text-sm text-atmo-10">
                    All submission names must be unique and formatted as follows:
                  </p>
                  <div className="mt-3 text-base font-semibold text-foreground">
                    [Submitting Entity] _NFT_ [Counterparty] _ [Start Month-Year]
                  </div>
                  <div className="text-sm text-atmo-10 mt-1">"AEP_NFT_EOR_Oct2026"</div>
                </div>

                <div className="mb-6 flex items-center justify-between gap-4 bg-atmo-1 border border-atmo-3 rounded-md px-4 py-3">
                  <div className="text-sm text-atmo-10">
                    Need the latest format? Download the Non-Firm Transaction template.
                  </div>
                  <Button variant="outline" onClick={downloadTemplate} className="h-8 gap-1.5 rounded-md text-xs font-semibold">
                    <Download className="h-3.5 w-3.5" />
                    Download Template (.xlsx)
                  </Button>
                </div>

                <FileDropzone
                  accept=".xlsx,.xls,.csv"
                  hint="Max. file size 10MB (.xlsx, .xls, .csv)"
                  onFiles={handlePrimary}
                />
                {primaryFile && (
                  <UploadedFileRow file={primaryFile} onRemove={() => setPrimaryFile(null)} />
                )}
              </section>
            )}

            {step === 1 && (
              <section>
                <h1 className="text-2xl font-semibold text-foreground mb-1">Review Submission Details</h1>
                <p className="text-sm text-atmo-9 mb-6">
                  Review your file's details. Pre-populated values are extracted from the submitted file.
                </p>

                <div className="mb-6 flex items-center gap-2 bg-base-positive border border-success/30 rounded-md px-3 py-2.5 text-sm text-atmo-10">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  File parsed successfully with 1 transaction record.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-primary-200 block mb-1.5">Transaction Name</label>
                    <Input value={txName} onChange={(e) => setTxName(e.target.value)} />
                  </div>
                  <ReadField label="From Area" value={`${parsed.fromArea}${SPP_MEMBERS.has(parsed.fromArea) ? " (SPP Member)" : " (External)"}`} />
                  <ReadField label="To Area" value={`${parsed.toArea}${SPP_MEMBERS.has(parsed.toArea) ? " (SPP Member)" : " (External / Non-SPP Entity)"}`} />
                  <ReadField label="Start Date" value={parsed.startDate} />
                  <ReadField label="Stop Date" value={parsed.stopDate} />
                  <ReadField label="Capacity Type" value={parsed.capacityType} />
                  <ReadField label="Contracted Capacity" value={`${parsed.capacityMW} MW`} />
                </div>
              </section>
            )}

            {step === 2 && (
              <section>
                <h1 className="text-2xl font-semibold text-foreground mb-1">
                  Supporting Information{" "}
                  {!external && <span className="text-atmo-7 font-medium">(Optional)</span>}
                </h1>
                <p className="text-sm text-atmo-9 mb-6">
                  {external
                    ? "External counterparty detected. Proof of Coordination is required prior to submission."
                    : "Both counterparties are within the SPP footprint. Supporting documents are optional."}
                </p>

                {external ? (
                  <>
                    <div className="mb-6 bg-[#FCF2D9] border border-[#FFBE2E] text-[#6D4D09] rounded-md p-4 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-semibold mb-1">Proof of Coordination Required</div>
                        The selected counterparty ({externalName}) is outside the SPP footprint.
                        A signed coordination artifact (.pdf or .msg) must be attached before submission.
                      </div>
                    </div>
                    <FileDropzone
                      accept=".pdf,.msg"
                      label="Add Proof of Coordination"
                      hint="Max. file size 10MB (.pdf, .msg)"
                      onFiles={handleProof}
                    />
                    {proofFile && (
                      <UploadedFileRow file={proofFile} onRemove={() => setProofFile(null)} />
                    )}
                    <div className="mt-4 flex items-center gap-2 text-xs text-atmo-10">
                      <Lock className="h-3.5 w-3.5" />
                      <span>
                        <span className="font-semibold">Gated Security:</span>{" "}
                        Strictly restricted to Submitting Entity and SPP Staff.
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="bg-atmo-1 border border-atmo-3 rounded-md p-4 text-sm text-atmo-10">
                    No external proof of coordination is required for this submission.
                  </div>
                )}
              </section>
            )}
          </div>
        </main>

        <footer className="bg-atmo-0 border-t border-atmo-3 px-6 py-4 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
          {step > 0 && (
            <Button variant="ghost" onClick={handlePrev} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          {step < 2 && (
            <Button
              onClick={handleNext}
              disabled={step === 0 && !canAdvanceStep1}
              className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90 rounded-full gap-1.5"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {step === 2 && (
            <Button
              onClick={submit}
              disabled={!canSubmit}
              className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90 rounded-full gap-1.5"
            >
              <Upload className="h-4 w-4" />
              Submit Transaction
            </Button>
          )}
        </footer>
      </div>
    </SidebarProvider>
  );
};

const ReadField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="text-sm font-medium text-primary-200 block mb-1.5">{label}</label>
    <Input value={value} readOnly disabled aria-readonly />
  </div>
);

export default TransactionImport;
