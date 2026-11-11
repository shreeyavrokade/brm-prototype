// Canonical table chrome — mirrors src/components/topology/ChangesetTable.tsx.
// Import these constants in every list view and submission-detail grid so all
// tables share identical container, header, body, and zebra styling.
import { cn } from "@/lib/utils";

export const TABLE_SHELL = "bg-atmo-0 border border-atmo-4 rounded-md overflow-hidden";

export const HEADER_ROW = "bg-atmo-1 hover:bg-atmo-1 border-[#E2E8F0]";

export const HEADER_CELL =
  "text-xs font-semibold text-atmo-10 border border-[#E2E8F0] bg-atmo-1";

export const BODY_CELL = "text-sm text-atmo-10 border border-[#E2E8F0]";

export const zebraRow = (idx: number) =>
  cn("border-[#E2E8F0]", idx % 2 === 1 && "bg-zebra");
