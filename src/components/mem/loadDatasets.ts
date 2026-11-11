// Dataset schemas + mock rows for MEM Load Sections 1-3 + Reference.

import type { ColType, DatasetConfig, SectionConfig } from "./genDatasets";

const mkRows = (n: number, builder: (i: number) => Record<string, any>) =>
  Array.from({ length: n }, (_, i) => ({ id: `r${i + 1}`, ...builder(i) }));

const DEMAND_GROUPS = ["DG-AEP-1", "DG-OGE-2", "DG-WSTR-1", "DG-SPS-3", "DG-EMP-1", "DG-AEP-2"];
const AREAS = ["AEP", "OGE", "WSTR", "SPS", "EMP"];
const ZONES = ["Z10", "Z11", "Z12", "Z20", "Z21"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_KEYS = MONTHS.map((m) => m.toLowerCase());

const yearCols = (n: number, opts: Partial<{ editable: boolean; type: ColType; max: number; align: "right" | "center" }>) =>
  Array.from({ length: n }, (_, i) => ({
    key: `yr${i + 1}`,
    label: `Year ${i + 1}`,
    editable: opts.editable,
    type: opts.type ?? ("number" as ColType),
    max: opts.max,
    align: opts.align ?? ("right" as const),
  }));

const calendarYearCols = (
  start: number,
  end: number,
  opts: Partial<{ editable: boolean; type: ColType; max: number; align: "right" | "center" }>,
) =>
  Array.from({ length: end - start + 1 }, (_, i) => ({
    key: `yr${i + 1}`,
    label: String(start + i),
    editable: opts.editable,
    type: opts.type ?? ("number" as ColType),
    max: opts.max,
    align: opts.align ?? ("right" as const),
  }));

// ---------- Section 1: Powerflow Input Review (all view-only) ----------
const loadBus: DatasetConfig = {
  id: "load-bus",
  name: "Load Bus",
  viewOnly: true,
  tip:
    "The Load Bus data table maps seasonal load data at the bus level, establishing the core powerflow topology. This is vital for mapping buses to demand groups to calculate peak loads. Please review pre-populated baseline and, as necessary, use comments to report any discrepancies such as unmarked station loads.",


  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "busNumber", label: "Bus Number", type: "number" },
    { key: "busId", label: "Bus ID" },
    { key: "owner", label: "Owner" },
    { key: "loadArea", label: "Load Area" },
    { key: "busArea", label: "Bus Area" },
    { key: "zone", label: "Zone" },
    { key: "busName", label: "Bus Name" },
    { key: "scalable", label: "Scalable" },
    { key: "stationSvcLoad", label: "Station Service Load" },
    { key: "group", label: "Group" },
    ...["Y1", "Y2", "Y5", "Y10"].flatMap((y) => [
      { key: `sum${y}`, label: `Summer [${y}]`, type: "number" as ColType, align: "right" as const },
      { key: `win${y}`, label: `Winter [${y}]`, type: "number" as ColType, align: "right" as const },
    ]),
  ],
  rows: mkRows(8, (i) => {
    const base: Record<string, any> = {
      submittalYear: 2026,
      busNumber: 41000 + i,
      busId: `1`,
      owner: AREAS[i % AREAS.length],
      loadArea: AREAS[i % AREAS.length],
      busArea: AREAS[i % AREAS.length],
      zone: ZONES[i % ZONES.length],
      busName: `BUS-${41000 + i}`,
      scalable: i % 3 === 0 ? "No" : "Yes",
      stationSvcLoad: i % 4 === 0 ? "Yes" : "No",
      group: `GRP-${10 + (i % 5)}`,
    };
    ["Y1", "Y2", "Y5", "Y10"].forEach((y, yi) => {
      base[`sum${y}`] = (180 + i * 4 + yi * 6).toFixed(1);
      base[`win${y}`] = (140 + i * 3 + yi * 5).toFixed(1);
    });
    return base;
  }),
};

const peakLoad: DatasetConfig = {
  id: "peak-load",
  name: "Peak Load",
  viewOnly: true,
  tip:
    "The Peak Load data table displays calculated peak demand for your demand groups. This is vital because it aggregates seasonal bus loads to establish peak targets used in market simulations. Please review pre-populated baseline and, as necessary, use comments to report any forecast mismatches.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "demandGroup", label: "Demand Group Name" },
    { key: "parentArea", label: "Parent Area" },
    { key: "zone", label: "Zone" },
    ...yearCols(20, { type: "number" }),
  ],
  rows: mkRows(6, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      demandGroup: DEMAND_GROUPS[i % DEMAND_GROUPS.length],
      parentArea: AREAS[i % AREAS.length],
      zone: ZONES[i % ZONES.length],
    };
    for (let y = 1; y <= 20; y++) r[`yr${y}`] = (3400 + i * 80 + y * 12).toFixed(1);
    return r;
  }),
};

