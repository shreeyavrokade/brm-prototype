import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AcceptResponsibilityDialog from "@/components/submission/AcceptResponsibilityDialog";
import type { Issue } from "@/components/dashboard/types";

const warning: Issue = {
  id: "ISS-BUS-61203-vm", rowId: "BUS-61203", cellKey: "vm", recordType: "BUS", phase: "p", category: "Bus Data",
  fieldName: "vm", status: "warning", message: "Voltage approaching the 0.95 PU lower limit", dismissed: false,
};

describe("accept responsibility dialog", () => {
  it("requires the acknowledgement before submitting", () => {
    const onConfirm = vi.fn();
    render(
      <AcceptResponsibilityDialog open onOpenChange={() => {}} projectName="612_CVP_Ashford_Reconductor" version={2}
        warnings={[warning]} onConfirm={onConfirm} onUploadCorrected={() => {}} />,
    );
    expect(screen.getByText(/Voltage approaching/)).toBeTruthy();
    const submit = screen.getByRole("button", { name: /Accept responsibility & submit/ });
    expect((submit as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("checkbox"));
    expect((submit as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(submit);
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
