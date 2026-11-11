export type Season = "Summer" | "Winter" | "Spring" | "Fall";

export interface BranchRatingRow {
  id: string;
  branchId: string;
  fromBus: string;
  toBus: string;
  circuit: string;
  owner: string;
  season: Season;
  lte: number;
  norm: number;
  ste: number;
  ld: number;
  sharedAsset?: boolean;
}

export interface TransformerRatingRow {
  id: string;
  transformerId: string;
  fromBus: string;
  toBus: string;
  winding: 1 | 2 | 3;
  owner: string;
  season: Season;
  lte: number;
  norm: number;
  ste: number;
  ld: number;
  sharedAsset?: boolean;
}

const branchSeed: Omit<BranchRatingRow, "id" | "season">[] = [
  { branchId: "TL-345-117", fromBus: "BUS-117", toBus: "BUS-345", circuit: "1", owner: "WFEC", lte: 1240, norm: 1100, ste: 1380, ld: 1450, sharedAsset: true },
  { branchId: "TL-138-204", fromBus: "BUS-204", toBus: "BUS-138", circuit: "1", owner: "SPP",  lte: 820,  norm: 740,  ste: 910,  ld: 960 },
  { branchId: "TL-069-019", fromBus: "BUS-019", toBus: "BUS-069", circuit: "2", owner: "OG&E", lte: 460,  norm: 410,  ste: 510,  ld: 540 },
  { branchId: "TL-138-318", fromBus: "BUS-318", toBus: "BUS-138", circuit: "1", owner: "Xcel", lte: 1010, norm: 920,  ste: 1120, ld: 1180, sharedAsset: true },
  { branchId: "TL-345-489", fromBus: "BUS-489", toBus: "BUS-345", circuit: "1", owner: "AEP",  lte: 1320, norm: 1180, ste: 1460, ld: 1530 },
];

const transformerSeed: Omit<TransformerRatingRow, "id" | "season">[] = [
  { transformerId: "TR-138-345", fromBus: "BUS-138", toBus: "BUS-345", winding: 2, owner: "WFEC", lte: 560, norm: 500, ste: 620, ld: 660 },
  { transformerId: "TR-069-138", fromBus: "BUS-069", toBus: "BUS-138", winding: 2, owner: "SPP",  lte: 320, norm: 280, ste: 360, ld: 390, sharedAsset: true },
  { transformerId: "TR-345-500", fromBus: "BUS-345", toBus: "BUS-500", winding: 3, owner: "OG&E", lte: 980, norm: 880, ste: 1080, ld: 1150 },
  { transformerId: "TR-138-230", fromBus: "BUS-138", toBus: "BUS-230", winding: 2, owner: "AEP",  lte: 610, norm: 540, ste: 680, ld: 720 },
];

const seasons: Season[] = ["Summer", "Winter", "Spring", "Fall"];

export const buildBranchRatings = (): BranchRatingRow[] =>
  branchSeed.flatMap((b, i) =>
    seasons.map((s, j) => ({
      ...b,
      id: `B${i}-${j}`,
      season: s,
      lte: Math.round(b.lte * (s === "Summer" ? 0.92 : s === "Winter" ? 1.08 : 1)),
      norm: Math.round(b.norm * (s === "Summer" ? 0.92 : s === "Winter" ? 1.08 : 1)),
      ste: Math.round(b.ste * (s === "Summer" ? 0.92 : s === "Winter" ? 1.08 : 1)),
      ld: Math.round(b.ld * (s === "Summer" ? 0.92 : s === "Winter" ? 1.08 : 1)),
    })),
  );

export const buildTransformerRatings = (): TransformerRatingRow[] =>
  transformerSeed.flatMap((t, i) =>
    seasons.map((s, j) => ({
      ...t,
      id: `T${i}-${j}`,
      season: s,
      lte: Math.round(t.lte * (s === "Summer" ? 0.94 : s === "Winter" ? 1.06 : 1)),
      norm: Math.round(t.norm * (s === "Summer" ? 0.94 : s === "Winter" ? 1.06 : 1)),
      ste: Math.round(t.ste * (s === "Summer" ? 0.94 : s === "Winter" ? 1.06 : 1)),
      ld: Math.round(t.ld * (s === "Summer" ? 0.94 : s === "Winter" ? 1.06 : 1)),
    })),
  );
