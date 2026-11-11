import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Lock,
  CheckCircle,
  Eye,
  PencilSimple,
  WarningCircle,
  ChatDots,
} from "@phosphor-icons/react";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type StatusKind =
  | "complete"
  | "review"
  | "not-required"
  | "action"
  | "view-only";

const StatusPill = ({ kind }: { kind: StatusKind }) => {
  const map: Record<
    StatusKind,
    { cls: string; icon: JSX.Element; label: string }
  > = {
    complete: {
      cls: "bg-emerald-100 text-emerald-800",
      icon: <CheckCircle weight="fill" className="h-3.5 w-3.5" />,
      label: "Complete",
    },
    review: {
      cls: "bg-amber-100 text-amber-900",
      icon: <PencilSimple weight="bold" className="h-3.5 w-3.5" />,
      label: "Review / Edit",
    },
    "not-required": {
      cls: "bg-neutral-200 text-neutral-500",
      icon: <></>,
      label: "Not Required",
    },
    action: {
      cls: "bg-amber-100 text-amber-900",
      icon: <WarningCircle weight="fill" className="h-3.5 w-3.5" />,
      label: "Action Needed",
    },
    "view-only": {
      cls: "bg-neutral-800 text-white",
      icon: <Lock weight="bold" className="h-3.5 w-3.5" />,
      label: "View-Only",
    },
  };
  const { cls, icon, label } = map[kind];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        cls,
      )}
    >
      {icon}
      {label}
    </span>
  );
};

interface TaskRowProps {
  label: string;
  status: StatusKind;
  actionLabel: string;
  actionIcon: JSX.Element;
  variant?: "outline" | "primary";
  disabled?: boolean;
  onAction?: () => void;
}

const TaskRow = ({
  label,
  status,
  actionLabel,
  actionIcon,
  variant = "outline",
  disabled,
  onAction,
}: TaskRowProps) => (
  <div className="flex items-center justify-between gap-4 border-t border-neutral-200 py-3 first:border-t-0">
    <div className="text-sm font-medium text-neutral-900">{label}</div>
    <div className="flex items-center gap-4">
      <StatusPill kind={status} />
      <Button
        size="sm"
        disabled={disabled}
        onClick={onAction}
        className={cn(
          "gap-1.5",
          variant === "primary"
            ? "bg-atmo-10 text-white hover:bg-atmo-9"
            : "bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50",
        )}
      >
        {actionIcon}
        {actionLabel}
      </Button>
    </div>
  </div>
);

interface SectionShellProps {
  title: string;
  subtitle: string;
  variant: "readonly" | "editable" | "conditional";
  statePill?: { icon: JSX.Element; label: string; cls: string };
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const SectionShell = ({
  title,
  subtitle,
  variant,
  statePill,
  children,
  footer,
}: SectionShellProps) => (
  <section
    className={cn(
      "rounded-lg border p-5",
      variant === "readonly" ? "bg-atmo-2" : "bg-white",
    )}
    style={{ borderColor: "#D9D9D9" }}
  >
    <div className="flex items-center justify-between gap-4 mb-1">
      <h2 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
        {title}
      </h2>
      {statePill && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            statePill.cls,
          )}
        >
          {statePill.icon}
          {statePill.label}
        </span>
      )}
    </div>
    <p className="text-sm text-neutral-600 mb-4">{subtitle}</p>
    <div>{children}</div>
    {footer && <div className="mt-4">{footer}</div>}
  </section>
);

