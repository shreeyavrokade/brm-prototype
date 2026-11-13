import { brand } from "@/config/brand";

// Dataset schemas + mock rows for MEM Gen Sections 1-3 + Reference.

export type ColType =
  | "text"
  | "number"
  | "date"
  | "percent"
  | "currency"
  | "select";

export interface ColumnDef {
  key: string;
  label: string;
  editable?: boolean;
  type?: ColType;
  options?: string[];
  max?: number;
  required?: boolean;
  align?: "left" | "right" | "center";
  width?: string;
}

export interface DatasetConfig {
  id: string;
  name: string;
  viewOnly?: boolean;
  crud?: boolean; // allow add/delete rows
  hideActions?: boolean; // hide trailing Actions column entirely
  tip: string;
  columns: ColumnDef[];
  rows: Record<string, any>[];
  newRowDefaults?: Record<string, any>;
}

export interface SectionConfig {
  id: string;
  label: string;
  datasets: DatasetConfig[];
}

// ---------- helpers ----------
const mkRows = (n: number, builder: (i: number) => Record<string, any>) =>
  Array.from({ length: n }, (_, i) => ({ id: `r${i + 1}`, ...builder(i) }));

const UNITS = ["Antelope CC1", "Cimarron WF", "Comanche GT", "Elk City WF", "Greenwood CC", "Hugo CT2", "Latan ST3", "OG&E Solar"];
const AREAS = ["N", "S", "E", "W"].map((d) => `${brand.clientCode}-${d}`);
const CATEGORIES = ["Combined Cycle", "Wind", "Gas Turbine", "Steam", "Solar", "Hydro"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_KEYS = MONTHS.map((m) => m.toLowerCase());

// ---------- Section 1 ----------
const generator: DatasetConfig = {
  id: "generator",
  name: "Generator",
  tip:
    "The Generator data table establishes your resources, serving as the vital foundation for downstream economic profiles. As necessary, you may revise the commissioning and retirement dates, but cannot add or delete new rows. Please use comments to report any discrepancies in locked fields so " + brand.clientShortName + " can resolve them.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "unitName", label: "Unit Name" },
    { key: "area", label: "Area" },
    { key: "shortName", label: "Short Name" },
    { key: "unitNumber", label: "Unit Number", type: "number" },
    { key: "category", label: "Category" },
    { key: "maxCap", label: "Max Capacity (MW)", type: "number", align: "right" },
    { key: "giNumber", label: "GI Number" },
    { key: "mustRun", label: "Must Run Status" },
    { key: "nameChange", label: "Unit Name Change" },
    { key: "status", label: "Status" },
    { key: "brrDate", label: "Base Reliability Retirement Date", editable: true, type: "date" },
    { key: "commDate", label: "Commission Date", editable: true, type: "date" },
    { key: "mf1Date", label: "Market Future 1 Retirement Date", editable: true, type: "date" },
    { key: "mf2Date", label: "Market Future 2 Retirement Date", editable: true, type: "date" },
  ],
  rows: mkRows(8, (i) => ({
    submittalYear: 2026,
    unitName: UNITS[i % UNITS.length],
    area: AREAS[i % AREAS.length],
    shortName: `U${100 + i}`,
    unitNumber: i + 1,
    category: CATEGORIES[i % CATEGORIES.length],
    maxCap: (220 + i * 17).toFixed(1),
    giNumber: `GI-${4500 + i}`,
    mustRun: i % 3 === 0 ? "Yes" : "No",
    nameChange: "No",
    status: "Active",
    brrDate: "",
    commDate: i % 3 === 0 ? "2015-04-01" : "2014-06-15",
    mf1Date: i % 4 === 1 ? "2032-12-31" : "",
    mf2Date: "",
    // Cells SPP modified during the prior review pass.
    _spp:
      i % 3 === 0
        ? { commDate: { previous: "2014-06-15", current: "2015-04-01" } }
        : i % 4 === 1
        ? { mf1Date: { previous: "", current: "2032-12-31" } }
        : undefined,
  })),
};

