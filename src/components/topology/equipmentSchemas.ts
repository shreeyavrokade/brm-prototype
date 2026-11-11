// Equipment Details intake — schemas, mock data, and validation rules.
import type { SubmissionStatus } from "@/components/submission/StatusBadge";

export type EquipStatus = SubmissionStatus; // "Review Needed" | "Pending Acceptance" | ...
export type Region = "Eastern" | "Western";

export interface AuditLog {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface BusRow {
  id: string;               // RO, internal record id
  busNumber: number;        // RO, 5-6 digits per region
  region: Region;           // drives validation max length
  status: EquipStatus;
  busName: string;          // RO, short name from import
  busLongName: string;      // editable, max 8 chars
  eiaPlantCode: string;     // editable, int-only
  areaId: number;           // RO
  ownerName: string;        // RO
  voltage: number;          // RO (kV)
  comments: string;         // editable, max 500
  audit: AuditLog;
  ownerScope: string;       // for IAM lock
  locked?: boolean;         // outside-user scope
}

export const FUEL_TYPES = [
  "Coal",
  "Natural Gas",
  "Nuclear",
  "Hydro",
  "Wind",
  "Solar",
  "Diesel",
  "Other",
] as const;
export type FuelType = typeof FUEL_TYPES[number] | "";

export interface GeneratorRow {
  generatorId: string;              // RO, internal record id
  status: EquipStatus;
  // RO metadata
  busId: number;
  submittalYear: number;
  responsibleEntity: string;
  region: Region;
  areaId: number;
  busKv: number;
  busNam: string;
  // Editable trio
  longName: string;
  eiaPlantCode: string;
  primaryFuelType: FuelType;
  // RO continued
  giGenNumber: string;
  pwrFlowRetirementDate: string;
  genId: string;
  secondaryFuelType: string;
  aux1BusId: string; aux1Id: string;
  aux2BusId: string; aux2Id: string;
  aux3BusId: string; aux3Id: string;
  aux4BusId: string; aux4Id: string;
  aux5BusId: string; aux5Id: string;
  // System
  comments: string;
  audit: AuditLog;
  ownerScope: string;
  isPrimaryOwner: boolean;
  locked?: boolean;
}

const today = "06/22/2026";
const audit = (who: string, modWho = who, modDate = today): AuditLog => ({
  createdBy: who, createdDate: "06/18/2026", modifiedBy: modWho, modifiedDate: modDate,
});

// Mock — rows missing from SSOT after .prj import (status: Review Needed).
export const initialBusRows: BusRow[] = [
  { id: "BUS-0001", busNumber: 527010, region: "Eastern", status: "Review Needed", busName: "OKGE01", busLongName: "", eiaPlantCode: "55471", areaId: 524, ownerName: "OKGE", voltage: 138, comments: "", audit: audit("system"), ownerScope: "OKGE" },
  { id: "BUS-0002", busNumber: 527013, region: "Eastern", status: "Review Needed", busName: "OKGE02", busLongName: "", eiaPlantCode: "55472", areaId: 524, ownerName: "OKGE", voltage: 345, comments: "", audit: audit("system"), ownerScope: "OKGE" },
  { id: "BUS-0003", busNumber: 527016, region: "Eastern", status: "Review Needed", busName: "WFEC11", busLongName: "", eiaPlantCode: "60188", areaId: 525, ownerName: "WFEC", voltage: 161, comments: "", audit: audit("system"), ownerScope: "WFEC" },
  { id: "BUS-0004", busNumber:  52701, region: "Western", status: "Review Needed", busName: "SUNC04", busLongName: "", eiaPlantCode: "61342", areaId: 612, ownerName: "SUNC", voltage:  69, comments: "", audit: audit("system"), ownerScope: "SUNC", locked: true },
  { id: "BUS-0005", busNumber: 527022, region: "Eastern", status: "Review Needed", busName: "AEPW07", busLongName: "", eiaPlantCode: "57219", areaId: 526, ownerName: "AEPW", voltage: 230, comments: "", audit: audit("system"), ownerScope: "AEPW" },
];

const genBase = (over: Partial<GeneratorRow>): GeneratorRow => ({
  generatorId: "", status: "Review Needed",
  busId: 0, submittalYear: 2026, responsibleEntity: "", region: "Eastern",
  areaId: 0, busKv: 0, busNam: "",
  longName: "", eiaPlantCode: "", primaryFuelType: "",
  giGenNumber: "", pwrFlowRetirementDate: "", genId: "", secondaryFuelType: "",
  aux1BusId: "", aux1Id: "", aux2BusId: "", aux2Id: "",
  aux3BusId: "", aux3Id: "", aux4BusId: "", aux4Id: "",
  aux5BusId: "", aux5Id: "",
  comments: "", audit: audit("system"), ownerScope: "", isPrimaryOwner: true,
  ...over,
});

export const initialGeneratorRows: GeneratorRow[] = [
  genBase({
    generatorId: "GEN-0001", busId: 527010, responsibleEntity: "OKGE", region: "Eastern",
    areaId: 524, busKv: 138, busNam: "OKGE01", giGenNumber: "GI-2024-018",
    pwrFlowRetirementDate: "—", genId: "G1", secondaryFuelType: "Distillate",
    aux1BusId: "527011", aux1Id: "AX1", aux2BusId: "527012", aux2Id: "AX2",
    ownerScope: "OKGE", isPrimaryOwner: true,
  }),
  genBase({
    generatorId: "GEN-0002", busId: 527016, responsibleEntity: "WFEC", region: "Eastern",
    areaId: 525, busKv: 161, busNam: "WFEC11", giGenNumber: "GI-2025-044",
    pwrFlowRetirementDate: "12/31/2031", genId: "G2", secondaryFuelType: "",
    aux1BusId: "527017", aux1Id: "AX1",
    ownerScope: "WFEC", isPrimaryOwner: true,
  }),
  genBase({
    generatorId: "GEN-0003", busId: 527022, responsibleEntity: "AEPW", region: "Eastern",
    areaId: 526, busKv: 230, busNam: "AEPW07", giGenNumber: "GI-2023-091",
    pwrFlowRetirementDate: "—", genId: "G1", secondaryFuelType: "Natural Gas",
    aux1BusId: "527023", aux1Id: "AX1", aux2BusId: "527024", aux2Id: "AX2",
    aux3BusId: "527025", aux3Id: "AX3",
    ownerScope: "AEPW", isPrimaryOwner: false,
  }),
  genBase({
    generatorId: "GEN-0004", busId:  52701, responsibleEntity: "SUNC", region: "Western",
    areaId: 612, busKv:  69, busNam: "SUNC04", giGenNumber: "GI-2022-007",
    pwrFlowRetirementDate: "06/30/2029", genId: "G3", secondaryFuelType: "",
    ownerScope: "SUNC", isPrimaryOwner: true, locked: true,
  }),
];

// Whether the Equipment Details tab should show a "Details Required" badge.
export const hasEquipmentDetailsRequired = (): boolean =>
  initialBusRows.some((r) => r.status === "Review Needed") ||
  initialGeneratorRows.some((r) => r.status === "Review Needed");

// Validation
export const busNameMaxLen = 8;
export const commentsMaxLen = 500;

export const validateBusName = (v: string): string | null => {
  if (v.length > busNameMaxLen) return `Invalid Data Format · max ${busNameMaxLen} chars`;
  return null;
};
export const validateBusNumber = (n: number, region: Region): string | null => {
  const len = String(n).length;
  const max = region === "Eastern" ? 6 : 5;
  if (len > max) return `Invalid Data Format · ${region} max ${max} digits`;
  return null;
};
export const validateInteger = (v: string): string | null => {
  if (v === "") return null;
  if (!/^\d+$/.test(v)) return "Invalid Data Format · integers only";
  return null;
};
export const validateNumber = (v: string): string | null => {
  if (v === "") return null;
  if (!/^-?\d+(\.\d+)?$/.test(v)) return "Invalid Data Format · numeric only";
  return null;
};
export const validateComments = (v: string): string | null =>
  v.length > commentsMaxLen ? `Invalid Data Format · max ${commentsMaxLen} chars` : null;

export const isBusRowComplete = (r: BusRow): boolean =>
  !r.locked &&
  r.busLongName.trim().length > 0 &&
  validateBusName(r.busLongName) === null &&
  validateInteger(r.eiaPlantCode) === null &&
  validateComments(r.comments) === null;

export const isGenRowComplete = (r: GeneratorRow): boolean =>
  !r.locked &&
  r.isPrimaryOwner &&
  r.longName.trim().length > 0 &&
  r.eiaPlantCode.trim().length > 0 && validateInteger(r.eiaPlantCode) === null &&
  r.primaryFuelType !== "" &&
  validateComments(r.comments) === null;
