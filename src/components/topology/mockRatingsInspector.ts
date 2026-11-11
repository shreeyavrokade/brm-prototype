export interface RatingsInspectorRow {
  id: string;
  ratingName: "FALL" | "SPRING" | "SUMMER" | "WINTER";
  busI: string;
  busJ: string;
  busK: string;
  ckt: number;
  norm1: number | "";
  lte1: number | "";
  ste1: number | "";
  ld1: number | "";
  norm2: number | "";
  lte2: number | "";
  ste2: number | "";
  ld2: number | "";
  norm3: number | "";
  lte3: number | "";
  ste3: number | "";
  ld3: number | "";
  equipName: string;
}

export const mockRatingsInspector: RatingsInspectorRow[] = [
  { id: "r1", ratingName: "FALL",   busI: "541105", busJ: "541199", busK: "", ckt: 1, norm1: 1138, lte1: 1195, ste1: 0, ld1: 0, norm2: "", lte2: "", ste2: "", ld2: "", norm3: "", lte3: "", ste3: "", ld3: "", equipName: "" },
  { id: "r2", ratingName: "SPRING", busI: "541105", busJ: "541199", busK: "", ckt: 1, norm1: 1138, lte1: 1195, ste1: 0, ld1: 0, norm2: "", lte2: "", ste2: "", ld2: "", norm3: "", lte3: "", ste3: "", ld3: "", equipName: "" },
  { id: "r3", ratingName: "SUMMER", busI: "541105", busJ: "541199", busK: "", ckt: 1, norm1: 1138, lte1: 1195, ste1: 0, ld1: 0, norm2: "", lte2: "", ste2: "", ld2: "", norm3: "", lte3: "", ste3: "", ld3: "", equipName: "" },
  { id: "r4", ratingName: "WINTER", busI: "541105", busJ: "541199", busK: "", ckt: 1, norm1: 1138, lte1: 1195, ste1: 0, ld1: 0, norm2: "", lte2: "", ste2: "", ld2: "", norm3: "", lte3: "", ste3: "", ld3: "", equipName: "" },
  { id: "r5", ratingName: "FALL",   busI: "541105", busJ: "541199", busK: "", ckt: 1, norm1: 1138, lte1: 1195, ste1: 0, ld1: 0, norm2: "", lte2: "", ste2: "", ld2: "", norm3: "", lte3: "", ste3: "", ld3: "", equipName: "" },
];
