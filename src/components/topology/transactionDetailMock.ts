import { brand } from "@/config/brand";

// Mock ledger rows for the Transactions File Inspector drill-down

export type CellAction = "ADD" | "MOD" | "DEL" | "NONE";

export interface DeltaValue {
  prev?: string | number;
  next: string | number;
}

export interface TxLedgerRow {
  id: string; // primary ID
  noChange: boolean;
  submittalYear: number;
  action: CellAction;
  disposition: string;
  changesetId: string;
  prevChangesetId: string;
  recordKey: string;

  responsibleEntity: string;
  reAck: boolean;
  confirmingEntity: string;
  ceAck: boolean;
  regionName: string;
  fromAreaName: string;
  fromAreaId: string;
  attr1: string;
  toAreaName: string;
  toAreaId: string;
  attr2: string;

  oasisNumber: string;
  linkNumber: string;
  primaryFuel: string;
  secondaryFuel: string;
  plant: string;
  startTime: string; // DD MMM YYYY HH:mm
  stopTime: string;
  mwCapacity: number | DeltaValue;
  rollOverRights: boolean;
  scenario0Scalable: boolean;
  firm: boolean;
  relatedReference: string;

  s27G: number;
  s27S: number;
  s27F: number;
  s27W: number;
  s28G: number;
  s28L: number;
  s28S: number;
  s28F: number;
  s28W: number;
  s29L: number;
  s29S: number;
  s31L: number;
  s31S: number;
  s31SH: number;
  s31W: number;
  s36S: number;
  s36W: number;
  s36L: number;
}

const dispositions = ["Pending", "Confirmed", "Under Review", "Acknowledged", "Returned"];
const entities = [...new Set([brand.clientCode, "MISO", "WFEC", "Westar", "OG&E", "KCP&L", "AECI", "ERCOT"])];
const regions = ["Eastern", "Central", "Southern", "Northern"];
const fuels = ["Natural Gas", "Coal", "Wind", "Solar", "Hydro", "Nuclear"];

function r<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

export const txLedgerRows: TxLedgerRow[] = Array.from({ length: 24 }).map((_, i) => {
  const action: CellAction = i % 7 === 0 ? "MOD" : i % 11 === 0 ? "ADD" : i % 13 === 0 ? "DEL" : "NONE";
  const baseMW = 50 + i * 12.5;
  const mwCapacity: number | DeltaValue =
    action === "MOD" ? { prev: baseMW, next: baseMW + 25 } : baseMW;
  return {
    id: `TX-${String(10001 + i).padStart(5, "0")}`,
    noChange: action === "NONE",
    submittalYear: 2024,
    action,
    disposition: r(dispositions, i),
    changesetId: `CHG-${2400 + i}`,
    prevChangesetId: `CHG-${2300 + i}`,
    recordKey: `RK-${i + 1}-A`,
    responsibleEntity: r(entities, i),
    reAck: i % 3 !== 0,
    confirmingEntity: r(entities, i + 2),
    ceAck: i % 4 !== 0,
    regionName: r(regions, i),
    fromAreaName: `Area ${r(["North", "South", "East", "West"], i)}`,
    fromAreaId: `A${100 + i}`,
    attr1: `ATT-${i}-A`,
    toAreaName: `Area ${r(["Alpha", "Beta", "Gamma", "Delta"], i + 1)}`,
    toAreaId: `A${200 + i}`,
    attr2: `ATT-${i}-B`,
    oasisNumber: `OASIS-${70000 + i}`,
    linkNumber: `LNK-${500 + i}`,
    primaryFuel: r(fuels, i),
    secondaryFuel: r(fuels, i + 3),
    plant: `Plant ${String.fromCharCode(65 + (i % 26))}`,
    startTime: `01 Mar 2024 ${String((i % 24)).padStart(2, "0")}:00`,
    stopTime: `31 Mar 2024 ${String((i % 24)).padStart(2, "0")}:00`,
    mwCapacity,
    rollOverRights: i % 2 === 0,
    scenario0Scalable: i % 3 === 0,
    firm: i % 2 === 1,
    relatedReference: `REF-${i + 1}`,
    s27G: 10 + i,
    s27S: 12 + i,
    s27F: 14 + i,
    s27W: 11 + i,
    s28G: 20 + i,
    s28L: 18 + i,
    s28S: 22 + i,
    s28F: 24 + i,
    s28W: 21 + i,
    s29L: 30 + i,
    s29S: 32 + i,
    s31L: 40 + i,
    s31S: 42 + i,
    s31SH: 44 + i,
    s31W: 41 + i,
    s36S: 52 + i,
    s36W: 51 + i,
    s36L: 50 + i,
  };
});