const generatorBus: DatasetConfig = {
  id: "generator-bus",
  name: "Generator Bus",
  viewOnly: true,
  tip:
    "The Generator Bus table maps your resources to their physical interconnection points on the grid. This is vital for establishing the model's structural scaffolding and validating powerflow topology. These mappings are view-only to protect grid integrity.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "machineBus", label: "Machine Bus" },
    { key: "machineId", label: "Machine ID" },
    { key: "bus", label: "Bus" },
    { key: "unitName", label: "Unit Name" },
    { key: "areaNumber", label: "Area Number", type: "number" },
    ...["Y1", "Y2", "Y5", "Y10"].flatMap((y) => [
      { key: `pmaxSum${y}`, label: `Pmax Summer [${y}]`, type: "number" as ColType, align: "right" as const },
      { key: `pminSum${y}`, label: `Pmin Summer [${y}]`, type: "number" as ColType, align: "right" as const },
      { key: `pmaxWin${y}`, label: `Pmax Winter [${y}]`, type: "number" as ColType, align: "right" as const },
      { key: `pminWin${y}`, label: `Pmin Winter [${y}]`, type: "number" as ColType, align: "right" as const },
    ]),
  ],
  rows: mkRows(8, (i) => {
    const base: Record<string, any> = {
      submittalYear: 2026,
      machineBus: 51000 + i,
      machineId: "1",
      bus: 51000 + i,
      unitName: UNITS[i % UNITS.length],
      areaNumber: 520 + (i % 4),
    };
    ["Y1", "Y2", "Y5", "Y10"].forEach((y, yi) => {
      base[`pmaxSum${y}`] = (200 + i * 5 + yi * 3).toFixed(1);
      base[`pminSum${y}`] = (40 + i).toFixed(1);
      base[`pmaxWin${y}`] = (210 + i * 5 + yi * 3).toFixed(1);
      base[`pminWin${y}`] = (42 + i).toFixed(1);
    });
    return base;
  }),
};

const annualProfiles: DatasetConfig = {
  id: "annual-profiles",
  name: "Annual Profiles",
  tip:
    "The Annual Profiles data table defines monthly generator limits. This is vital because the highest monthly value automatically calculates your unit's overall maximum capacity in market simulations. Please review pre-populated prior-year values and, as necessary, revise the month columns to reflect upcoming plans. Use comments to report any discrepancies in locked fields so " + brand.clientShortName + " can resolve them.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "unitName", label: "Unit Name" },
    { key: "category", label: "Category" },
    { key: "area", label: "Generator Area" },
    { key: "profileName", label: "MaxCap Profile Name" },
    { key: "limitedOp", label: "Limited Annual Operation (Yes/No)" },
    { key: "maxCap", label: "Max Capacity (MW)", type: "number", align: "right" },
    ...MONTH_KEYS.map((k, i) => ({
      key: k,
      label: MONTHS[i],
      editable: true,
      type: "number" as ColType,
      max: 999999,
      align: "right" as const,
    })),
  ],
  rows: mkRows(8, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      unitName: UNITS[i % UNITS.length],
      category: CATEGORIES[i % CATEGORIES.length],
      area: AREAS[i % AREAS.length],
      profileName: `PROF-${100 + i}`,
      limitedOp: i % 4 === 0 ? "Yes" : "No",
      maxCap: (220 + i * 17).toFixed(1),
    };
    MONTH_KEYS.forEach((k, mi) => (r[k] = (180 + ((i * 7 + mi * 11) % 60)).toString()));
    return r;
  }),
};

const effluents: DatasetConfig = {
  id: "effluents",
  name: "Effluents",
  viewOnly: true,
  tip:
    "The Effluent data table tracks generator-specific environmental emission rates, which are critical for simulating regulatory compliance and dispatch costs in economic models. These technical parameters are view-only to protect model structure. Please review the baseline data and, as necessary, use comments to report any discrepancies.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "unitName", label: "Unit Name" },
    { key: "category", label: "Category" },
    { key: "area", label: "Generator Area" },
    { key: "effluent", label: "Generator Effluent" },
    { key: "rate", label: "Gross Emission Rate (lbs/MMBtu)", type: "number", align: "right" },
    { key: "status", label: "Status" },
  ],
  rows: mkRows(8, (i) => ({
    submittalYear: 2026,
    unitName: UNITS[i % UNITS.length],
    category: CATEGORIES[i % CATEGORIES.length],
    area: AREAS[i % AREAS.length],
    effluent: ["CO2", "NOx", "SO2", "Hg"][i % 4],
    rate: (0.12 + i * 0.07).toFixed(3),
    status: "Active",
  })),
};

