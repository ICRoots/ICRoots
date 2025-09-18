import { describe, it, expect, vi, beforeEach } from "vitest";
import { backendService } from "../../src/services/backendService";
import { backend } from "../../../declarations/backend";

// Mock all the backend canisters
vi.mock("../../../declarations/backend", () => ({
  backend: {
    greet: vi.fn().mockResolvedValue("Hello, Test User!"),
    get_count: vi.fn().mockResolvedValue(BigInt(42)),
    increment: vi.fn().mockResolvedValue(BigInt(43)),
    prompt: vi.fn().mockResolvedValue("This is a mock LLM response"),
    set_count: vi.fn().mockResolvedValue(BigInt(100)),
  },
}));

vi.mock("../../../declarations/collateral_backend", () => ({
  collateral_backend: {
    deposit_mock: vi.fn().mockResolvedValue(undefined),
    get_collateral: vi.fn().mockResolvedValue(BigInt(1000)),
  },
}));

vi.mock("../../../declarations/repute_backend", () => ({
  repute_backend: {
    get_level: vi.fn().mockResolvedValue(BigInt(5)),
    set_level: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("../../../declarations/loans_backend", () => ({
  loans_backend: {
    ping: vi.fn().mockResolvedValue("pong"),
    register_user: vi.fn().mockResolvedValue(undefined),
    get_summary: vi.fn().mockResolvedValue({ loans: [], total_borrowed: BigInt(0) }),
    request_loan: vi.fn().mockResolvedValue(undefined),
    repay: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("../../../declarations/trust_ai_backend", () => ({
  trust_ai_backend: {
    recommend: vi.fn().mockResolvedValue({
      decision: "approved",
      score: BigInt(85),
      reasons: ["Good collateral", "High trust level"],
    }),
  },
}));

vi.mock("../../../declarations/event_bus_backend", () => ({
  event_bus_backend: {
    emit: vi.fn().mockResolvedValue(undefined),
    list_recent: vi.fn().mockResolvedValue(["Event 1", "Event 2"]),
  },
}));

describe("backendService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Original Backend Functions", () => {
    it("should call backend.greet with the provided name", async () => {
      // Execute
      const result = await backendService.greet("Test User");

      // Assert
      expect(backend.greet).toHaveBeenCalledWith("Test User");
      expect(result).toBe("Hello, Test User!");
    });

    it("should get the current count", async () => {
      // Execute
      const result = await backendService.getCount();

      // Assert
      expect(backend.get_count).toHaveBeenCalled();
      expect(result).toBe(BigInt(42));
    });

    it("should increment the counter", async () => {
      // Execute
      const result = await backendService.incrementCounter();

      // Assert
      expect(backend.increment).toHaveBeenCalled();
      expect(result).toBe(BigInt(43));
    });
  });

  describe("ICRoots Integration", () => {
    it("should get user level", async () => {
      // Execute
      const result = await backendService.getUserLevel("test-user");

      // Assert
      expect(result).toBe(BigInt(5));
    });

    it("should get user collateral", async () => {
      // Execute
      const result = await backendService.getUserCollateral("test-user");

      // Assert
      expect(result).toBe(BigInt(1000));
    });

    it("should process loan application", async () => {
      // Execute
      const result = await backendService.processLoanApplication("test-user", BigInt(500));

      // Assert
      expect(result.recommendation).toEqual({
        decision: "approved",
        score: BigInt(85),
        reasons: ["Good collateral", "High trust level"],
      });

      expect(result.userProfile.level).toBe(BigInt(5));
      expect(result.userProfile.collateral).toBe(BigInt(1000));
    });

    it("should emit and retrieve events", async () => {
      // Execute
      await backendService.emitEvent("Test event");
      const events = await backendService.getRecentEvents(BigInt(5));

      // Assert
      expect(events).toEqual(["Event 1", "Event 2"]);
    });
  });
});
