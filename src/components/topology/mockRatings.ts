export type RatingStatus = "Active" | "Pending" | "Retired";
export type Season = "Summer" | "Winter" | "Spring" | "Fall";

export interface RatingRow {
  id: string;
  tieLineId: string;
  fromBus: string;
  toBus: string;
  circuit: string;
  owner: string;
  normalMva: number;
  emergencyMva: number;
  lteMva: number;
  steMva: number;
  season: Season;
  effectiveDate: string;
  status: RatingStatus;
  createdTimestamp: number;
}

const SEED = new Date("2024-02-01T12:00:00Z").getTime();

const seed: Omit<RatingRow, "id" | "createdTimestamp">[] = [
  { tieLineId: "TL-527-001", fromBus: "BOSWELL_138", toBus: "WFEC_138", circuit: "1", owner: "WFEC", normalMva: 239, emergencyMva: 287, lteMva: 312, steMva: 340, season: "Summer", effectiveDate: "01 Jun 2024", status: "Active" },
  { tieLineId: "TL-524-002", fromBus: "DELAY_MTN_345", toBus: "BURG_OK_345", circuit: "1", owner: "OG&E", normalMva: 956, emergencyMva: 1102, lteMva: 1180, steMva: 1240, season: "Winter", effectiveDate: "01 Dec 2024", status: "Active" },
  { tieLineId: "TL-612-003", fromBus: "SUNFLOWER_230", toBus: "TOPEKA_230", circuit: "2", owner: "Sunflower", normalMva: 478, emergencyMva: 562, lteMva: 610, steMva: 648, season: "Summer", effectiveDate: "15 May 2024", status: "Active" },
  { tieLineId: "TL-489-004", fromBus: "CIMARRON_138", toBus: "LIBERAL_138", circuit: "1", owner: "Westar", normalMva: 187, emergencyMva: 224, lteMva: 245, steMva: 268, season: "Spring", effectiveDate: "01 Mar 2024", status: "Pending" },
  { tieLineId: "TL-701-005", fromBus: "COMANCHE_345", toBus: "PUEBLO_345", circuit: "1", owner: "Xcel", normalMva: 1024, emergencyMva: 1187, lteMva: 1248, steMva: 1310, season: "Summer", effectiveDate: "01 Jul 2024", status: "Active" },
  { tieLineId: "TL-318-006", fromBus: "OZARK_161", toBus: "SPRINGFIELD_161", circuit: "1", owner: "Empire", normalMva: 312, emergencyMva: 365, lteMva: 392, steMva: 418, season: "Fall", effectiveDate: "01 Oct 2024", status: "Active" },
  { tieLineId: "TL-245-007", fromBus: "RED_RIVER_138", toBus: "WICHITA_FALLS_138", circuit: "2", owner: "AEP", normalMva: 215, emergencyMva: 258, lteMva: 280, steMva: 304, season: "Summer", effectiveDate: "01 Jun 2024", status: "Retired" },
  { tieLineId: "TL-892-008", fromBus: "PANHANDLE_345", toBus: "AMARILLO_345", circuit: "1", owner: "SPS", normalMva: 1148, emergencyMva: 1320, lteMva: 1402, steMva: 1480, season: "Winter", effectiveDate: "15 Dec 2024", status: "Active" },
  { tieLineId: "TL-133-009", fromBus: "FLINT_HILLS_115", toBus: "MANHATTAN_115", circuit: "1", owner: "Westar", normalMva: 142, emergencyMva: 168, lteMva: 184, steMva: 198, season: "Spring", effectiveDate: "01 Apr 2024", status: "Pending" },
  { tieLineId: "TL-566-010", fromBus: "BLACK_MESA_345", toBus: "TULSA_345", circuit: "2", owner: "AEP", normalMva: 987, emergencyMva: 1140, lteMva: 1208, steMva: 1268, season: "Summer", effectiveDate: "01 Aug 2024", status: "Active" },
];

export const mockRatings: RatingRow[] = seed.map((r, i) => ({
  ...r,
  id: `R${String(1001 + i)}`,
  createdTimestamp: SEED - i * 60_000,
}));