// ---------- Section 2 ----------
const otherEcon: DatasetConfig = {
  id: "other-economic",
  name: "Other Economic Parameters",
  tip:
    "The Other Economic Parameters table defines your generators' operating limits and maintenance costs. This is vital because seasonal minimum capacities and O&M rates directly determine unit commitment and dispatch in market simulations. Please review pre-populated baseline and, as necessary, revise the seasonal minimums and O&M values but you cannot add or delete new rows. Use comments to report any discrepancies in locked fields so " + brand.clientShortName + " can resolve them.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "unitName", label: "Unit Name" },
    { key: "category", label: "Category" },
    { key: "area", label: "Generator Area" },
    { key: "maxCap", label: "Maximum Capacity (MW)", type: "number", align: "right" },
    { key: "annualMaintHrs", label: "Annual Maintenance Hours", type: "number", align: "right" },
    { key: "minRunTime", label: "Minimum Run Time (Hours)", type: "number", align: "right" },
    { key: "status", label: "Status" },
    { key: "sumMinCap", label: "Summer Minimum Capacity (%)", editable: true, type: "percent", max: 100, align: "right" },
    { key: "winMinCap", label: "Winter Minimum Capacity (%)", editable: true, type: "percent", max: 100, align: "right" },
    { key: "varOM", label: "Variable O&M ($/MWh)", editable: true, type: "currency", align: "right" },
    { key: "fixedOM", label: "Fixed O&M ($/kW-yr)", editable: true, type: "currency", align: "right" },
  ],
  rows: mkRows(8, (i) => ({
    submittalYear: 2026,
    unitName: UNITS[i % UNITS.length],
    category: CATEGORIES[i % CATEGORIES.length],
    area: AREAS[i % AREAS.length],
    maxCap: (220 + i * 17).toFixed(1),
    annualMaintHrs: 240 + i * 12,
    minRunTime: 4 + (i % 6),
    status: "Active",
    sumMinCap: (40 + i).toFixed(2),
    winMinCap: (44 + i).toFixed(2),
    varOM: (2.15 + i * 0.3).toFixed(2),
    fixedOM: (0.62 + i * 0.05).toFixed(2),
  })),
};

const fuelForecast: DatasetConfig = {
  id: "fuel-forecast",
  name: "Fuel Forecast Usage",
  viewOnly: true,
  tip:
    "The Fuel Forecast Usage data table maps your generation resources to specific fuel price forecasts. This is critical because fuel costs directly drive variable production expenses and unit dispatch order in economic simulations. Please review the baseline data and, as necessary, use comments to report any discrepancies.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "unitName", label: "Unit Name" },
    { key: "area", label: "Generator Area" },
    { key: "category", label: "Category" },
    { key: "fuelForecast", label: "Fuel Forecast" },
    { key: "fuelUsage", label: "Fuel Usage (%)", type: "percent", align: "right" },
    { key: "status", label: "Status" },
  ],
  rows: mkRows(8, (i) => ({
    submittalYear: 2026,
    unitName: UNITS[i % UNITS.length],
    area: AREAS[i % AREAS.length],
    category: CATEGORIES[i % CATEGORIES.length],
    fuelForecast: ["NG-Henry", "Coal-PRB", "Wind-N/A", "Solar-N/A"][i % 4],
    fuelUsage: (100 - (i % 5) * 3).toFixed(2),
    status: "Active",
  })),
};

