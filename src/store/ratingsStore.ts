import { useSyncExternalStore } from "react";
import { mockRatings, type RatingRow } from "@/components/topology/mockRatings";

let rows: RatingRow[] = [...mockRatings];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const getRatings = () => rows;

export const addRating = (row: RatingRow) => {
  rows = [row, ...rows];
  emit();
};

export const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useRatings = () =>
  useSyncExternalStore(subscribe, getRatings, getRatings);

export const nextRatingId = () => {
  const max = rows.reduce((m, r) => {
    const n = parseInt(r.id.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `R${max + 1}`;
};
