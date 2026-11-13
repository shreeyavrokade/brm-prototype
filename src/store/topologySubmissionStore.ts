import { useSyncExternalStore } from "react";
import type { ParsedPrj } from "@/lib/topologyPrj";
import { countIssues } from "@/lib/topologyPrj";
import type { ActivityItem } from "@/components/dashboard/types";
import { getDatasetStatus, setDatasetStatus } from "@/store/datasetStatusStore";

/**
 * Parsed topology files keyed by submission id (in-memory demo state).
 * Validation is simulated with a short delay so the "Validation in Progress"
 * / "Pending Validation" states are visible during a demo.
 *
 * The activity trail (uploads, validation results, submissions, engineer
 * returns and comments) lives here too, so it is shared by the participant
 * and engineer views and survives navigation.
 */
export const SIMULATED_VALIDATION_MS = 3000;
export const DEMO_SUBMITTER = "Eddie Lake";

/**
 * Demo default: a submission moves Pending Acceptance → Accepted on its own
 * after SIMULATED_VALIDATION_MS, so the submitter journey runs end to end
 * without switching to the engineer view. Set VITE_DEMO_ENGINEER_REVIEW=true
 * to turn this off and accept / return submissions manually as the engineer.
 */
export const AUTO_ACCEPT_ON_SUBMIT = import.meta.env.VITE_DEMO_ENGINEER_REVIEW !== "true";

export interface ReturnNote {
  note: string;
  by: string;
  at: string;
  /** File revision the note applies to; a newer upload supersedes it. */
  revision: number;
}

export interface TopologySubmission {
  parsed: ParsedPrj;
  /** Increments on every uploaded version; screens reset their issue state on change. */
  revision: number;
  validating: boolean;
  /** Optional fixes (warnings) the submitter accepted at submission. */
  acceptedWarnings?: number;
  returnNote?: ReturnNote;
  activity: ActivityItem[];
}

const subs = new Map<string, TopologySubmission>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const stamp = () =>
  new Date().toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });

let seq = 0;
const entry = (type: ActivityItem["type"], user: string, message: string): ActivityItem => ({
  id: `TA-${Date.now()}-${seq++}`,
  type,
  user,
  message,
  timestamp: stamp(),
});

const patch = (id: string, fn: (cur: TopologySubmission) => TopologySubmission) => {
  const cur = subs.get(id);
  if (!cur) return;
  subs.set(id, fn(cur));
  emit();
};

export const getTopologySubmission = (id: string) => subs.get(id);

export const useTopologySubmission = (id: string) =>
  useSyncExternalStore(subscribe, () => subs.get(id), () => undefined);

export const addSubmissionActivity = (id: string, type: ActivityItem["type"], user: string, message: string) =>
  patch(id, (cur) => ({ ...cur, activity: [...cur.activity, entry(type, user, message)] }));

/** Record how many optional fixes the submitter accepted at submission (0 for a clean submit). */
export const markSubmittedAsIs = (id: string, acceptedWarnings: number) =>
  patch(id, (cur) => ({ ...cur, acceptedWarnings }));

/** Engineer sends the file back: Pending Acceptance → Review Needed, with a traceable comment. */
export const returnSubmission = (id: string, note: string, by: string) => {
  patch(id, (cur) => ({
    ...cur,
    returnNote: { note, by, at: stamp(), revision: cur.revision },
    activity: [
      ...cur.activity,
      entry("comment", by, note),
      entry("history", "System", `Returned to submitter by ${by} — status changed to Review Needed`),
    ],
  }));
  setDatasetStatus(id, "Review Needed");
};

/** Engineer accepts the submission for the model build. */
export const acceptSubmission = (id: string, by: string) => {
  patch(id, (cur) => ({
    ...cur,
    activity: [...cur.activity, entry("history", "System", `Accepted for the model build by ${by}`)],
  }));
  setDatasetStatus(id, "Accepted");
};

/**
 * Submit for review: → Pending Acceptance. With auto-accept on, the simulated
 * engineering review accepts it after the same delay as validation, unless the
 * status changed or a newer version was uploaded in the meantime.
 */
export const submitForReview = (
  id: string,
  acceptedWarnings: number,
  opts: { reviewer: string; autoAccept?: boolean; onAccepted?: () => void },
) => {
  markSubmittedAsIs(id, acceptedWarnings);
  setDatasetStatus(id, "Pending Acceptance");
  if (!(opts.autoAccept ?? AUTO_ACCEPT_ON_SUBMIT)) return;
  const revision = subs.get(id)?.revision;
  window.setTimeout(() => {
    if (getDatasetStatus(id) !== "Pending Acceptance" || subs.get(id)?.revision !== revision) return;
    acceptSubmission(id, opts.reviewer);
    opts.onAccepted?.();
  }, SIMULATED_VALIDATION_MS);
};

/** Outcome status once validation finishes. */
export const statusForIssues = (parsed: ParsedPrj) => {
  const { errors, warnings } = countIssues(parsed.issues);
  return errors + warnings > 0 ? "Review Needed" : "Pending Submittal";
};

/**
 * Store a file and (optionally) run simulated validation.
 * `pendingStatus` is shown while validating: "Validation in Progress" for a
 * first submission, "Pending Validation" for a resubmitted version.
 */
export const storeTopologyFile = (
  id: string,
  parsed: ParsedPrj,
  opts: { validate: boolean; pendingStatus?: "Validation in Progress" | "Pending Validation"; onDone?: (p: ParsedPrj) => void },
) => {
  const prev = subs.get(id);
  const uploaded = entry(
    "history",
    "System",
    prev
      ? `Version ${parsed.version} (${parsed.fileName}) uploaded by ${DEMO_SUBMITTER} — re-validation started`
      : `${parsed.fileName} uploaded by ${DEMO_SUBMITTER}`,
  );
  subs.set(id, {
    ...prev,
    parsed,
    revision: (prev?.revision ?? 0) + 1,
    validating: opts.validate,
    activity: [...(prev?.activity ?? []), uploaded],
  });
  emit();
  if (!opts.validate) return;
  setDatasetStatus(id, opts.pendingStatus ?? "Validation in Progress");
  window.setTimeout(() => {
    const cur = subs.get(id);
    if (!cur || cur.parsed !== parsed) return; // superseded by a newer upload
    const c = countIssues(parsed.issues);
    subs.set(id, {
      ...cur,
      validating: false,
      activity: [
        ...cur.activity,
        entry("history", "System", `Validation completed for version ${parsed.version}: ${c.errors} required fixes, ${c.warnings} optional fixes`),
      ],
    });
    setDatasetStatus(id, statusForIssues(parsed));
    emit();
    opts.onDone?.(parsed);
  }, SIMULATED_VALIDATION_MS);
};
