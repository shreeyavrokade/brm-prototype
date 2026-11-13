import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_BRAND_ID, resolveBrandId } from "@/config/brand";

describe("brand selection", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it("defaults to the neutral preset", () => {
    expect(DEFAULT_BRAND_ID).toBe("neutral");
    expect(resolveBrandId("")).toBe("neutral");
  });

  it("applies ?brand= even when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(resolveBrandId("?brand=acme")).toBe("acme");
  });

  it("remembers the pick for this tab only", () => {
    resolveBrandId("?brand=placeholder");
    expect(resolveBrandId("")).toBe("placeholder");
    expect(localStorage.getItem("usp_brand")).toBeNull();
  });
});
