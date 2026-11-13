import { useState } from "react";
import { Check, Layers, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusPill, { type StatusKey } from "@/components/shared/statusBadge";
import { cn } from "@/lib/utils";
import { brand } from "@/config/brand";

type Role = "client" | "counterparty" | "ep";
type Stage = 1 | 2 | 3 | 4;
type Outcome = "approve" | "reject";
type Ack = "Action Needed" | "Acknowledged";

const ROLES: { key: Role; label: string }[] = [
  { key: "client", label: "Viewing as Client (Submitting Entity)" },
  { key: "counterparty", label: "Viewing as Counterparty (Confirming Entity)" },
  { key: "ep", label: "Viewing as " + brand.clientShortName + " / EP Engineer" },
];

const STAGES: { step: Stage; label: string }[] = [
  { step: 1, label: "Initial Non-Firm Submission" },
  { step: 2, label: "Counterparty Counter-Offer" },
  { step: 3, label: "Agreement Reached (EP Queue)" },
  { step: 4, label: "EP Engineer Approval / Rejection" },
];

interface Snapshot {
  macro: StatusKey;
  macroLabel?: string;
  clientAck: Ack;
  counterpartyAck: Ack;
  actions: Record<Role, string>;
}

const matrix = (stage: Stage, outcome: Outcome): Snapshot => {
  if (stage === 1)
    return {
      macro: "Review Needed",
      clientAck: "Acknowledged",
      counterpartyAck: "Action Needed",
      actions: {
        client: "Submission sent. Read-only until the counterparty responds.",
        counterparty: "Counter Panel Enabled — accept the terms or submit a counter offer.",
        ep: "Not yet in the " + brand.clientShortName + " queue. Bilateral negotiation in progress.",
      },
    };
  if (stage === 2)
    return {
      macro: "Review Needed",
      clientAck: "Action Needed",
      counterpartyAck: "Acknowledged",
      actions: {
        client: "Counter Panel Enabled — approve as countered or counter again.",
        counterparty: "Counter submitted. Waiting on the submitting entity.",
        ep: "Not yet in the " + brand.clientShortName + " queue. Bilateral negotiation in progress.",
      },
    };
  if (stage === 3)
    return {
      macro: "Pending Acceptance",
      macroLabel: "Pending Approval",
      clientAck: "Acknowledged",
      counterpartyAck: "Acknowledged",
      actions: {
        client: "Commercial Edits Frozen — Waiting on " + brand.clientShortName + " Review.",
        counterparty: "Commercial Edits Frozen — Waiting on " + brand.clientShortName + " Review.",
        ep: "Approve for Model Build / Reject Transaction.",
      },
    };
  if (outcome === "approve")
    return {
      macro: "Accepted",
      clientAck: "Acknowledged",
      counterpartyAck: "Acknowledged",
      actions: {
        client: "Locked — transaction is included in the " + brand.clientShortName + " model build.",
        counterparty: "Locked — transaction is included in the " + brand.clientShortName + " model build.",
        ep: "Locked for model build. No further edits permitted.",
      },
    };
  return {
    macro: "Rejected",
    clientAck: "Action Needed",
    counterpartyAck: "Action Needed",
    actions: {
      client: "Returned for revision — resubmit or amend the transaction.",
      counterparty: "Returned for revision — re-acknowledge the amended terms.",
      ep: "Rejection reason recorded in the audit trail.",
    },
  };
};

const AckBadge = ({ state }: { state: Ack }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
      state === "Action Needed"
        ? "bg-[#FCF2D9] text-[#6D4D09]"
        : "bg-[#DEEDE2] text-[#146C2E]",
    )}
  >
    {state}
  </span>
);

const WorkflowExplainerModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const [role, setRole] = useState<Role>("client");
  const [stage, setStage] = useState<Stage>(1);
  const [outcome, setOutcome] = useState<Outcome>("approve");

  const snap = matrix(stage, outcome);
  const ack = role === "client" ? snap.clientAck : snap.counterpartyAck;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[800px] max-w-[95vw] max-h-[90vh] overflow-y-auto bg-atmo-0 rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold">
            Transaction Lifecycle &amp; Role Scoping Architecture
          </DialogTitle>
          <DialogDescription className="text-sm text-atmo-9">
            Simulate how statuses change across Client, Counterparty, and {brand.clientShortName} Engineer views.
          </DialogDescription>
        </DialogHeader>

        {/* Role switcher */}
        <div
          role="radiogroup"
          aria-label="Role perspective"
          className="grid grid-cols-3 gap-2 rounded-full bg-atmo-2 p-1"
        >
          {ROLES.map((r) => (
            <button
              key={r.key}
              type="button"
              role="radio"
              aria-checked={role === r.key}
              onClick={() => setRole(r.key)}
              className={cn(
                "rounded-full px-3 py-2 text-xs font-medium transition-colors",
                role === r.key
                  ? "bg-atmo-0 text-foreground shadow-sm"
                  : "text-atmo-9 hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Stage stepper */}
        <div className="mt-2">
          <div className="flex items-stretch">
            {STAGES.map((s, i) => {
              const active = stage === s.step;
              const done = stage > s.step;
              return (
                <div key={s.step} className="flex flex-1 items-start">
                  <button
                    type="button"
                    onClick={() => setStage(s.step)}
                    aria-current={active ? "step" : undefined}
                    className="flex flex-1 flex-col items-center gap-1.5 px-1 text-center group"
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                        active
                          ? "bg-[#222222] text-atmo-0 border-[#222222]"
                          : done
                            ? "bg-[#DEEDE2] text-[#146C2E] border-[#146C2E]"
                            : "bg-atmo-0 text-atmo-9 border-atmo-4 group-hover:border-atmo-8",
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : s.step}
                    </span>
                    <span
                      className={cn(
                        "text-[11px] leading-tight",
                        active ? "text-foreground font-medium" : "text-atmo-9",
                      )}
                    >
                      {s.label}
                    </span>
                  </button>
                  {i < STAGES.length - 1 && (
                    <span className="mt-3.5 h-px w-6 shrink-0 bg-atmo-4" />
                  )}
                </div>
              );
            })}
          </div>

          {stage === 4 && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-[11px] text-atmo-9">EP decision:</span>
              {(["approve", "reject"] as Outcome[]).map((o) => (
                <Button
                  key={o}
                  type="button"
                  size="sm"
                  variant={outcome === o ? "default" : "outline"}
                  onClick={() => setOutcome(o)}
                  className={cn(
                    "h-7 rounded-full px-3 text-xs",
                    outcome === o
                      ? "bg-[#222222] text-atmo-0 hover:bg-[#222222]/90"
                      : "border-atmo-4 bg-atmo-0 text-foreground",
                  )}
                >
                  {o === "approve" ? "Approve for Model Build" : "Reject Transaction"}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Preview card */}
        <div className="mt-2 grid grid-cols-3 divide-x divide-atmo-3 rounded-xl border border-atmo-3 bg-atmo-1">
          <div className="p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-atmo-8">
              Macro Status
            </div>
            <div className="mt-2">
              <StatusPill status={snap.macro} label={snap.macroLabel} />
            </div>
            <p className="mt-2 text-[11px] text-atmo-9">Model build journey — same for every role.</p>
          </div>

          <div className="p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-atmo-8">
              Acknowledgment State
            </div>
            <div className="mt-2">
              {role === "ep" ? (
                <span className="text-xs text-atmo-9">
                  Not shown — {brand.clientShortName} / EP Engineers track the macro status, not per-party turns.
                </span>
              ) : (
                <AckBadge state={ack} />
              )}
            </div>
            {role !== "ep" && (
              <p className="mt-2 text-[11px] text-atmo-9">
                Scoped to {role === "client" ? "the submitting entity" : "the confirming entity"} only.
              </p>
            )}
          </div>

          <div className="p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-atmo-8">
              Available Actions
            </div>
            <p className="mt-2 text-xs leading-relaxed text-foreground">{snap.actions[role]}</p>
          </div>
        </div>

        {/* Callouts */}
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-atmo-3 bg-atmo-0 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Layers className="h-4 w-4 text-atmo-8" />
              Macro Status = Model Build Journey
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-atmo-9">
              Status tracks the file through {brand.clientShortName}'s system model phases:{" "}
              <span className="font-medium text-foreground">Review Needed → Pending Approval → Accepted</span>{" "}
              (or Rejected). It is a system-wide value every role sees identically.
            </p>
          </div>
          <div className="rounded-xl border border-atmo-3 bg-atmo-0 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <UserCheck className="h-4 w-4 text-atmo-8" />
              Acknowledgment State = Action Needed vs Acknowledged
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-atmo-9">
              Each party sees only its own binary turn status, so no one has to interpret the
              counterparty's internal workflow — if it says Action Needed, the ball is in your court.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowExplainerModal;
