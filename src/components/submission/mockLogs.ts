export type ParserError = {
  id: string;
  line?: number;
  field?: string;
  severity: "error" | "warning";
  message: string;
};

export type ValidationWarning = {
  id: string;
  asset?: string;
  /** Identifier used to cross-highlight the matching row in the data grid. */
  rowRef?: string;
  category: "Thermal" | "Voltage" | "Stability" | "Topology" | "Dispatch";
  severity: "error" | "warning" | "info";
  message: string;
};

// Mock structural / formatting issues surfaced by the intake Parser
export const parserLogFixture: Record<string, ParserError[]> = {
  default: [
    { id: "P-101", line: 1284, field: "RATE_A", severity: "error", message: "Non-numeric value 'N/A' in Rate A column — expected MVA decimal." },
    { id: "P-102", line: 1612, field: "WND_IND", severity: "warning", message: "Winding indicator missing for 3-winding transformer record; defaulted to 1." },
  ],
};

// Mock contextual engineering warnings surfaced by AI Validation
export const validationLogFixture: Record<string, ValidationWarning[]> = {
  default: [
    { id: "V-201", asset: "TL-345-117", rowRef: "TL-345-117", category: "Thermal", severity: "warning", message: "Summer NORM rating is 8% below adjacent segment — verify conductor temperature assumption." },
    { id: "V-202", asset: "BUS-104",    rowRef: "BUS-104",    category: "Voltage", severity: "info",    message: "Voltage schedule deviates from neighbouring control area baseline by 0.03 PU." },
  ],
  // Profiles fixture references assetIds emitted by generateProfileSeries
  "PRJ-2026-P4": [
    { id: "V-301", asset: "P4-AST-02", rowRef: "P4-AST-02", category: "Dispatch", severity: "warning", message: "MW target exceeds nameplate during hour 16 ramp — confirm scaling factor." },
    { id: "V-302", asset: "P4-AST-03", rowRef: "P4-AST-03", category: "Stability", severity: "error", message: "Device control profile missing reactive support setpoint for peak interval." },
  ],
};

export const getParserLog = (id: string) => parserLogFixture[id] ?? parserLogFixture.default;
export const getValidationLog = (id: string) => validationLogFixture[id] ?? validationLogFixture.default;
