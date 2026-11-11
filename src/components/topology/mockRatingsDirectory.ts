export type DirectoryStatus = "Draft" | "Review Needed" | "Accepted" | "Rejected";

export interface RatingsDirectoryRow {
  /** Routing key */
  id: string;
  /** Long submission name shown in first column */
  submissionName: string;
  /** Short numeric submission ID */
  submissionId: string;
  status: DirectoryStatus;
  sharedTieLine: boolean;
  submitter: string;
  /** Pre-formatted MM/DD/YYYY; empty string for Draft */
  submissionDate: string;
}

export const mockRatingsDirectory: RatingsDirectoryRow[] = [
  {
    id: "PRJ-2025-M7",
    submissionName: "554_KEPCO2025ITPP5-38D",
    submissionId: "117090",
    status: "Review Needed",
    sharedTieLine: true,
    submitter: "O'Connor, Liam",
    submissionDate: "",
  },
  {
    id: "PRJ-2028-S1",
    submissionName: "550_KEPCO2025ITPP5-34S",
    submissionId: "117086",
    status: "Accepted",
    sharedTieLine: false,
    submitter: "Richards, Darian",
    submissionDate: "1/16/2024",
  },
  {
    id: "PRJ-2027-M4",
    submissionName: "552_KEPCO2025ITPP5-36B",
    submissionId: "117088",
    status: "Accepted",
    sharedTieLine: false,
    submitter: "Nguyen, Linh",
    submissionDate: "1/20/2024",
  },
  {
    id: "PRJ-2026-T2",
    submissionName: "552_KEPCO2025ITPP5-36B",
    submissionId: "117088",
    status: "Accepted",
    sharedTieLine: false,
    submitter: "Nguyen, Linh",
    submissionDate: "1/20/2024",
  },
  {
    id: "PRJ-2026-W1",
    submissionName: "551_KEPCO2025ITPP5-35A",
    submissionId: "117087",
    status: "Accepted",
    sharedTieLine: true,
    submitter: "Watanabe, Haru…",
    submissionDate: "1/18/2024",
  },
  {
    id: "PRJ-2027-N3",
    submissionName: "553_KEPCO2025ITPP5-37C",
    submissionId: "117089",
    status: "Rejected",
    sharedTieLine: false,
    submitter: "Garcia, Sofia",
    submissionDate: "1/22/2024",
  },
];
