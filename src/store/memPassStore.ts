import { useSyncExternalStore } from "react";

/**
 * MEM pass lifecycle + automatic module activity tracking.
 *
 * A "pass" is one participant review window followed by an SPP review window.
 * Modules are marked Complete automatically as soon as the user opens them,
 * so there is no manual sign-off. Visits persist in localStorage keyed by
 * track + pass number, so a new pass resets the matrix.
 */

export type MemTrack = "gen" | "load";
export type MemModuleId = "topology" | "ratings" | "profiles" | "transactions";
export type PassState = "participant" | "spp-review" | "participant-after-spp";

export const MEM_MODULES: { id: MemModuleId; label: string; tab: string }[] = [
  { id: "topology", label: "Topology", tab: "topology" },
  { id: "ratings", label: "Ratings", tab: "ratings" },
  { id: "profiles", label: "Profiles", tab: "profiles" },
  { id: "transactions", label: "Transactions", tab: "transactions" },
];

/** Demo seed: Pass 1, participant edit window open. */
let passNumber = 1;
let passState: PassState = "participant";

const STORAGE_PREFIX = "mem-pass-visits";
const storageKey = (track: MemTrack, pass: number) =>
  `${STORAGE_PREFIX}:${track}:${pass}`;

type VisitMap = Partial<Record<MemModuleId, number>>;

const cache = new Map<string, VisitMap>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const readVisits = (track: MemTrack, pass: number): VisitMap => {
  const key = storageKey(track, pass);
  const cached = cache.get(key);
  if (cached) return cached;
  let parsed: VisitMap = {};
  try {
    const raw = localStorage.getItem(key);
    if (raw) parsed = JSON.parse(raw) as VisitMap;
  } catch {
    parsed = {};
  }
  cache.set(key, parsed);
  return parsed;
};

/** Record that a module was opened/inspected during the current pass. */
export const recordModuleVisit = (track: MemTrack, module: MemModuleId) => {
  const key = storageKey(track, passNumber);
  const current = readVisits(track, passNumber);
  if (current[module]) return;
  const next: VisitMap = { ...current, [module]: Date.now() };
  cache.set(key, next);
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    /* storage unavailable — keep the in-memory value */
  }
  emit();
};

/** Record a visit for every MEM track (module tabs are shared across tracks). */
export const recordModuleVisitAllTracks = (module: MemModuleId) => {
  recordModuleVisit("gen", module);
  recordModuleVisit("load", module);
};

export const getPassNumber = () => passNumber;
export const getPassState = () => passState;

export const setPass = (nextPass: number, nextState: PassState) => {
  passNumber = nextPass;
  passState = nextState;
  emit();
};

export const usePassInfo = () => {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => `${passNumber}|${passState}`,
    () => `${passNumber}|${passState}`,
  );
  const [num, state] = snapshot.split("|");
  return { passNumber: Number(num), passState: state as PassState };
};

/** Visit timestamps for the current pass on a track (undefined = Incomplete). */
export const useModuleVisits = (track: MemTrack): VisitMap => {
  const key = storageKey(track, passNumber);
  return useSyncExternalStore(
    subscribe,
    () => readVisits(track, passNumber),
    () => cache.get(key) ?? {},
  );
};

export const formatVisitTime = (ts: number) =>
  new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
