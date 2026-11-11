export type FieldStatus = "valid" | "warning" | "error";

export type RecordType = "BUS" | "GENERATOR" | "BRANCH" | "TRANSFORMER";

export interface CellStatus {
  status: FieldStatus;
  message?: string;
}

export interface SeasonalRating {
  season: string;
  normalHigh: number;
  emergencyHigh: number;
}

export interface FileRow {
  id: string;
  recordType: RecordType;
  data: Record<string, string>;
  cellStatuses: Record<string, CellStatus>;
  phase?: string;
  category?: string;
  bulkGroup?: string;
  /** BRANCH only — powers the nested seasonal ratings drawer */
  seasonalRatings?: SeasonalRating[];
}

export const RECORD_COLUMNS: Record<RecordType, { key: string; label: string; numeric?: boolean; sticky?: boolean }[]> = {
  BUS: [
    { key: "cell", label: "CELL" },
    { key: "action", label: "ACTION" },
    { key: "bus", label: "BUS", numeric: true, sticky: true },
    { key: "name", label: "NAME", sticky: true },
    { key: "baskv", label: "BASKV", numeric: true },
    { key: "ide", label: "IDE", numeric: true },
    { key: "area", label: "AREA", numeric: true },
    { key: "zone", label: "ZONE", numeric: true },
    { key: "vm", label: "VM", numeric: true },
    { key: "va", label: "VA", numeric: true },
    { key: "owner", label: "OWNER", numeric: true },
    { key: "nvhi", label: "NVHI", numeric: true },
    { key: "nvlo", label: "NVLO", numeric: true },
    { key: "evhi", label: "EVHI", numeric: true },
    { key: "evlo", label: "EVLO", numeric: true },
    { key: "longName", label: "LONG NAME" },
    { key: "longitude", label: "LONGITUDE", numeric: true },
    { key: "gneg", label: "GNEG", numeric: true },
    { key: "bneg", label: "BNEG", numeric: true },
  ],
  GENERATOR: [
    { key: "busNumber", label: "Bus #", numeric: true },
    { key: "genId", label: "Gen ID" },
    { key: "pgen", label: "PGEN (MW)", numeric: true },
    { key: "qgen", label: "QGEN (MVAR)", numeric: true },
    { key: "pmax", label: "PMAX (MW)", numeric: true },
    { key: "pmin", label: "PMIN (MW)", numeric: true },
    { key: "mbase", label: "MBASE (MVA)", numeric: true },
  ],
  BRANCH: [
    { key: "fromBus", label: "From Bus", numeric: true, sticky: true },
    { key: "toBus", label: "To Bus", numeric: true, sticky: true },
    { key: "circuit", label: "CKT", sticky: true },
    { key: "status", label: "Status" },
    { key: "resistance", label: "R1 (PU)", numeric: true },
    { key: "reactance", label: "X1 (PU)", numeric: true },
    { key: "charging", label: "B1 (PU)", numeric: true },
    { key: "rateA", label: "Rate A (MVA)", numeric: true },
    { key: "rateB", label: "Rate B (MVA)", numeric: true },
    { key: "r0", label: "R0 (PU)", numeric: true },
    { key: "x0", label: "X0 (PU)", numeric: true },
    { key: "b0", label: "B0 (PU)", numeric: true },
    { key: "meteredEnd", label: "Metered End" },
    { key: "length", label: "Length (mi)", numeric: true },
  ],

  TRANSFORMER: [
    { key: "fromBus", label: "From Bus", numeric: true },
    { key: "toBus", label: "To Bus", numeric: true },
    { key: "circuit", label: "CKT" },
    { key: "tapRatio", label: "Tap Ratio", numeric: true },
    { key: "windingR", label: "R (PU)", numeric: true },
    { key: "windingX", label: "X (PU)", numeric: true },
    { key: "rateA", label: "Rate A (MVA)", numeric: true },
  ],
};

export interface Issue {
  id: string;
  rowId: string;
  cellKey: string;
  recordType: RecordType;
  phase: string;
  category: string;
  fieldName: string;
  status: "error" | "warning";
  message: string;
  dismissed: boolean;
  dismissReason?: string;
  bulkGroup?: string;
}

export interface SupportingDoc {
  id: string;
  name: string;
  type: string;
  validationStatus: "verified" | "invalid_signature" | "pending";
  uploadedAt: string;
}

export interface ActivityItem {
  id: string;
  type: "comment" | "history";
  user: string;
  message: string;
  timestamp: string;
}

export interface PhaseMetadata {
  name: string;
  effectiveDate: string;
  comments: string;
}

export interface PhaseData {
  metadata: PhaseMetadata;
  rows: FileRow[];
}
