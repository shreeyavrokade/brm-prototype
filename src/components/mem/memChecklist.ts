export type StepState = "unlocked" | "locked" | "view-only";

export interface ChecklistStep {
  id: string;
  title: string;
  description: string;
  state: StepState;
  dependencyLabel?: string;
}

export interface ChecklistSection {
  header: string;
  steps: ChecklistStep[];
}

export type TrackKey = "load" | "gen";

export const GEN_TABS = [
  "Guided Checklist",
  "Section 1: Foundational Data",
  "Section 2: Economic & Operational Parameters",
  "Section 3: Contracts",
  "For Reference",
];

export const LOAD_TABS = [
  "Guided Checklist",
  "Section 1: Powerflow Input Review",
  "Section 2: Factor Verification",
  "Section 3: Resource Plan Updates",
  "For Reference",
];

export const GEN_CALLOUT =
  "To make your review process easier and faster, we'll go through datasets in a specific order. Please note: the deadline to submit revisions or comments for this cycle is March 15, 2027.";

export const LOAD_CALLOUT =
  "To make your review process easier and faster, we'll go through datasets in a specific order. Please note: the deadline to submit revisions or comments for this cycle is March 15, 2027.";

export const GEN_CHECKLIST: ChecklistSection[] = [
  {
    header: "Section 1: Foundational Data",
    steps: [
      {
        id: "gen-s1",
        title: "Generator Identity, Bus & Profiles",
        description:
          "Confirm generator IDs, bus mappings, annual profiles, and emissions for the planning cycle.",
        state: "unlocked",
      },
    ],
  },
  {
    header: "Section 2: Economic & Operational Parameters",
    steps: [
      {
        id: "gen-s2",
        title: "Economic & Operational Parameters",
        description:
          "Review heat rates, variable O&M, ownership, and operational limits across the forecast horizon.",
        state: "unlocked",
      },
    ],
  },
  {
    header: "Section 3: Contracts",
    steps: [
      {
        id: "gen-s3",
        title: "Power Purchase & Hydro Contracts",
        description: "Add or update PPAs and hydro ownership entitlements for this cycle.",
        state: "unlocked",
      },
    ],
  },
  {
    header: "For Reference",
    steps: [
      {
        id: "gen-ref",
        title: "Reference Data Library",
        description:
          "View-only curtailment, effluent, fuel, heat rate, and prior-cycle MEM reference sheets.",
        state: "view-only",
      },
    ],
  },
];

export const LOAD_CHECKLIST: ChecklistSection[] = [
  {
    header: "Section 1: Powerflow Input Review",
    steps: [
      {
        id: "load-s1",
        title: "Load Bus, Peak Load & Station Service",
        description:
          "Review pre-populated bus-level seasonal loads, demand-group peaks, and station service mappings.",
        state: "unlocked",
      },
    ],
  },
  {
    header: "Section 2: Factor Verification",
    steps: [
      {
        id: "load-s2",
        title: "Annual Load & Loss Factors",
        description:
          "Verify the 20-year annual load factor and loss factor projections for every demand group.",
        state: "unlocked",
      },
    ],
  },
  {
    header: "Section 3: Resource Plan Updates",
    steps: [
      {
        id: "load-s3",
        title: "Resource Planning Peak & Load Factor",
        description:
          "Capture resource-plan-specific peak demand and load factor variances from the Base Reliability baseline.",
        state: "unlocked",
      },
    ],
  },
  {
    header: "For Reference",
    steps: [
      {
        id: "load-ref",
        title: "Reference Data Library",
        description:
          "View-only ownership legend, hourly profiles, and monthly peak/energy reference sheets.",
        state: "view-only",
      },
    ],
  },
];
