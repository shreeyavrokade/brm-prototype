import { useSyncExternalStore } from "react";
import { getPassNumber } from "./memPassStore";

/**
 * Row-level review status for MEM dataset tables.
 *
 * Every row starts at "Review Needed". Accepting SPP values marks the row
 * "Accepted"; saving user edits marks it "Pending SPP Review". Statuses are
 * keyed by pass number, so a new pass automatically resets every row.
 */
export type RowReviewStatus = "Review Needed" | "Accepted" | "Pending SPP Review";

const STORAGE_PREFIX = "mem-row-review";
const storageKey = (pass: number) => `${STORAGE_PREFIX}:${pass}`;

type RowMap = Record<string, RowReviewStatus>; // `${datasetId}:${rowId}`

const cache = new Map<string, RowMap>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const read = (pass: number): RowMap => {
  const key = storageKey(pass);
  const cached = cache.get(key);
  if (cached) return cached;
  let parsed: RowMap = {};
  try {
    const raw = localStorage.getItem(key);
    if (raw) parsed = JSON.parse(raw) as RowMap;
  } catch {
    parsed = {};
  }
  cache.set(key, parsed);
  return parsed;
};

export const setRowStatus = (
  datasetId: string,
  rowId: string,
  status: RowReviewStatus,
) => {
  const pass = getPassNumber();
  const key = storageKey(pass);
  const next: RowMap = { ...read(pass), [`${datasetId}:${rowId}`]: status };
  cache.set(key, next);
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    /* storage unavailable — keep the in-memory value */
  }
  emit();
};

/** Live status map for one dataset in the current pass. */
export const useRowStatuses = (datasetId: string): RowMap => {
  const pass = getPassNumber();
  const snapshot = () => read(pass);
  const all = useSyncExternalStore(subscribe, snapshot, snapshot);
  const out: RowMap = {};
  Object.entries(all).forEach(([k, v]) => {
    const [ds, ...rest] = k.split(":");
    if (ds === datasetId) out[rest.join(":")] = v;
  });
  return out;
};

export const getRowStatus = (
  statuses: RowMap,
  rowId: string,
): RowReviewStatus => statuses[rowId] ?? "Review Needed";