const ownership: DatasetConfig = {
  id: "ownership",
  name: "Ownership and Accreditation",
  tip:
    "The Ownership and Accreditation data table defines generator ownership shares and renewable accreditation parameters. This is critical for accurate cost accounting and resource adequacy tracking in market simulations. Please review pre-populated baseline and, as necessary, revise the firm service, accreditation, and tax credit fields, but you cannot add or delete new rows. Use comments to report any discrepancies in locked fields so " + brand.clientShortName + " can resolve them.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "unitName", label: "Unit Name" },
    { key: "area", label: "Generator Area" },
    { key: "owner", label: "Generator Owner" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    { key: "firmService", label: "FirmService (MW)", editable: true, type: "number", align: "right" },
    {
      key: "unitSpecificSales",
      label: "Unit/Plant Specific Sales to Other Companies",
      editable: true,
      type: "select",
      options: ["Yes", "No"],
    },
    { key: "renewable", label: "Renewable Accreditation (%)", editable: true, type: "percent", max: 100, align: "right" },
    {
      key: "ptcItc",
      label: "Subject to PTC or ITC?",
      editable: true,
      type: "select",
      options: ["", "PTC", "ITC"],
    },
    ...Array.from({ length: 20 }, (_, i) => ({
      key: `yr${i + 1}`,
      label: `Year ${i + 1}`,
      editable: true,
      type: "percent" as ColType,
      max: 100,
      align: "right" as const,
    })),
  ],
  rows: mkRows(8, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      unitName: UNITS[i % UNITS.length],
      area: AREAS[i % AREAS.length],
      owner: ["AEP", "OG&E", "Westar", "SPS", "Empire"][i % 5],
      category: CATEGORIES[i % CATEGORIES.length],
      status: "Active",
      firmService: 100 + i * 10,
      unitSpecificSales: i % 2 === 0 ? "No" : "Yes",
      renewable: i % 3 === 0 ? "95.50" : "0.00",
      ptcItc: i % 4 === 0 ? "PTC" : i % 4 === 1 ? "ITC" : "",
    };
    for (let y = 1; y <= 20; y++) r[`yr${y}`] = (50 + ((i * 5 + y * 2) % 45)).toFixed(2);
    return r;
  }),
};

const capacitySegments: DatasetConfig = {
  id: "capacity-segments",
  name: "Capacity Segments",
  viewOnly: true,
  tip:
    "The Capacity Segments data table defines incremental dispatch blocks for your generators. This is vital because these segments directly determine unit commitment and economic dispatch order in market simulations. These technical parameters are view-only to protect model structure. Please review the baseline data and, as necessary, use comments to report any discrepancies.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "unitName", label: "Unit Name" },
    { key: "area", label: "Generator Area" },
    { key: "minCapPct", label: "Min Cap (%)", type: "percent", align: "right" },
    { key: "minCapMW", label: "Min Cap (MW)", type: "number", align: "right" },
    { key: "cap2", label: "Cap 2 (MW)", type: "number", align: "right" },
    { key: "cap3", label: "Cap 3 (MW)", type: "number", align: "right" },
    { key: "cap4", label: "Cap 4 (MW)", type: "number", align: "right" },
    { key: "cap5", label: "Cap 5 (MW)", type: "number", align: "right" },
    { key: "maxCap", label: "Maximum Capacity (MW)", type: "number", align: "right" },
    { key: "status", label: "Status" },
  ],
  rows: mkRows(8, (i) => ({
    submittalYear: 2026,
    unitName: UNITS[i % UNITS.length],
    area: AREAS[i % AREAS.length],
    minCapPct: (20 + i).toFixed(2),
    minCapMW: (40 + i * 3).toFixed(1),
    cap2: (80 + i * 4).toFixed(1),
    cap3: (120 + i * 5).toFixed(1),
    cap4: (170 + i * 6).toFixed(1),
    cap5: (200 + i * 7).toFixed(1),
    maxCap: (220 + i * 17).toFixed(1),
    status: "Active",
  })),
};

const hydroEnergy: DatasetConfig = {
  id: "hydro-energy",
  name: "Hydro Energy Limits",
  tip:
    "The Hydro Energy Limits data table defines your hydro units' annual energy boundaries. This is critical because these limits directly constrain hourly hydro dispatch and capacity factors in market simulations. Please review pre-populated baseline and, as necessary, revise the the Annual Energy (MWh) field to reflect upcoming limits, but you cannot add or delete new rows. Use comments to report any discrepancies in locked fields so " + brand.clientShortName + " can resolve them.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "unitName", label: "Unit Name" },
    { key: "area", label: "Generator Area" },
    { key: "capacityFactor", label: "Capacity Factor", type: "percent", align: "right" },
    ...MONTH_KEYS.map((k, i) => ({
      key: k,
      label: MONTHS[i],
      type: "percent" as ColType,
      align: "right" as const,
    })),
    { key: "status", label: "Status" },
    {
      key: "annualEnergy",
      label: "Annual Energy (MWh)",
      editable: true,
      type: "number",
      required: true,
      align: "right" as const,
    },
  ],
  rows: mkRows(6, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      unitName: `Hydro Plant ${i + 1}`,
      area: AREAS[i % AREAS.length],
      capacityFactor: (35 + i * 2).toFixed(2),
      status: "Active",
      annualEnergy: (450000 + i * 12000).toString(),
    };
    MONTH_KEYS.forEach((k, mi) => (r[k] = (8 + ((i + mi) % 5)).toFixed(2)));
    return r;
  }),
};

