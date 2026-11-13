import { useSyncExternalStore } from "react";
import type { ParsedPrj } from "@/lib/topologyPrj";
import { countIssues } from "@/lib/topologyPrj";
import { setDatasetStatus } from "@/store/datasetStatusStore";

/**
 * Parsed topology files keyed by submission id (in-memory demo state).
 * Validation is simulated with a short delay so the "Validation in Progress"
 * / "Pending Validation" states are visible during a demo.
 */
export const SIMULATED_VALIDATION_MS = 3000;

export interface TopologySubmission {
  parsed: ParsedPrj;
  /** Increments on every uploaded version; screens reset their issue state on change. */
  revision: number;
  validating: boolean;
  /** Optional fixes (warnings) the submitter accepted responsibility for at submission. */
  acceptedWarnings?: number;
}

const subs = new Map<string, TopologySubmission>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const getTopologySubmission = (id: string) => subs.get(id);

export const useTopologySubmission = (id: string) =>
  useSyncExternalStore(subscribe, () => subs.get(id), () => undefined);

/** Record that the submitter accepted responsibility for open warnings. */
export const markSubmittedAsIs = (id: string, acceptedWarnings: number) => {
  const cur = subs.get(id);
  if (!cur) return;
  subs.set(id, { ...cur, acceptedWarnings });
  emit();
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
  subs.set(id, { parsed, revision: (prev?.revision ?? 0) + 1, validating: opts.validate });
  emit();
  if (!opts.validate) return;
  setDatasetStatus(id, opts.pendingStatus ?? "Validation in Progress");
  window.setTimeout(() => {
    const cur = subs.get(id);
    if (!cur || cur.parsed !== parsed) return; // superseded by a newer upload
    subs.set(id, { ...cur, validating: false });
    setDatasetStatus(id, statusForIssues(parsed));
    emit();
    opts.onDone?.(parsed);
  }, SIMULATED_VALIDATION_MS);
};
