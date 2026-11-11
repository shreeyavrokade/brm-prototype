import type { ReviewStatus } from "./mockChangeset";

export interface TransactionRow {
  id: string;
  reviewStatus: ReviewStatus;
  fromEntity: string;
  toEntity: string;
  startDate: string;
  stopDate: string;
  firmType: "Firm" | "Non-Firm";
  mwCapacity: number;
  acknowledged: boolean;
  submissionTimestamp: number;
}

const SEED = new Date("2024-02-04T10:00:00Z").getTime();

const seed: Array<Omit<TransactionRow, "submissionTimestamp">> = [
  { id: "RMS-2024-08812", reviewStatus: "Review Needed", fromEntity: "SPP", toEntity: "City of Wichita", startDate: "01 Mar 2024", stopDate: "31 Mar 2024", firmType: "Firm", mwCapacity: 150.0, acknowledged: false },
  { id: "EDST-44219", reviewStatus: "Pending Acceptance", fromEntity: "MISO", toEntity: "OG&E", startDate: "15 Mar 2024", stopDate: "15 Apr 2024", firmType: "Non-Firm", mwCapacity: 75.5, acknowledged: true },
  { id: "RMS-2024-08813", reviewStatus: "Accepted", fromEntity: "WFEC", toEntity: "KCP&L", startDate: "01 Apr 2024", stopDate: "30 Jun 2024", firmType: "Firm", mwCapacity: 220.25, acknowledged: true },
  { id: "EDST-44220", reviewStatus: "Review Needed", fromEntity: "Westar", toEntity: "City of Topeka", startDate: "05 Apr 2024", stopDate: "05 May 2024", firmType: "Non-Firm", mwCapacity: 50.0, acknowledged: false },
  { id: "RMS-2024-08814", reviewStatus: "Rejected", fromEntity: "SPP", toEntity: "Sunflower Electric", startDate: "10 Apr 2024", stopDate: "10 Jul 2024", firmType: "Firm", mwCapacity: 310.75, acknowledged: false },
  { id: "EDST-44221", reviewStatus: "Pending Acceptance", fromEntity: "AECI", toEntity: "Springfield Util", startDate: "20 Apr 2024", stopDate: "20 May 2024", firmType: "Firm", mwCapacity: 95.0, acknowledged: true },
  { id: "RMS-2024-08815", reviewStatus: "Accepted", fromEntity: "ERCOT", toEntity: "Amarillo Municipal", startDate: "01 May 2024", stopDate: "31 Aug 2024", firmType: "Non-Firm", mwCapacity: 180.5, acknowledged: true },
  { id: "EDST-44222", reviewStatus: "Review Needed", fromEntity: "SPP", toEntity: "Tri-State G&T", startDate: "10 May 2024", stopDate: "10 Jun 2024", firmType: "Firm", mwCapacity: 410.0, acknowledged: false },
  { id: "RMS-2024-08816", reviewStatus: "Review Needed", fromEntity: "MISO", toEntity: "Joplin Power", startDate: "15 May 2024", stopDate: "15 Jun 2024", firmType: "Non-Firm", mwCapacity: 60.25, acknowledged: false },
  { id: "EDST-44223", reviewStatus: "Accepted", fromEntity: "WFEC", toEntity: "City of Liberal", startDate: "01 Jun 2024", stopDate: "30 Sep 2024", firmType: "Firm", mwCapacity: 125.0, acknowledged: true },
];

export const mockTransactions: TransactionRow[] = seed.map((r, i) => ({
  ...r,
  submissionTimestamp: SEED - i * 60_000,
}));
