import { FileRow, Issue, SupportingDoc, ActivityItem, PhaseData } from "./types";

export const phases: Record<string, PhaseData> = {
  "Phase 1": {
    metadata: {
      name: "Phase 1",
      effectiveDate: "01/15/2025",
      comments: "Initial base case with bus, generator, and branch data.",
    },
    rows: [
      {
        id: "B001", recordType: "BUS", phase: "Phase 1", category: "Bus Data",
        data: { cell: "1", action: "ADD", bus: "101", name: "NORTH-SUB", baskv: "345.00", ide: "1", area: "1", zone: "1", vm: "1.0450", va: "-2.30", owner: "1", nvhi: "1.0500", nvlo: "0.9500", evhi: "1.1000", evlo: "0.9000", longName: "NORTH SUBSTATION 345KV", longitude: "-87.6298", gneg: "0.0000", bneg: "0.0000" },
        cellStatuses: {},
      },
      {
        id: "B002", recordType: "BUS", phase: "Phase 1", category: "Bus Data",
        data: { cell: "2", action: "MOD", bus: "102", name: "SOUTH-GEN", baskv: "138.00", ide: "2", area: "1", zone: "1", vm: "0.9200", va: "-8.10", owner: "1", nvhi: "1.0500", nvlo: "0.9500", evhi: "1.1000", evlo: "0.9000", longName: "SOUTH GENERATION PLANT 138KV", longitude: "-86.7842", gneg: "0.0000", bneg: "0.0000" },
        cellStatuses: { vm: { status: "error", message: "Voltage below 0.95 PU violates NERC TPL-001 steady-state criteria" } },
      },
      {
        id: "B003", recordType: "BUS", phase: "Phase 1", category: "Bus Data",
        data: { cell: "3", action: "ADD", bus: "103", name: "EAST-LOAD", baskv: "69.00", ide: "1", area: "2", zone: "2", vm: "0.9700", va: "-5.60", owner: "2", nvhi: "1.0500", nvlo: "0.9500", evhi: "1.1000", evlo: "0.9000", longName: "EAST LOAD CENTER 69KV", longitude: "-85.9301", gneg: "0.0000", bneg: "0.0000" },
        cellStatuses: { vm: { status: "warning", message: "Voltage approaching lower limit of 0.95 PU threshold" } },
      },
      {
        id: "B004", recordType: "BUS", phase: "Phase 1", category: "Bus Data",
        data: { cell: "4", action: "ADD", bus: "104", name: "WEST-TAP", baskv: "138.00", ide: "1", area: "2", zone: "2", vm: "1.0100", va: "-3.80", owner: "2", nvhi: "1.0500", nvlo: "0.9500", evhi: "1.1000", evlo: "0.9000", longName: "WEST TAP POINT 138KV", longitude: "-88.2145", gneg: "0.0000", bneg: "0.0000" },
        cellStatuses: {},
      },
      {
        id: "B005", recordType: "BUS", phase: "Phase 1", category: "Bus Data",
        data: { cell: "5", action: "ADD", bus: "105", name: "CENTER-HUB", baskv: "345.00", ide: "3", area: "1", zone: "1", vm: "1.0600", va: "-1.20", owner: "1", nvhi: "1.0500", nvlo: "0.9500", evhi: "1.1000", evlo: "0.9000", longName: "CENTER HUB STATION 345KV", longitude: "-87.1056", gneg: "0.0000", bneg: "0.0000" },
        cellStatuses: { vm: { status: "warning", message: "Voltage exceeds 1.05 PU upper operating limit" } },
      },
      {
        id: "G001", recordType: "GENERATOR", phase: "Phase 1", category: "Generator Data",
        data: { busNumber: "102", genId: "G1", pgen: "450", qgen: "120", pmax: "500", pmin: "50", mbase: "600" },
        cellStatuses: {},
      },
      {
        id: "G002", recordType: "GENERATOR", phase: "Phase 1", category: "Generator Data",
        data: { busNumber: "102", genId: "G2", pgen: "520", qgen: "180", pmax: "500", pmin: "50", mbase: "600" },
        cellStatuses: { pgen: { status: "error", message: "PGEN exceeds PMAX by 20 MW — generator dispatch infeasible" } },
      },
      {
        id: "BR001", recordType: "BRANCH", phase: "Phase 1", category: "Branch Data",
        data: { fromBus: "101", toBus: "102", circuit: "1", status: "1", rateB: "660", r0: "0.0063", x0: "0.0960", b0: "0.28", meteredEnd: "From", length: "12.4", resistance: "0.0021", reactance: "0.0320", charging: "0.42", rateA: "600" },
        cellStatuses: {},
        seasonalRatings: [{ season: "Summer", normalHigh: 600.0, emergencyHigh: 690.0 }, { season: "Winter", normalHigh: 648.0, emergencyHigh: 745.2 }, { season: "Shoulder (Sp/Fa)", normalHigh: 618.0, emergencyHigh: 710.7 }],
      },
      {
        id: "BR002", recordType: "BRANCH", phase: "Phase 1", category: "Branch Data",
        data: { fromBus: "102", toBus: "103", circuit: "1", status: "1", rateB: "330", r0: "0.0135", x0: "0.1740", b0: "0.19", meteredEnd: "To", length: "8.7", resistance: "0.0045", reactance: "0.0580", charging: "0.28", rateA: "300" },
        cellStatuses: { rateA: { status: "error", message: "Line loading at 105% of Rate A under N-1 contingency" } },
        seasonalRatings: [{ season: "Summer", normalHigh: 300.0, emergencyHigh: 345.0 }, { season: "Winter", normalHigh: 324.0, emergencyHigh: 372.6 }, { season: "Shoulder (Sp/Fa)", normalHigh: 309.0, emergencyHigh: 355.3 }],
      },
    ],
  },
  "Phase 2": {
    metadata: {
      name: "Phase 2",
      effectiveDate: "02/01/2025",
      comments: "Additional branch topology for contingency analysis.",
    },
    rows: [
      {
        id: "G003", recordType: "GENERATOR", phase: "Phase 2", category: "Generator Data",
        data: { busNumber: "105", genId: "G1", pgen: "300", qgen: "95", pmax: "400", pmin: "100", mbase: "450" },
        cellStatuses: { qgen: { status: "warning", message: "Reactive output near capability curve limit at this MW dispatch" } },
      },
      {
        id: "BR003", recordType: "BRANCH", phase: "Phase 2", category: "Branch Data",
        data: { fromBus: "103", toBus: "104", circuit: "1", status: "1", rateB: "495", r0: "0.0099", x0: "0.1230", b0: "0.23", meteredEnd: "From", length: "15.2", resistance: "0.0033", reactance: "0.0410", charging: "0.35", rateA: "450" },
        cellStatuses: { resistance: { status: "warning", message: "R/X ratio exceeds typical range for 138kV lines" } },
        seasonalRatings: [{ season: "Summer", normalHigh: 450.0, emergencyHigh: 517.5 }, { season: "Winter", normalHigh: 486.0, emergencyHigh: 558.9 }, { season: "Shoulder (Sp/Fa)", normalHigh: 463.5, emergencyHigh: 533.0 }],
      },
      {
        id: "BR004", recordType: "BRANCH", phase: "Phase 2", category: "Branch Data",
        data: { fromBus: "104", toBus: "105", circuit: "1", status: "0", rateB: "825", r0: "0.0054", x0: "0.0870", b0: "0.33", meteredEnd: "To", length: "21.6", resistance: "0.0018", reactance: "0.0290", charging: "0.50", rateA: "750" },
        cellStatuses: {},
        seasonalRatings: [{ season: "Summer", normalHigh: 750.0, emergencyHigh: 862.5 }, { season: "Winter", normalHigh: 810.0, emergencyHigh: 931.5 }, { season: "Shoulder (Sp/Fa)", normalHigh: 772.5, emergencyHigh: 888.4 }],
      },
    ],
  },
  "527_WFEC_BoswellTap": {
    metadata: {
      name: "527_WFEC_BoswellTap",
      effectiveDate: "03/15/2025",
      comments: "Sequential transformer tap ratio corrections for Bus 125840.",
    },
    rows: [
      {
        id: "T001", recordType: "TRANSFORMER", phase: "527_WFEC_BoswellTap", category: "Transformer Corrections",
        data: { fromBus: "125840", toBus: "125841", circuit: "1", tapRatio: "1.025", windingR: "0.0005", windingX: "0.0120", rateA: "500" },
        cellStatuses: {},
      },
      {
        id: "T002", recordType: "TRANSFORMER", phase: "527_WFEC_BoswellTap", category: "Transformer Corrections",
        data: { fromBus: "125840", toBus: "125842", circuit: "1", tapRatio: "0.88", windingR: "0.0008", windingX: "0.0150", rateA: "200" },
        cellStatuses: {},
        bulkGroup: "Transformer 125840 Modifications",
      },
      {
        id: "T003", recordType: "TRANSFORMER", phase: "527_WFEC_BoswellTap", category: "Transformer Corrections",
        data: { fromBus: "125840", toBus: "125843", circuit: "2", tapRatio: "1.11", windingR: "0.0006", windingX: "0.0130", rateA: "350" },
        cellStatuses: {},
        bulkGroup: "Transformer 125840 Modifications",
      },
      {
        id: "T004", recordType: "TRANSFORMER", phase: "527_WFEC_BoswellTap", category: "Transformer Corrections",
        data: { fromBus: "125840", toBus: "125844", circuit: "1", tapRatio: "1.03", windingR: "0.0007", windingX: "0.0140", rateA: "400" },
        cellStatuses: {},
        bulkGroup: "Transformer 125840 Modifications",
      },
      {
        id: "T005", recordType: "TRANSFORMER", phase: "527_WFEC_BoswellTap", category: "Transformer Corrections",
        data: { fromBus: "125840", toBus: "125845", circuit: "3", tapRatio: "0.87", windingR: "0.0009", windingX: "0.0160", rateA: "250" },
        cellStatuses: {},
        bulkGroup: "Transformer 125840 Modifications",
      },
      {
        id: "T006", recordType: "TRANSFORMER", phase: "527_WFEC_BoswellTap", category: "Transformer Corrections",
        data: { fromBus: "125840", toBus: "125846", circuit: "1", tapRatio: "1.02", windingR: "0.0005", windingX: "0.0125", rateA: "500" },
        cellStatuses: {},
        bulkGroup: "Transformer 125840 Modifications",
      },
      {
        id: "T007", recordType: "TRANSFORMER", phase: "527_WFEC_BoswellTap", category: "Transformer Corrections",
        data: { fromBus: "125840", toBus: "125847", circuit: "2", tapRatio: "0.89", windingR: "0.0010", windingX: "0.0170", rateA: "300" },
        cellStatuses: {},
        bulkGroup: "Transformer 125840 Modifications",
      },
      {
        id: "T008", recordType: "TRANSFORMER", phase: "527_WFEC_BoswellTap", category: "Transformer Corrections",
        data: { fromBus: "125840", toBus: "125848", circuit: "1", tapRatio: "1.00", windingR: "0.0006", windingX: "0.0135", rateA: "450" },
        cellStatuses: {},
        bulkGroup: "Transformer 125840 Modifications",
      },
      {
        id: "T009", recordType: "TRANSFORMER", phase: "527_WFEC_BoswellTap", category: "Transformer Corrections",
        data: { fromBus: "125840", toBus: "125849", circuit: "3", tapRatio: "1.12", windingR: "0.0011", windingX: "0.0180", rateA: "275" },
        cellStatuses: {},
        bulkGroup: "Transformer 125840 Modifications",
      },
      {
        id: "T010", recordType: "TRANSFORMER", phase: "527_WFEC_BoswellTap", category: "Transformer Corrections",
        data: { fromBus: "125840", toBus: "125850", circuit: "1", tapRatio: "0.95", windingR: "0.0007", windingX: "0.0145", rateA: "380" },
        cellStatuses: {},
        bulkGroup: "Transformer 125840 Modifications",
      },
      {
        id: "T011", recordType: "TRANSFORMER", phase: "527_WFEC_BoswellTap", category: "Transformer Corrections",
        data: { fromBus: "125840", toBus: "125851", circuit: "2", tapRatio: "0.86", windingR: "0.0012", windingX: "0.0190", rateA: "225" },
        cellStatuses: {},
        bulkGroup: "Transformer 125840 Modifications",
      },
      {
        id: "T012", recordType: "TRANSFORMER", phase: "527_WFEC_BoswellTap", category: "Transformer Corrections",
        data: { fromBus: "125840", toBus: "125852", circuit: "1", tapRatio: "1.04", windingR: "0.0006", windingX: "0.0128", rateA: "500" },
        cellStatuses: {},
        bulkGroup: "Transformer 125840 Modifications",
      },
    ],
  },
};

