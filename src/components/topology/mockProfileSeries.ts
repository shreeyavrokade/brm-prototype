import { brand } from "@/config/brand";

export type ProfileStatus = "Active" | "Pending" | "Retired";
export type ProfileDirectoryStatus = "Draft" | "Review Needed" | "Accepted" | "Rejected";
export type ProfileKindLabel = "Load Gen" | "Device Control";
export type ProfileStudyType = "MDAG" | "ITP";

export interface ProfileProject {
  id: string;
  submittalId: string;
  /** Long submission name shown in directory first column */
  submissionName: string;
  /** Short numeric ID column */
  submissionId: string;
  name: string;
  entity: string;
  controlArea: string;
  status: ProfileStatus;
  directoryStatus: ProfileDirectoryStatus;
  profileType: string;
  modelClass: string;
  /** Directory: MDAG | ITP */
  studyType: ProfileStudyType;
  /** Directory: e.g. "2024MD…" */
  baseProfileName: string;
  /** Directory: submitter display name */
  submitter: string;
  /** Directory: filter dropdown classification */
  profileKindLabel: ProfileKindLabel;
  submissionDate: string; // M/D/YYYY
}

export interface ProfileInterval {
  index: number;
  timestamp: string; // MM/DD/YYYY HH:mm
  hour: number;
  dayType: "Weekday" | "Weekend" | "Peak";
  assetId: string;
  owningEntity: string;
  controlArea: string;
  scalingFactor: number;
  mwTarget: number;
  mvarComponent: number;
  sharedAsset?: boolean;
  profileKind?: "load-gen" | "device-control";
}

export const mockProfileProjects: ProfileProject[] = [
  { id: "p1", submittalId: "PRJ-2025-P4", submissionName: "550_KEPCO2025ITPP5-34S", submissionId: "117086", name: "Summer Peak Load Forecast",    entity: "Westar Energy", controlArea: brand.clientCode, status: "Pending", directoryStatus: "Review Needed", profileType: "8760 Hourly Load Curve",       modelClass: "Load Scaling Matrix",                studyType: "MDAG", baseProfileName: "2024MDAG-Base", submitter: "Richards, Darian", profileKindLabel: "Load Gen",       submissionDate: "1/16/2024" },
  { id: "p2", submittalId: "PRJ-2026-W3", submissionName: "552_KEPCO2025ITPP5-36B", submissionId: "117088", name: "Wind Profile — Buffalo Ridge", entity: "Xcel Energy",   controlArea: brand.clientCode, status: "Pending", directoryStatus: "Review Needed", profileType: "24hr Wind Generation Profile", modelClass: "Gen Dispatch Profiles",              studyType: "ITP",  baseProfileName: "2024MDAG-Wind", submitter: "Nguyen, Linh",     profileKindLabel: "Load Gen",       submissionDate: "1/20/2024" },
  { id: "p3", submittalId: "PRJ-2026-S2", submissionName: "551_KEPCO2025ITPP5-35A", submissionId: "117087", name: "Solar Generation Profile",     entity: "OG&E",          controlArea: brand.clientCode, status: "Active",  directoryStatus: "Accepted",      profileType: "Solar Dispatch Array",         modelClass: "Gen Dispatch Profiles",              studyType: "ITP",  baseProfileName: "2024MDAG-Solar",submitter: "Watanabe, Haru",   profileKindLabel: "Load Gen",       submissionDate: "1/18/2024" },
  { id: "p4", submittalId: "PRJ-2026-P4", submissionName: "551_KEPCO2025ITPP5-35A", submissionId: "117087", name: "Winter Reserve Margin",        entity: "AEP",           controlArea: brand.clientCode, status: "Active",  directoryStatus: "Accepted",      profileType: "8760 Hourly Load Curve",       modelClass: "Load Scaling Matrix",                studyType: "MDAG", baseProfileName: "2024MDAG-Win",  submitter: "Watanabe, Haru",   profileKindLabel: "Load Gen",       submissionDate: "1/18/2024" },
  { id: "p5", submittalId: "PRJ-2026-I1", submissionName: "549_KEPCO2025ITPP5-33H", submissionId: "117085", name: "Hydro Dispatch Profile",       entity: "SWPA",          controlArea: brand.clientCode, status: "Retired", directoryStatus: "Accepted",      profileType: "Interchange Schedule",         modelClass: "Interchange Transaction Schedules",  studyType: "ITP",  baseProfileName: "2024MDAG-Hyd",  submitter: "Garcia, Sofia",    profileKindLabel: "Device Control", submissionDate: "1/12/2024" },
  { id: "p6", submittalId: "PRJ-2026-L7", submissionName: "548_KEPCO2025ITPP5-32G", submissionId: "117084", name: "Distributed Load Pocket",      entity: "GRDA",          controlArea: brand.clientCode, status: "Pending", directoryStatus: "Draft",         profileType: "8760 Hourly Load Curve",       modelClass: "Load Scaling Matrix",                studyType: "MDAG", baseProfileName: "2024MDAG-DLP",  submitter: "O'Connor, Liam",   profileKindLabel: "Device Control", submissionDate: "" },
];


const pad = (n: number) => String(n).padStart(2, "0");

export const generateProfileSeries = (project: ProfileProject): ProfileInterval[] => {
  const nameplate = 250; // MW
  const intervals: ProfileInterval[] = [];
  const baseDate = new Date(2026, 5, 17); // June 17, 2026
  const dayType = project.id === "p4" ? "Peak" : "Weekday";
  for (let i = 0; i < 96; i++) {
    const totalMin = i * 15;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    // sinusoidal load between 0.2 and 0.95, peak around hour 16
    const phase = ((h + m / 60) / 24) * Math.PI * 2;
    const scaling = 0.575 + 0.375 * Math.sin(phase - Math.PI / 2 - 0.3);
    const sf = Math.max(0.2, Math.min(0.95, scaling));
    const mw = sf * nameplate;
    const mvar = mw * 0.3;
    const assetIdx = 1 + (i % 3);
    const kind: "load-gen" | "device-control" = assetIdx === 3 ? "device-control" : "load-gen";
    intervals.push({
      index: i,
      timestamp: `${pad(baseDate.getMonth() + 1)}/${pad(baseDate.getDate())}/${baseDate.getFullYear()} ${pad(h)}:${pad(m)}`,
      hour: h,
      dayType,
      assetId: `${project.id.toUpperCase()}-AST-${String(assetIdx).padStart(2, "0")}`,
      owningEntity: project.entity,
      controlArea: project.controlArea,
      scalingFactor: Number(sf.toFixed(2)),
      mwTarget: Number(mw.toFixed(1)),
      mvarComponent: Number(mvar.toFixed(1)),
      sharedAsset: assetIdx === 2,
      profileKind: kind,
    });
  }
  return intervals;
};

export const getProjectById = (id: string): ProfileProject => {
  return (
    mockProfileProjects.find((p) => p.id === id || p.submittalId === id) ?? {
      id,
      submittalId: id.toUpperCase().startsWith("PRJ") ? id.toUpperCase() : "PRJ-2026-P4",
      submissionName: "Profile Submission",
      submissionId: "000000",
      name: "Profile Submission",
      entity: "Unknown Entity",
      controlArea: brand.clientCode,
      status: "Pending",
      directoryStatus: "Review Needed",
      profileType: "8760 Hourly Load Curve",
      modelClass: "Load Scaling Matrix",
      studyType: "MDAG",
      baseProfileName: "2024MDAG-Base",
      submitter: "Unknown",
      profileKindLabel: "Load Gen",
      submissionDate: "06/17/2026",
    }
  );
};