const stationServiceLoad: DatasetConfig = {
  id: "station-service-load",
  name: "Station Service Load",
  viewOnly: true,
  tip:

    "The Station Service Load data table tracks auxiliary power consumed at generator buses when units are offline. This is vital because these loads are excluded from peak calculations to prevent distorting net demand forecasts. Please review pre-populated baseline and, as necessary, use comments to report any discrepancies.",

  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "demandGroup", label: "Demand Group" },
    { key: "busNumber", label: "Bus Number", type: "number" },
    { key: "busId", label: "Bus ID" },
    { key: "busName", label: "Bus Name" },
    { key: "unitName", label: "Unit Name" },
  ],
  rows: mkRows(6, (i) => ({
    submittalYear: 2026,
    demandGroup: DEMAND_GROUPS[i % DEMAND_GROUPS.length],
    busNumber: 51000 + i,
    busId: "1",
    busName: `BUS-${51000 + i}`,
    unitName: ["Antelope CC1", "Cimarron WF", "Comanche GT", "Hugo CT2"][i % 4],
  })),
};

// ---------- Section 2: Factor Verification ----------
const annualLoadFactor: DatasetConfig = {
  id: "annual-load-factor",
  name: "Annual Load Factor",
  hideActions: true,
  tip:
    "The Annual Load Factor data table defines projected annual load factors for each demand group. Please review pre-populated baseline and use comments to flag anomalies. Use the Activity Panel to review row-level comments.",

  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "demandGroup", label: "Demand Group Name" },
    { key: "parentArea", label: "Parent Area" },
    { key: "zone", label: "Zone" },
    { key: "status", label: "Status" },
    ...calendarYearCols(2026, 2038, { editable: true, type: "percent", max: 100 }),
  ],
  rows: mkRows(6, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      demandGroup: [
        "Louisiana Generating/Cajun Electric",
        "AEP Southwest Operations",
        "OGE Energy Corp",
        "Westar Energy",
        "Southwestern Public Service",
        "Empire District Electric",
      ][i % 6],
      parentArea: AREAS[i % AREAS.length],
      zone: ZONES[i % ZONES.length],
      status: "Active",
    };
    for (let y = 1; y <= 13; y++) r[`yr${y}`] = (50 + ((i * 3 + y) % 35) + 0.89).toFixed(2);
    // Cells SPP modified during the prior review pass.
    if (i % 2 === 0) {
      const prev1 = (parseFloat(r.yr1) - 1.25).toFixed(2);
      const prev3 = (parseFloat(r.yr3) + 0.75).toFixed(2);
      r._spp = {
        yr1: { previous: `${prev1}%`, current: `${r.yr1}%` },
        yr3: { previous: `${prev3}%`, current: `${r.yr3}%` },
      };
    }
    return r;
  }),
};

const annualLossFactor: DatasetConfig = {
  id: "annual-loss-factor",
  name: "Annual Loss Factor",
  tip:
    "The Annual Loss Factor data table defines the projected transmission energy losses (percentages) for each demand group. This is critical because these values scale load forecasts to accurately simulate total generation requirements and market dispatch under grid losses. Please review pre-populated baseline and, as necessary, revise or delete the annual values to reflect current plans. Use comments to report any discrepancies in locked fields so SPP can resolve them.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "demandGroup", label: "Demand Group" },
    { key: "parentArea", label: "Parent Area" },
    { key: "zone", label: "Zone" },
    { key: "status", label: "Status" },
    ...yearCols(20, { editable: true, type: "percent", max: 100 }),
  ],
  rows: mkRows(6, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      demandGroup: DEMAND_GROUPS[i % DEMAND_GROUPS.length],
      parentArea: AREAS[i % AREAS.length],
      zone: ZONES[i % ZONES.length],
      status: "Active",
    };
    for (let y = 1; y <= 20; y++) r[`yr${y}`] = (3 + ((i + y) % 4) + 0.94).toFixed(2);
    return r;
  }),
};

// ---------- Section 3: Resource Plan Updates ----------
const rpPeakLoad: DatasetConfig = {
  id: "rp-peak-load",
  name: "Resource Planning Peak Load",
  tip:
    "The Resource Planning Peak Load data table captures peak demand forecasts designated for resource planning. If your resource plan projections differ from the Base Reliability baseline, please review pre-populated baseline and, as necessary, revise the annual columns. Use comments to explain variances between the baseline and your resource plan projections.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "demandGroup", label: "Demand Group" },
    { key: "parentArea", label: "Parent Area" },
    { key: "status", label: "Status" },
    ...yearCols(20, { editable: true, type: "number", max: 999999 }),
  ],
  rows: mkRows(6, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      demandGroup: DEMAND_GROUPS[i % DEMAND_GROUPS.length],
      parentArea: AREAS[i % AREAS.length],
      status: "Active",
    };
    for (let y = 1; y <= 20; y++) r[`yr${y}`] = (3200 + i * 75 + y * 11 + 0.36).toFixed(2);
    return r;
  }),
};