// Flatten all rows for generating issues
const allRows = Object.values(phases).flatMap((p) => p.rows);

export const issues: Issue[] = allRows.flatMap((row) =>
  Object.entries(row.cellStatuses)
    .filter(([, cs]) => cs.status !== "valid")
    .map(([key, cs]) => ({
      id: `ISS-${row.id}-${key}`,
      rowId: row.id,
      cellKey: key,
      recordType: row.recordType,
      phase: row.phase!,
      category: row.category!,
      fieldName: key,
      status: cs.status as "error" | "warning",
      message: cs.message!,
      dismissed: false,
      bulkGroup: row.bulkGroup,
    }))
);

export const supportingDocs: SupportingDoc[] = [
  { id: "D001", name: "PSSE RAW File v33.pdf", type: "PDF", validationStatus: "verified", uploadedAt: "2025-02-18" },
  { id: "D002", name: "Stability Analysis Report.pdf", type: "PDF", validationStatus: "verified", uploadedAt: "2025-01-10" },
  { id: "D003", name: "Interconnection Study.pdf", type: "PDF", validationStatus: "invalid_signature", uploadedAt: "2025-02-20" },
  { id: "D004", name: "Generator Test Data.xlsx", type: "XLSX", validationStatus: "pending", uploadedAt: "2025-02-22" },
];

export const activityItems: ActivityItem[] = [
  { id: "A001", type: "history", user: "System", message: "File v2.1 uploaded by jsmith@utility.com", timestamp: "2025-02-22 14:32" },
  { id: "A002", type: "comment", user: "M. Torres", message: "Generator G2 dispatch exceeds PMAX — please correct before re-running power flow.", timestamp: "2025-02-22 15:10" },
  { id: "A003", type: "history", user: "System", message: "Validation completed: 4 errors, 4 warnings found", timestamp: "2025-02-22 14:33" },
  { id: "A004", type: "comment", user: "J. Smith", message: "Working on the bus voltage violations. Will upload corrected case by EOD.", timestamp: "2025-02-22 16:45" },
  { id: "A005", type: "history", user: "System", message: "Supporting document 'Interconnection Study' flagged: invalid digital signature", timestamp: "2025-02-22 14:34" },
];
