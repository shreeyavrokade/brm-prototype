import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SubmitWithWarningsDialog from "@/components/submission/SubmitWithWarningsDialog";
import { brand } from "@/config/brand";

describe("submit with unresolved warnings dialog", () => {
  it("explains the review and submits on confirm", () => {
    const onConfirm = vi.fn();
    render(<SubmitWithWarningsDialog open onOpenChange={() => {}} warningCount={3} onConfirm={onConfirm} />);
    expect(screen.getByText("Submit File with Unresolved Warnings?")).toBeTruthy();
    expect(screen.getByText(/3 warnings were detected/)).toBeTruthy();
    expect(screen.getByText(/may return the file if updates are required/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: `Submit for ${brand.clientShortName} Review` }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
