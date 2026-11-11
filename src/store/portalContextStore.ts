import { useSyncExternalStore } from "react";

export type PortalView = "STAKEHOLDER" | "SPP_ENGINEER";

const KEY = "spp_active_portal_view";

const read = (): PortalView => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "SPP_ENGINEER" ? "SPP_ENGINEER" : "STAKEHOLDER";
  } catch {
    return "STAKEHOLDER";
  }
};

let activePortalView: PortalView = read();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const getPortalView = () => activePortalView;

export const setPortalView = (v: PortalView) => {
  if (activePortalView === v) return;
  activePortalView = v;
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* ignore */
  }
  emit();
};

/** Current portal perspective. Switching never mutates submission data. */
export const usePortalView = (): PortalView =>
  useSyncExternalStore(subscribe, getPortalView, () => "STAKEHOLDER" as PortalView);
