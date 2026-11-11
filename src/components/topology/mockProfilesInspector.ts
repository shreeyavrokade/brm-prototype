export interface ProfilesInspectorRow {
  id: string;
  busI: string;
  nameI: string;
  name: string;
  status: number | string;
  area: number | string;
  zone: number | string;
  pl: number | string;
  ql: number | string;
  ip: number | string;
  iq: number | string;
  yp: number | string;
  yq: number | string;
  owner: number | string;
  scale: number | string;
  intrpt: number | string;
  dgenp: number | string;
  dgenq: number | string;
  dgenm: number | string;
  loadtype: string;
  compId: string;
  pneg: number | string;
  qneg: number | string;
  grdflg: number | string;
  pzero: number | string;
  qzero: number | string;
}

const mk = (
  i: number,
  name: string,
  status: number,
  ql: number,
  scale: number,
  seq: Partial<ProfilesInspectorRow> = {},
): ProfilesInspectorRow => ({
  id: `lg-${i}`,
  busI: "533757",
  nameI: "",
  name,
  status,
  area: 536,
  zone: 1536,
  pl: 0,
  ql,
  ip: "",
  iq: "",
  yp: "",
  yq: "",
  owner: 550,
  scale,
  intrpt: "",
  dgenp: "",
  dgenq: "",
  dgenm: "",
  loadtype: "",
  compId: "",
  pneg: "",
  qneg: "",
  grdflg: "",
  pzero: "",
  qzero: "",
  ...seq,
});

export const mockLoadGenRows: ProfilesInspectorRow[] = [
  mk(1, "K1", 1, 1, 1),
  mk(2, "K2", 1, 0, 0, { pneg: 12.5, qneg: 4.2, grdflg: 1, pzero: 8.1, qzero: 2.6 }),
  mk(3, "K3", 0, 0, 1),
  // Missing GRDFLG while sequence data is present -> validation error row
  mk(4, "KN", 0, 0, 1, { pneg: 9.4, qneg: 3.1, grdflg: "", pzero: 6.7, qzero: 1.9 }),
  mk(5, "KN", 0, 0, 1),
];

export const mockBusRows: ProfilesInspectorRow[] = [
  mk(1, "B1", 1, 0, 1),
  mk(2, "B2", 1, 0, 1, { pneg: 5.5, qneg: 1.2, grdflg: 0, pzero: 3.3, qzero: 0.8 }),
  mk(3, "B3", 0, 0, 1),
];

export const mockGeneratorRows: ProfilesInspectorRow[] = [
  mk(1, "G1", 1, 0, 1),
  mk(2, "G2", 1, 0, 1),
];
