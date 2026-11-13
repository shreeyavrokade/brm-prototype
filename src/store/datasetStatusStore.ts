import { useSyncExternalStore } from "react";
import type { DatasetStatus } from "@/components/submission/datasetStatus";

/**
 * Live dataset lifecycle overrides keyed by submission id.
 * Detail screens publish their derived status here so the parent tab
 * directories render the same pill without a page reload.
 */
/** Dataset lifecycle plus the transient intake/hand-off states shown in directories. */
export type LiveStatus = DatasetStatus | "Validation in Progress" | "Pending Acceptance";

const overrides = new Map<string, LiveStatus>();
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const setDatasetStatus = (id: string, status: LiveStatus) => {
  if (overrides.get(id) === status) return;
  overrides.set(id, status);
  emit();
};

export const getDatasetStatus = (id: string) => overrides.get(id);

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const useDatasetStatus = <T extends string>(id: string, base: T): LiveStatus | T =>
  useSyncExternalStore(
    subscribe,
    () => (overrides.get(id) ?? base) as LiveStatus | T,
    () => base,
  );

/**
 * Live count of submissions currently sitting in "Review Needed",
 * combining each row's seed status with any live override.
 */
export const useReviewNeededCount = (items: { id: string; status: string }[]) => {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => items.map((i) => overrides.get(i.id) ?? i.status).join("|"),
    () => items.map((i) => i.status).join("|"),
  );
  return snapshot.split("|").filter((s) => s === "Review Needed").length;
};
