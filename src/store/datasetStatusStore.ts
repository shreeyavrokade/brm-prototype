import { useSyncExternalStore } from "react";
import type { DatasetStatus } from "@/components/submission/datasetStatus";

/**
 * Live dataset lifecycle overrides keyed by submission id.
 * Detail screens publish their derived status here so the parent tab
 * directories render the same pill without a page reload.
 */
const overrides = new Map<string, DatasetStatus>();
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const setDatasetStatus = (id: string, status: DatasetStatus) => {
  if (overrides.get(id) === status) return;
  overrides.set(id, status);
  emit();
};

export const getDatasetStatus = (id: string) => overrides.get(id);

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const useDatasetStatus = <T extends string>(id: string, base: T): DatasetStatus | T =>
  useSyncExternalStore(
    subscribe,
    () => (overrides.get(id) ?? base) as DatasetStatus | T,
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
