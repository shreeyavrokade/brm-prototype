import { useSyncExternalStore } from "react";
import { mockChangeset, type ChangesetRow } from "@/components/topology/mockChangeset";

let rows: ChangesetRow[] = [...mockChangeset];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const getRows = () => rows;

export const addRow = (row: ChangesetRow) => {
  rows = [row, ...rows];
  emit();
};

export const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useChangesetRows = () =>
  useSyncExternalStore(subscribe, getRows, getRows);

export const nextChangesetId = () => {
  const max = rows.reduce((m, r) => {
    const n = parseInt(r.id.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `M${max + 1}`;
};
