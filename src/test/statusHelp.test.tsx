import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import StatusPill, { STATUS_HELP, STATUS_TOKENS } from "@/components/shared/statusBadge";

describe("status help tooltip", () => {
  it("has an explanation for every status", () => {
    for (const key of Object.keys(STATUS_TOKENS) as (keyof typeof STATUS_TOKENS)[]) {
      expect(STATUS_HELP[key]?.means).toBeTruthy();
      expect(STATUS_HELP[key]?.next).toBeTruthy();
    }
  });

  it("explains the status on keyboard focus", async () => {
    render(
      <TooltipProvider>
        <StatusPill status="Review Needed" />
      </TooltipProvider>,
    );
    const trigger = screen.getByLabelText(/Review Needed: Validation found errors/);
    await act(async () => {
      fireEvent.focus(trigger);
    });
    expect((await screen.findAllByText(/Next step:/)).length).toBeGreaterThan(0);
  });
});
