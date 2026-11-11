import { createContext, useContext, useMemo, useState, ReactNode } from "react";

interface Ctx {
  /** legacy: composite row reference used by some grids for hover highlighting */
  hoveredRef: string | null;
  setHoveredRef: (ref: string | null) => void;
  /** id of the row currently hovered from the issue panel */
  hoveredRowId: string | null;
  /** column key currently hovered from the issue panel */
  hoveredCellKey: string | null;
  setHovered: (rowId: string | null, cellKey: string | null) => void;
  /** id of the row currently selected (filters the issue panel) */
  selectedRowId: string | null;
  setSelectedRowId: (rowId: string | null) => void;
}

const SubmissionIssueContext = createContext<Ctx>({
  hoveredRef: null,
  setHoveredRef: () => {},
  hoveredRowId: null,
  hoveredCellKey: null,
  setHovered: () => {},
  selectedRowId: null,
  setSelectedRowId: () => {},
});

export const SubmissionIssueProvider = ({ children }: { children: ReactNode }) => {
  const [hoveredRef, setHoveredRef] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredCellKey, setHoveredCellKey] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const value = useMemo<Ctx>(
    () => ({
      hoveredRef,
      setHoveredRef,
      hoveredRowId,
      hoveredCellKey,
      setHovered: (rowId, cellKey) => {
        setHoveredRowId(rowId);
        setHoveredCellKey(cellKey);
      },
      selectedRowId,
      setSelectedRowId,
    }),
    [hoveredRef, hoveredRowId, hoveredCellKey, selectedRowId],
  );

  return <SubmissionIssueContext.Provider value={value}>{children}</SubmissionIssueContext.Provider>;
};

export const useSubmissionIssue = () => useContext(SubmissionIssueContext);