// ---------- Section 3: Contracts ----------
const fleetPPA: DatasetConfig = {
  id: "fleet-ppa",
  name: "Fleet Power Purchase Agreement",
  crud: true,
  tip:
    "The Fleet Power Purchase Agreement data table tracks capacity transfers and contract terms between areas. This is critical for modeling regional energy flows and avoiding resource double-counting in market simulations. Please review pre-populated baseline and, as necessary, add, modify, or delete PPA records to ensure the baseline matches your current fleet contractual obligations. Use comments to report any discrepancies in locked fields so " + brand.clientShortName + " can resolve them.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "pricingZoneFrom", label: "Pricing Zone From" },
    { key: "pricingZoneTo", label: "Pricing Zone To" },
    { key: "status", label: "Status" },
    { key: "areaNameFrom", label: "Area Name From", editable: true, type: "text", max: 50 },
    { key: "areaNameTo", label: "Area Name To", editable: true, type: "text", max: 50 },
    {
      key: "capacityType",
      label: "Capacity Type",
      editable: true,
      type: "select",
      options: ["Hydro", "Wind", "N/A"],
    },
    { key: "capacityMW", label: "Capacity (MW)", editable: true, type: "number", max: 9999999, align: "right" },
    { key: "endDate", label: "End Date", editable: true, type: "date" },
    {
      key: "modifierType",
      label: "Modifier Type",
      editable: true,
      type: "select",
      options: ["Capacity Accreditation", "Load Reduction"],
    },
  ],
  rows: mkRows(6, (i) => ({
    submittalYear: 2026,
    pricingZoneFrom: `Z${10 + (i % 4)}`,
    pricingZoneTo: `Z${20 + (i % 4)}`,
    status: "Active",
    areaNameFrom: AREAS[i % AREAS.length],
    areaNameTo: AREAS[(i + 1) % AREAS.length],
    capacityType: ["Hydro", "Wind", "N/A"][i % 3],
    capacityMW: (150 + i * 25).toString(),
    endDate: `203${i % 9}-12-31`,
    modifierType: i % 2 === 0 ? "Capacity Accreditation" : "Load Reduction",
  })),
  newRowDefaults: {
    submittalYear: 2026,
    pricingZoneFrom: "—",
    pricingZoneTo: "—",
    status: "Draft",
    areaNameFrom: "",
    areaNameTo: "",
    capacityType: "N/A",
    capacityMW: "",
    endDate: "",
    modifierType: "Capacity Accreditation",
  },
};

const hydroOwnership: DatasetConfig = {
  id: "hydro-ownership",
  name: "Hydro Unit Ownership",
  tip:
    "The Hydro Unit Ownership data table defines monthly ownership shares for hydro resources. This is vital for accurate capacity accounting and cost-allocation tracking. Please review pre-populated baseline and, as necessary, revise the monthly columns to reflect seasonal ownership splits, but you cannot add or delete new rows. Use comments to report any discrepancies in locked fields so " + brand.clientShortName + " can resolve them.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "unitName", label: "Unit Name" },
    { key: "category", label: "Category" },
    { key: "area", label: "Generator Area" },
    { key: "owner", label: "Generator Owner" },
    { key: "demandGroup", label: "Demand Group" },
    { key: "status", label: "Status" },
    ...MONTH_KEYS.map((k, i) => ({
      key: k,
      label: MONTHS[i],
      editable: true,
      type: "percent" as ColType,
      max: 100,
      align: "right" as const,
    })),
  ],
  rows: mkRows(6, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      unitName: `Hydro Plant ${i + 1}`,
      category: "Hydro",
      area: AREAS[i % AREAS.length],
      owner: ["AEP", "OG&E", "Westar"][i % 3],
      demandGroup: `DG-${100 + i}`,
      status: "Active",
    };
    MONTH_KEYS.forEach((k, mi) => (r[k] = (8 + ((i * 3 + mi) % 8) + 0.42).toFixed(2)));
    return r;
  }),
};

