import { BookingOrchestrationService } from "./bookingOrchestrationService";
import { BadRequestError } from "../utils/errors";

describe("BookingOrchestrationService - seat and services", () => {
  it("should calculate correct totals for seats and services", async () => {
    const service = new BookingOrchestrationService();
    const mockBooking = {
      id: "b1",
      status: "confirmed",
      flight: { priceCents: 10000 },
      amountCents: 10000,
    };
    jest.spyOn(service["bookingRepo"], "findOne").mockResolvedValue(mockBooking as any);
    jest.spyOn(service["bookingRepo"], "save").mockImplementation(async (b) => b as any);

    const updated = await service.selectSeatAndServices("b1", "12A", [
      { id: "meal-veg", quantity: 1 },
      { id: "wifi-full", quantity: 1 },
    ]);

    expect(updated.amountCents).toBe(10000 + 1500 + 2500);
  });

  it("should throw if booking not found", async () => {
    const service = new BookingOrchestrationService();
    jest.spyOn(service["bookingRepo"], "findOne").mockResolvedValue(null);

    await expect(service.selectSeatAndServices("invalid", "12A", [])).rejects.toThrow(BadRequestError);
  });
});
