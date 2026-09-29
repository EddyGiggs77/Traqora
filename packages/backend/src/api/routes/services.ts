import { Router, Request, Response } from "express";
import { inflightServicesService } from "../../services/inflightServicesService";
import { asyncHandler } from "../middleware/asyncHandler";
import { z } from "zod";


const seatPreferenceSchema = z.object({
  bookingId: z.string().uuid(),
  seatNumber: z
    .string()
    .regex(/^[0-9]{1,2}[A-F]$/, "Invalid seat number (e.g. 12A)"),
  preference: z.enum(["window", "aisle", "middle", "extra_legroom"]).optional(),
});

const seatLockSchema = z.object({
  flightId: z.string().uuid(),
  seatNumber: z.string().regex(/^[0-9]{1,2}[A-F]$/, "Invalid seat number"),
  bookingId: z.string().uuid(),
});

const mealsSchema = z.object({
  bookingId: z.string().uuid(),
  meals: z
    .array(
      z.object({
        mealId: z.string(),
        dietary: z
          .enum([
            "vegetarian",
            "vegan",
            "halal",
            "kosher",
            "gluten_free",
            "dairy_free",
            "nut_free",
            "low_sodium",
            "diabetic",
          ])
          .optional(),
        quantity: z.number().int().positive().max(10).default(1),
        specialInstructions: z.string().max(500).optional(),
      }),
    )
    .min(1),
});

const wifiSchema = z.object({
  bookingId: z.string().uuid(),
  wifi: z
    .array(
      z.object({
        wifiId: z.string(),
        packageType: z.enum(["hourly", "daily", "monthly", "fullFlight"]),
        quantity: z.number().int().positive().default(1),
      }),
    )
    .min(1),
});

const baggageSchema = z.object({
  bookingId: z.string().uuid(),
  baggage: z
    .array(
      z.object({
        baggageId: z.string(),
        pieces: z.number().int().positive().max(5),
        baggageType: z.enum([
          "standard",
          "oversized",
          "sports_equipment",
          "fragile",
        ]),
      }),
    )
    .min(1),
});

const entertainmentSchema = z.object({
  bookingId: z.string().uuid(),
  entertainment: z
    .array(
      z.object({
        entertainmentId: z.string(),
        quantity: z.number().int().positive().default(1),
      }),
    )
    .min(1),
});

const inFlightServiceSchema = z.object({
  bookingId: z.string().uuid(),
  services: z
    .array(
      z.object({
        type: z.enum(["meal", "wifi", "extra_baggage", "entertainment"]),
        option: z.string().max(100),
        quantity: z.number().int().positive().max(10).default(1),
      }),
    )
    .min(1),
});
const router = Router();

router.get("/catalog", asyncHandler(async (_req: Request, res: Response) => {
  const catalog = inflightServicesService.getCatalog();
  res.json({ success: true, data: catalog });
}));

router.post("/booking/:bookingId", asyncHandler(async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { serviceIds } = req.body;
  const added = await inflightServicesService.addServicesToBooking(bookingId, serviceIds);
  res.json({ success: true, data: added });
}));

router.get("/booking/:bookingId", asyncHandler(async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const services = await inflightServicesService.getBookingServices(bookingId);
  const pricing = inflightServicesService.calculateServicePricing(services);
  res.json({ success: true, data: { services, pricing } });
}));

export const servicesRouter = router;