// ---------- For Reference ----------
const curtailment: DatasetConfig = {
  id: "curtailment",
  name: "Curtailment",
  viewOnly: true,
  tip:
    "The Curtailment table outlines generator-specific output limits. This data table is view-only to protect grid integrity.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "unitName", label: "Unit Name" },
    { key: "category", label: "Category" },
    { key: "area", label: "Generator Area" },
    { key: "constructionStart", label: "Construction Start Date" },
    { key: "ptcPct", label: "PTC Percentage", type: "percent", align: "right" },
    ...Array.from({ length: 20 }, (_, i) => ({
      key: `yr${i + 1}`,
      label: `Year ${i + 1}`,
      type: "number" as ColType,
      align: "center" as const,
    })),
  ],
  rows: mkRows(6, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      unitName: UNITS[i % UNITS.length],
      category: CATEGORIES[i % CATEGORIES.length],
      area: AREAS[i % AREAS.length],
      constructionStart: `201${i % 9}-04-${10 + (i % 18)}`,
      ptcPct: (60 - i * 5).toFixed(2),
    };
    for (let y = 1; y <= 20; y++) r[`yr${y}`] = ((i + y) % 15).toString();
    return r;
  }),
};

const effluentDef: DatasetConfig = {
  id: "effluent-definition",
  name: "Effluent Definition",
  viewOnly: true,
  tip:
    "The Effluent Definition data table is an informational reference outlining standard environmental emission parameters. This data is important because it establishes the baseline compliance rules used to calculate emission-related dispatch costs in economic simulations. This data table is view-only to protect grid integrity.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "effluent", label: "Effluent" },
    ...MONTH_KEYS.map((k, i) => ({
      key: k,
      label: MONTHS[i],
      type: "currency" as ColType,
      align: "right" as const,
    })),
  ],
  rows: mkRows(5, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      effluent: ["CO2", "NOx", "SO2", "Hg", "PM2.5"][i % 5],
    };
    MONTH_KEYS.forEach((k, mi) => (r[k] = (20 + ((i + mi) % 12) + 0.07).toFixed(2)));
    return r;
  }),
};

const fuelDef: DatasetConfig = {
  id: "fuel-definition",
  name: "Fuel Definition",
  viewOnly: true,
  tip:
    "The Fuel Definition data table is an informational reference outlining default fuel types and properties. It is important because these parameters establish the baseline fuel cost assumptions that drive unit commitment and dispatch. This data table is view-only to protect grid integrity.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "fuelUnit", label: "Fuel Unit" },
    { key: "fuelIndex", label: "Fuel Index" },
    { key: "priceEscalation", label: "Price Escalation", type: "percent", align: "right" },
    { key: "avgHeatContent", label: "Average Heat Content", type: "number", align: "right" },
    ...Array.from({ length: 20 }, (_, i) => ({
      key: `yr${i + 1}`,
      label: `Year ${i + 1}`,
      type: "currency" as ColType,
      align: "right" as const,
    })),
  ],
  rows: mkRows(7, (i) => {
    const cats = ["COAL", "GAS", "HYDROGEN", "OIL-H", "OIL-L", "OTHER", "URAN"];
    const units = ["TONS", "MCF", "BBLS", "INTR", "UNIT"];
    const r: Record<string, any> = {
      submittalYear: 2026,
      name: `${cats[i]}-${100 + i}`,
      category: cats[i],
      fuelUnit: units[i % units.length],
      fuelIndex: `IDX-${i + 1}`,
      priceEscalation: (1.5 + i * 0.4).toFixed(2),
      avgHeatContent: (10000 + i * 250).toFixed(0),
    };
    for (let y = 1; y <= 20; y++) r[`yr${y}`] = (2.5 + ((i + y) % 7) * 0.17).toFixed(2);
    return r;
  }),
};

