export type IssueSeverity = "error" | "warning";

export interface CellIssue {
  id: string;
  severity: IssueSeverity;
  /** id of the row in the grid data */
  rowId: string;
  /** column key in the grid data */
  field: string;
  /** 1-based row number shown to the user */
  rowIndex: number;
  /** human readable row context, e.g. "Bus 533757 (Ratings Profile)" */
  context: string;
  /** rule code, e.g. ERR-402 */
  code: string;
  /** short rule title */
  rule: string;
  description: string;
  /** grouping bucket shown in the Issue Resolution panel */
  category: string;
  dismissed?: boolean;
  dismissReason?: string;
}

/** Ratings dataset — NORMAL_MVA / EMERGENCY_MVA / PERCENT_RATING / TEMPERATURE_F */
export const ratingsIssues: CellIssue[] = [
  {
    id: "R-ERR-1",
    category: "Rating Hierarchy",
    severity: "error",
    rowId: "r1",
    field: "lte1",
    rowIndex: 14,
    context: "Row #14 — Bus 533757 (Ratings Profile)",
    code: "ERR-402",
    rule: "Invalid MVA Hierarchy",
    description: "Emergency MVA (120 MVA) cannot be lower than Normal MVA (150 MVA).",
  },
  {
    id: "R-ERR-2",
    category: "Range Checks",
    severity: "error",
    rowId: "r3",
    field: "norm1",
    rowIndex: 27,
    context: "Row #27 — Line 541105-541199 Ckt 1 (Summer)",
    code: "ERR-118",
    rule: "Normal MVA Out of Range",
    description: "NORMAL_MVA is zero or missing for an in-service branch rating record.",
  },
  {
    id: "R-ERR-3",
    category: "Range Checks",
    severity: "error",
    rowId: "r4",
    field: "ste1",
    rowIndex: 31,
    context: "Row #31 — Bus 541105 (Winter)",
    code: "ERR-215",
    rule: "Percent Rating Violation",
    description: "PERCENT_RATING derived from STE exceeds the 150% conductor design limit.",
  },
  {
    id: "R-WRN-1",
    category: "Baseline Deviation",
    severity: "warning",
    rowId: "r2",
    field: "norm1",
    rowIndex: 42,
    context: "Row #42 — Line 530724-530725 Ckt 1",
    code: "WRN-108",
    rule: "Out-of-Bounds Rating Deviation",
    description: "Summer Rating 1 (220 MVA) is 28% higher than 2025 Base Case.",
  },
  {
    id: "R-WRN-2",
    category: "Seasonal Assumptions",
    severity: "warning",
    rowId: "r5",
    field: "ld1",
    rowIndex: 58,
    context: "Row #58 — Bus 541105 (Fall)",
    code: "WRN-231",
    rule: "Temperature Assumption Anomaly",
    description: "TEMPERATURE_F assumption (95°F) is outside the seasonal baseline band for Fall.",
  },
];

/** Profiles dataset — hourly load/gen values, impedance flags, area assignment */
export const profilesIssues: CellIssue[] = [
  {
    id: "P-ERR-1",
    category: "Sequence Data",
    severity: "error",
    rowId: "lg-4",
    field: "grdflg",
    rowIndex: 14,
    context: "Row #14 — Bus 533757 (Load Gen Profile)",
    code: "ERR-402",
    rule: "Missing Grounding Flag",
    description: "Sequence data (PNEG/QNEG) is present but GRDFLG is unassigned.",
  },
  {
    id: "P-ERR-2",
    category: "Topology Assignment",
    severity: "error",
    rowId: "lg-3",
    field: "area",
    rowIndex: 19,
    context: "Row #19 — Bus 533757 (K3)",
    code: "ERR-330",
    rule: "Missing Area Assignment",
    description: "Load record has no valid area assignment for HOUR_1_TO_24 dispatch.",
  },
  {
    id: "P-ERR-3",
    category: "Sequence Data",
    severity: "error",
    rowId: "lg-2",
    field: "qneg",
    rowIndex: 22,
    context: "Row #22 — Bus 533757 (K2)",
    code: "ERR-407",
    rule: "Negative Impedance Flag",
    description: "Negative-sequence reactance resolves to a negative impedance value.",
  },
  {
    id: "P-WRN-1",
    category: "Baseline Deviation",
    severity: "warning",
    rowId: "lg-1",
    field: "scale",
    rowIndex: 42,
    context: "Row #42 — Bus 533757 (K1)",
    code: "WRN-108",
    rule: "Out-of-Bounds Scaling Deviation",
    description: "HOUR_1_TO_24 scale factor is 28% higher than the 2025 Base Case profile.",
  },
  {
    id: "P-WRN-2",
    category: "Load Modelling",
    severity: "warning",
    rowId: "lg-5",
    field: "ql",
    rowIndex: 51,
    context: "Row #51 — Bus 533757 (KN)",
    code: "WRN-144",
    rule: "Reactive Load Anomaly",
    description: "QL is 0 MVAR across all 24 hours — confirm reactive modelling assumption.",
  },
];

export type IssueFilter = "all" | "errors" | "warnings" | "valid";

export const buildIssueMap = (issues: CellIssue[]) => {
  const map = new Map<string, Map<string, CellIssue>>();
  for (const i of issues) {
    if (i.dismissed) continue;
    if (!map.has(i.rowId)) map.set(i.rowId, new Map());
    map.get(i.rowId)!.set(i.field, i);
  }
  return map;
};

export const rowSeverity = (
  map: Map<string, Map<string, CellIssue>>,
  rowId: string,
): IssueSeverity | null => {
  const cells = map.get(rowId);
  if (!cells) return null;
  for (const c of cells.values()) if (c.severity === "error") return "error";
  return "warning";
};

export const issueCsv = (issues: CellIssue[]) => {
  const head = "Severity,Rule Code,Rule,Row,Field,Context,Description";
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const body = issues
    .map((i) =>
      [i.severity.toUpperCase(), i.code, i.rule, `#${i.rowIndex}`, i.field.toUpperCase(), i.context, i.description]
        .map(esc)
        .join(","),
    )
    .join("\n");
  return `${head}\n${body}`;
};