const MEMLoadReview = () => {
  const navigate = useNavigate();
  const [varies, setVaries] = useState(false);
  const [verified, setVerified] = useState(false);

  // Static demo statuses per spec.
  // Section 1: Load Bus (editable, needs review), Peak Load (view-only, complete), Station Service (editable, complete)
  const s1: StatusKind[] = ["review", "complete", "complete"];
  // Section 2: Annual Load Factor (needs review), Annual Loss Factor (complete)
  const s2: StatusKind[] = ["review", "complete"];

  const openDataset = (id: string) =>
    navigate(`/market-economic?track=load&open=${id}`);

  const isDone = (s: StatusKind) => s === "complete";
  const s1Done = s1.filter(isDone).length;
  const s2Done = s2.filter(isDone).length;
  const s3Done = 0; // demo: no completed s3 tasks

  const { done, total, pct } = useMemo(() => {
    const total = 5 + (varies ? 2 : 0);
    const done = s1Done + s2Done + (varies ? s3Done : 0);
    return { done, total, pct: Math.round((done / total) * 100) };
  }, [varies, s1Done, s2Done]);

  const allDone = done === total;
  const canSubmit = allDone && verified;

  return (
    <div className="min-h-screen flex flex-col w-full bg-atmo-1">
      <GlobalHeader />
      <main className="flex-1 px-8 py-6 pb-28 max-w-6xl w-full mx-auto">
        {/* Breadcrumb */}
        <div className="text-xs text-neutral-500 mb-2">
          Models / Market Economic Model / Load Review
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-5">
          Market Economic Model - Load Review
        </h1>

        {/* Executive Status Dock */}
        <div
          className="rounded-lg border bg-white p-5 mb-6"
          style={{ borderColor: "#D9D9D9" }}
        >
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <div className="text-sm font-medium text-neutral-900 mb-2">
                Overall Progress: {done} of {total} Tasks Complete ({pct}%)
              </div>
              <Progress value={pct} className="h-2" />
            </div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-neutral-900"
              style={{ backgroundColor: "#E0E6F5" }}
            >
              <Clock weight="bold" className="h-4 w-4" />
              Deadline: March 15, 2027 (45 Days Remaining)
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Section 1 — Mixed Permissions */}
          <SectionShell
            title="Section 1: Powerflow Inputs"
            subtitle="Review pre-populated bus-level seasonal loads, demand-group peaks, and station service mappings."
            variant="editable"
            statePill={{
              icon: <PencilSimple weight="bold" className="h-3.5 w-3.5" />,
              label: "MIXED PERMISSIONS",
              cls: "bg-neutral-800 text-white",
            }}
            footer={
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                <ChatDots className="h-4 w-4" />
                Report Data Discrepancy / Flag Issue to SPP
              </button>
            }
          >
            <TaskRow
              label="Load Bus"
              status={s1[0]}
              actionLabel="Edit Load Bus"
              actionIcon={<PencilSimple className="h-4 w-4" />}
              variant="primary"
              onAction={() => openDataset("load-bus")}
            />
            <TaskRow
              label="Peak Load"
              status={s1[1] === "complete" ? "complete" : "view-only"}
              actionLabel="View Data"
              actionIcon={<Eye className="h-4 w-4" />}
              onAction={() => openDataset("peak-load")}
            />
            <TaskRow
              label="Station Service Load"
              status={s1[2]}
              actionLabel="Edit Station Service"
              actionIcon={<PencilSimple className="h-4 w-4" />}
              variant="primary"
              onAction={() => openDataset("station-service")}
            />
          </SectionShell>

          {/* Section 2 */}
          <SectionShell
            title="Section 2: Verify Load & Loss Factors"
            subtitle="Verify the 20-year annual load factor and loss factor projections for every demand group."
            variant="editable"
            statePill={{
              icon: <PencilSimple weight="bold" className="h-3.5 w-3.5" />,
              label: "EDITABLE",
              cls: "text-white",
            }}
          >
            <TaskRow
              label="Annual Load Factor"
              status={s2[0]}
              actionLabel="Edit Projections"
              actionIcon={<PencilSimple className="h-4 w-4" />}
              variant="primary"
              onAction={() => openDataset("annual-load-factor")}
            />
            <TaskRow
              label="Annual Loss Factor"
              status={s2[1]}
              actionLabel="Edit Projections"
              actionIcon={<PencilSimple className="h-4 w-4" />}
              variant="primary"
              onAction={() => openDataset("annual-loss-factor")}
            />
          </SectionShell>

          {/* Section 3 */}
          <SectionShell
            title="Section 3: Resource Plan Updates"
            subtitle="Only required if your resource plan projections vary from Powerflow Base Reliability."
            variant="conditional"
            statePill={{
              icon: <PencilSimple weight="bold" className="h-3.5 w-3.5" />,
              label: "OPTIONALLY EDITABLE",
              cls: "text-neutral-900",
            }}
          >
            <div
              className="flex items-center gap-3 rounded-md border p-3 mb-3"
              style={{ borderColor: "#D9D9D9", backgroundColor: "#FBFCFC" }}
            >
              <Switch checked={varies} onCheckedChange={setVaries} id="varies" />
              <label
                htmlFor="varies"
                className="text-sm text-neutral-800 cursor-pointer"
              >
                My resource plan varies from Base Reliability
              </label>
            </div>
            <div className={cn(varies ? "opacity-100" : "opacity-60")}>
              <TaskRow
                label="Resource Planning Peak Load"
                status={varies ? "action" : "not-required"}
                actionLabel="Edit Projections"
                actionIcon={<PencilSimple className="h-4 w-4" />}
                variant="primary"
                disabled={!varies}
                onAction={() => openDataset("rp-peak-load")}
              />
              <TaskRow
                label="Resource Planning Load Factor"
                status={varies ? "action" : "not-required"}
                actionLabel="Edit Projections"
                actionIcon={<PencilSimple className="h-4 w-4" />}
                variant="primary"
                disabled={!varies}
                onAction={() => openDataset("rp-load-factor")}
              />
            </div>
          </SectionShell>
        </div>
      </main>

      {/* Footer safety dock */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-4 px-6 py-3 text-white"
        style={{ backgroundColor: "#222222" }}
      >
        <Button
          variant="ghost"
          className="text-white hover:bg-neutral-800 hover:text-white"
          onClick={() => navigate("/market-economic?track=load")}
        >
          Cancel / Exit Review
        </Button>
        <label className="flex items-center gap-2 text-xs text-neutral-200 max-w-xl">
          <Checkbox
            checked={verified}
            onCheckedChange={(v) => setVerified(!!v)}
            className="border-neutral-400"
          />
          <span>
            I verify that the reviewed load parameters match our system obligations
            for this cycle.
          </span>
        </label>
        <Button
          disabled={!canSubmit}
          className="bg-white text-neutral-900 hover:bg-neutral-200 disabled:opacity-50"
        >
          Submit MEM Load Review to SPP
        </Button>
      </div>
    </div>
  );
};

export default MEMLoadReview;
