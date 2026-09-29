import { InflightServicesService } from "../inflightServicesService";

describe("InflightServicesService", () => {
  let service: InflightServicesService;

  beforeEach(() => {
    service = new InflightServicesService();
  });

  test("getCatalog returns items", () => {
    const catalog = service.getCatalog();
    expect(catalog.length).toBeGreaterThan(0);
    expect(catalog.some((i) => i.category === "wifi")).toBe(true);
    expect(catalog.some((i) => i.category === "baggage")).toBe(true);
    expect(catalog.some((i) => i.category === "meal")).toBe(true);
  });

  test("addServicesToBooking and getBookingServices work correctly", async () => {
    const bookingId = "test-booking-123";
    const added = await service.addServicesToBooking(bookingId, ["wifi-1", "bag-1"]);
    expect(added.length).toBe(2);

    const fetched = await service.getBookingServices(bookingId);
    expect(fetched.length).toBe(2);
    expect(fetched[0].id).toBe("wifi-1");

    const pricing = service.calculateServicePricing(fetched);
    expect(pricing.totalCents).toBe(6000);
  });
});