const rpLoadFactor: DatasetConfig = {
  id: "rp-load-factor",
  name: "Resource Planning Load Factor",
  tip:
    "The Resource Planning Load Factor data table defines annual load factors for resource planning. This is vital because these percentages scale out-year energy forecasts if your resource plans differ from the Base Reliability baseline. If your resource plan projections differ from the Base Reliability baseline, please review pre-populated baseline and, as necessary, revise the annual columns. Use comments to explain variances between the baseline and your resource plan projections.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "demandGroup", label: "Demand Group" },
    { key: "parentArea", label: "Parent Area" },
    { key: "status", label: "Status" },
    ...yearCols(20, { editable: true, type: "percent", max: 100 }),
  ],
  rows: mkRows(6, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      demandGroup: DEMAND_GROUPS[i % DEMAND_GROUPS.length],
      parentArea: AREAS[i % AREAS.length],
      status: "Active",
    };
    for (let y = 1; y <= 20; y++) r[`yr${y}`] = (55 + ((i * 2 + y) % 30) + 0.36).toFixed(2);
    return r;
  }),
};

// ---------- For Reference ----------
const ownershipLegend: DatasetConfig = {
  id: "ownership-legend",
  name: "Economic Load Ownership Legend",
  viewOnly: true,
  tip:
    "The Economic Load Ownership Legend maps owner numbers, names, and demand groups. This reference table is vital for transparency, showing how load ownership aligns across planning zones and pricing entities. This screen is strictly view-only to protect structural mappings.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "ownerNumber", label: "Owner Number", type: "number" },
    { key: "ownerName", label: "Owner Name" },
    { key: "ownerCheck", label: "Owner Check" },
    { key: "expandedOwnerName", label: "Expanded Owner Name" },
    { key: "busAreaNumber", label: "Bus Area Number", type: "number" },
    { key: "zone", label: "Zone" },
    { key: "loadId", label: "Load ID" },
    { key: "demandGroup", label: "Demand Group" },
  ],
  rows: mkRows(8, (i) => ({
    submittalYear: 2026,
    ownerNumber: 100 + i,
    ownerName: AREAS[i % AREAS.length],
    ownerCheck: i % 2 === 0 ? "Y" : "N",
    expandedOwnerName: `${AREAS[i % AREAS.length]} Holdings`,
    busAreaNumber: 520 + (i % 4),
    zone: ZONES[i % ZONES.length],
    loadId: ["F1", "O2", "V3", "OM", "OW", "nonV1"][i % 6],
    demandGroup: DEMAND_GROUPS[i % DEMAND_GROUPS.length],
  })),
};

const hourlyProfile: DatasetConfig = {
  id: "hourly-profile",
  name: "Hourly Profile",
  viewOnly: true,
  tip:
    "The Hourly Profile data table displays hour-by-hour load shapes for each demand group. This is vital because these shapes define the seasonal demand patterns used to simulate realistic grid dispatch. Please review pre-populated curves and, as necessary, use comments to submit necessary adjustments.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "demandGroup", label: "Demand Group" },
    { key: "parentArea", label: "Parent Area" },
    { key: "hourlyProfile", label: "Hourly Profile" },
  ],
  rows: mkRows(6, (i) => ({
    submittalYear: 2026,
    demandGroup: DEMAND_GROUPS[i % DEMAND_GROUPS.length],
    parentArea: AREAS[i % AREAS.length],
    hourlyProfile: `PROFILE-${100 + i}`,
  })),
};

const monthlyPeakEnergy: DatasetConfig = {
  id: "monthly-peak-energy",
  name: "Monthly Peak & Energy",
  viewOnly: true,
  tip:
    "The Monthly Peak & Energy data table displays monthly peak demand and energy allocations for each demand group. These monthly values establish the seasonal demand curves that dictate hourly dispatch and resource adequacy in market simulations. Please review pre-populated baseline and, as necessary, use comments to flag anomalies.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "demandGroup", label: "Demand Group" },
    { key: "type", label: "Type" },
    ...MONTH_KEYS.map((k, i) => ({
      key: k,
      label: MONTHS[i],
      type: "percent" as ColType,
      align: "center" as const,
    })),
  ],
  rows: mkRows(8, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      demandGroup: DEMAND_GROUPS[i % DEMAND_GROUPS.length],
      type: i % 2 === 0 ? "Monthly Peak" : "Monthly Energy",
    };
    MONTH_KEYS.forEach((k, mi) => (r[k] = (70 + ((i + mi) % 25) + 0.88).toFixed(2)));
    return r;
  }),
};

export const LOAD_SECTIONS: SectionConfig[] = [
  {
    id: "load-s1",
    label: "Section 1: Powerflow Input Review",
    datasets: [loadBus, peakLoad, stationServiceLoad],
  },
  {
    id: "load-s2",
    label: "Section 2: Factor Verification",
    datasets: [annualLoadFactor, annualLossFactor],
  },
  {
    id: "load-s3",
    label: "Section 3: Resource Plan Updates",
    datasets: [rpPeakLoad, rpLoadFactor],
  },
  {
    id: "load-ref",
    label: "For Reference",
    datasets: [ownershipLegend, hourlyProfile, monthlyPeakEnergy],
  },
];
