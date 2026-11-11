export const FORECAST_YEARS = Array.from({ length: 13 }, (_, i) => 2026 + i);

export interface ForecastRow {
  id: string;
  submittalYear: number;
  demandGroup: string;
  parentArea: string;
  zone: string;
  values: number[]; // length 13, percentages
  /** Year-index → SPP modification made during the prior review pass. */
  sppChanges?: Record<number, { previous: string; current: string }>;
}

const GROUPS = [
  ["AEP-WEST-01", "AEP", "Zone A"],
  ["AEP-WEST-02", "AEP", "Zone A"],
  ["OGE-METRO-01", "OGE", "Zone B"],
  ["OGE-METRO-02", "OGE", "Zone B"],
  ["WFEC-RURAL-01", "WFEC", "Zone C"],
  ["WFEC-RURAL-02", "WFEC", "Zone C"],
  ["SPS-PANHANDLE-01", "SPS", "Zone D"],
  ["SPS-PANHANDLE-02", "SPS", "Zone D"],
  ["WERE-CENTRAL-01", "WERE", "Zone E"],
  ["WERE-CENTRAL-02", "WERE", "Zone E"],
  ["KCPL-NORTH-01", "KCPL", "Zone F"],
  ["KCPL-NORTH-02", "KCPL", "Zone F"],
  ["NPPD-PLAINS-01", "NPPD", "Zone G"],
  ["NPPD-PLAINS-02", "NPPD", "Zone G"],
  ["OPPD-EAST-01", "OPPD", "Zone H"],
  ["OPPD-EAST-02", "OPPD", "Zone H"],
  ["SUNC-SOUTH-01", "SUNC", "Zone I"],
  ["SUNC-SOUTH-02", "SUNC", "Zone I"],
  ["LES-MIDWEST-01", "LES", "Zone J"],
  ["LES-MIDWEST-02", "LES", "Zone J"],
];

const seed = (n: number) => {
  // deterministic pseudo-random
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

export const FORECAST_ROWS: ForecastRow[] = GROUPS.map(([demand, area, zone], i) => ({
  id: `row-${i + 1}`,
  submittalYear: 2025,
  demandGroup: demand,
  parentArea: area,
  zone,
  values: FORECAST_YEARS.map((_, y) => {
    const base = 48 + seed(i * 31 + y) * 18; // 48-66
    return Math.round(base * 100) / 100;
  }),
})).map((row, i) => {
  if (i % 3 !== 0) return row;
  const mark = (y: number, delta: number) => [
    y,
    {
      previous: `${(row.values[y] - delta).toFixed(2)}%`,
      current: `${row.values[y].toFixed(2)}%`,
    },
  ] as const;
  return {
    ...row,
    sppChanges: Object.fromEntries([mark(0, 1.4), mark(4, -0.85)]),
  };
});

export const sppChangeFor = (row: ForecastRow, yearIndex: number) =>
  row.sppChanges?.[yearIndex];