const heatRate: DatasetConfig = {
  id: "heat-rate",
  name: "Heat Rate",
  viewOnly: true,
  tip:
    "The Heat Rate data table defines your thermal generators' efficiency curves. This is vital because heat rates directly drive fuel consumption and dispatch order in market simulations. This data table is view-only to protect grid integrity.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "unitName", label: "Unit Name" },
    { key: "category", label: "Category" },
    { key: "area", label: "Generator Area" },
    { key: "heatRate", label: "Heat Rate (MMBtu/MWh)", type: "number", align: "right" },
    { key: "profileType", label: "Profile Type" },
    ...Array.from({ length: 7 }, (_, i) => ({
      key: `v${i + 1}`,
      label: `Value ${i + 1}`,
      type: "number" as ColType,
      align: "right" as const,
    })),
  ],
  rows: mkRows(7, (i) => {
    const r: Record<string, any> = {
      submittalYear: 2026,
      unitName: UNITS[i % UNITS.length],
      category: CATEGORIES[i % CATEGORIES.length],
      area: AREAS[i % AREAS.length],
      heatRate: (7.8 + i * 0.31).toFixed(4),
      profileType: i % 2 === 0 ? "H" : "I",
    };
    for (let v = 1; v <= 7; v++) r[`v${v}`] = (8.2 + ((i + v) % 5) * 0.11).toFixed(4);
    return r;
  }),
};

const lastYearMem: DatasetConfig = {
  id: "last-year-mem",
  name: "Last Year MEM",
  viewOnly: true,
  tip:
    "The Last Year MEM data table is an informational reference displaying data from the previous cycle's models. It is vital because it provides baseline transparency, letting you compare prior-year inputs (like MW capacity and retirement dates) to current setups. This data table is view-only to protect grid integrity.",
  columns: [
    { key: "submittalYear", label: "Submittal Year", type: "number" },
    { key: "unitName", label: "Unit Name" },
    { key: "shortName", label: "Short Name" },
    { key: "category", label: "Category" },
    { key: "area", label: "Area" },
    { key: "region", label: "Region" },
    { key: "maxCap", label: "Max Capacity (MW)", type: "number", align: "right" },
    { key: "brrPmax", label: "Base Reliability Net PMAX", type: "number", align: "right" },
    { key: "brrRetire", label: "Base Reliability Retirement Date" },
    { key: "commDate", label: "Commission Date" },
    { key: "mf1Retire", label: "Market Future 1 Retirement Date" },
    { key: "mf2Retire", label: "Market Future 2 Retirement Date" },
    { key: "areaNumber", label: "Area Number", type: "number" },
    { key: "busName", label: "Bus Name" },
    { key: "machineBus", label: "Machine Bus" },
    { key: "machineId", label: "Machine ID" },
    { key: "pmax", label: "PMAX", type: "number", align: "right" },
    { key: "giNumber", label: "GI Number" },
  ],
  rows: mkRows(8, (i) => ({
    submittalYear: 2025,
    unitName: UNITS[i % UNITS.length],
    shortName: `U${100 + i}`,
    category: CATEGORIES[i % CATEGORIES.length],
    area: AREAS[i % AREAS.length],
    region: ["North", "South", "East", "West"][i % 4],
    maxCap: (220 + i * 17).toFixed(1),
    brrPmax: (215 + i * 17).toFixed(1),
    brrRetire: i % 3 === 0 ? `204${i % 9}-12-31` : "",
    commDate: "2014-06-15",
    mf1Retire: "",
    mf2Retire: "",
    areaNumber: 520 + (i % 4),
    busName: `BUS-${51000 + i}`,
    machineBus: 51000 + i,
    machineId: "1",
    pmax: (220 + i * 17).toFixed(1),
    giNumber: `GI-${4500 + i}`,
  })),
};

export const GEN_SECTIONS: SectionConfig[] = [
  {
    id: "gen-s1",
    label: "Section 1: Foundational Data",
    datasets: [generator, generatorBus, annualProfiles, effluents],
  },
  {
    id: "gen-s2",
    label: "Section 2: Economic & Operational Parameters",
    datasets: [otherEcon, fuelForecast, ownership, capacitySegments, hydroEnergy],
  },
  {
    id: "gen-s3",
    label: "Section 3: Contracts",
    datasets: [fleetPPA, hydroOwnership],
  },
  {
    id: "gen-ref",
    label: "For Reference",
    datasets: [curtailment, effluentDef, fuelDef, heatRate, lastYearMem],
  },
];

// Back-compat alias used by older imports
export const SECTIONS = GEN_SECTIONS;

export const ACK_TEXT =
  "I verify that the structural data parameters evaluated in this dataset section are accurate, complete, and finalized for review.";
