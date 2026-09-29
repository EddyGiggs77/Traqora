/**
 * Service catalog with predefined offerings
 * In production, these would be fetched from a service inventory database
 */
const MEAL_CATALOG: Record<string, MealService> = {
  VEGAN_SANDWICH: {
    id: "meal_vegan_001",
    code: "VSAN",
    name: "Vegan Sandwich",
    description: "Organic vegetables, plant-based protein, whole grain bread",
    price: 1200, // $12.00
    dietaryRestrictions: ["vegan", "gluten_free"],
    availableClasses: ["economy", "premium_economy", "business", "first"],
    servingTime: "lunch",
    calories: 350,
    spiceLevel: "mild",
  },
  GRILLED_CHICKEN: {
    id: "meal_chicken_001",
    code: "GRCH",
    name: "Grilled Chicken Meal",
    description: "Herb-grilled chicken breast with seasonal vegetables",
    price: 1500, // $15.00
    dietaryRestrictions: [],
    availableClasses: ["economy", "premium_economy", "business", "first"],
    servingTime: "lunch",
    calories: 450,
    spiceLevel: "mild",
  },
  BEEF_TENDERLOIN: {
    id: "meal_beef_001",
    code: "BTND",
    name: "Beef Tenderloin",
    description: "Premium beef tenderloin with truffle sauce and sides",
    price: 2500, // $25.00
    dietaryRestrictions: [],
    availableClasses: ["business", "first"],
    servingTime: "dinner",
    calories: 650,
    spiceLevel: "mild",
  },
  HALAL_LAMB: {
    id: "meal_halal_001",
    code: "HLAL",
    name: "Halal Lamb Kebab",
    description: "Certified halal lamb kebab with rice and yogurt sauce",
    price: 1800, // $18.00
    dietaryRestrictions: ["halal"],
    availableClasses: ["premium_economy", "business", "first"],
    servingTime: "lunch",
    calories: 520,
    spiceLevel: "medium",
  },
};

const WIFI_CATALOG: Record<string, WiFiService> = {
  HOURLY_PASS: {
    id: "wifi_hourly_001",
    code: "WIFH",
    name: "1-Hour WiFi Pass",
    description: "High-speed internet access for 1 hour",
    packageType: "hourly",
    price: 700, // $7.00
    speedMbps: 25,
    deviceLimit: 1,
    availableClasses: ["economy", "premium_economy", "business", "first"],
  },
  DAILY_PASS: {
    id: "wifi_daily_001",
    code: "WIFD",
    name: "Full-Flight WiFi Pass",
    description: "Unlimited internet for the entire flight",
    packageType: "fullFlight",
    price: 1200, // $12.00
    speedMbps: 50,
    deviceLimit: 2,
    availableClasses: ["economy", "premium_economy", "business", "first"],
  },
  PREMIUM_WIFI: {
    id: "wifi_premium_001",
    code: "WIFP",
    name: "Premium WiFi (Priority Speed)",
    description: "Premium WiFi with priority bandwidth and video streaming",
    packageType: "fullFlight",
    price: 1800, // $18.00
    speedMbps: 100,
    deviceLimit: 4,
    availableClasses: ["business", "first"],
  },
};

const BAGGAGE_CATALOG: Record<string, BaggageService> = {
  STANDARD_BAG: {
    id: "bag_standard_001",
    code: "BSTD",
    name: "Additional Checked Baggage",
    description: "Standard checked baggage (23 kg / 50 lbs)",
    baggageType: "standard",
    price: 3500, // $35.00 per piece
    maxWeightKg: 23,
    dimensions: { lengthCm: 62, widthCm: 45, heightCm: 28 },
    allowedClasses: ["economy", "premium_economy", "business", "first"],
    quantity: 1,
  },
  OVERSIZED_BAG: {
    id: "bag_oversized_001",
    code: "BOZS",
    name: "Oversized Baggage",
    description:
      "Oversized baggage for sporting equipment or large items (up to 32 kg)",
    baggageType: "oversized",
    price: 7500, // $75.00 per piece
    maxWeightKg: 32,
    dimensions: { lengthCm: 80, widthCm: 60, heightCm: 40 },
    allowedClasses: ["economy", "premium_economy", "business", "first"],
    quantity: 1,
  },
  SPORTS_EQUIPMENT: {
    id: "bag_sports_001",
    code: "BSPT",
    name: "Sports Equipment Bag",
    description: "Protected sports equipment bag (golf clubs, skis, etc.)",
    baggageType: "sports_equipment",
    price: 15000, // $150.00 per piece
    maxWeightKg: 32,
    allowedClasses: ["economy", "premium_economy", "business", "first"],
    quantity: 1,
  },
};

const ENTERTAINMENT_CATALOG: Record<string, EntertainmentService> = {
  MOVIE_BUNDLE: {
    id: "ent_movie_001",
    code: "EMOV",
    name: "Movie Bundle",
    description: "Access to 50+ movies and TV shows",
    price: 500, // $5.00
    category: "movie",
    availableClasses: ["economy", "premium_economy", "business", "first"],
    duration: 0, // All flight
  },
  MUSIC_STREAMING: {
    id: "ent_music_001",
    code: "EMUS",
    name: "Music Streaming",
    description: "Ad-free music streaming during flight",
    price: 300, // $3.00
    category: "music",
    availableClasses: ["economy", "premium_economy", "business", "first"],
    duration: 0,
  },
  GAMING_PASS: {
    id: "ent_games_001",
    code: "EGAM",
    name: "Gaming Pass",
    description: "Play 100+ games on in-flight entertainment system",
    price: 400, // $4.00
    category: "games",
    availableClasses: ["economy", "premium_economy", "business", "first"],
    duration: 0,
  },
};

export interface InflightServiceItem {
  id: string;
  name: string;
  category: "meal" | "wifi" | "baggage";
  dietaryTag?: string;
  priceCents: number;
  description: string;
}

const CATALOG: InflightServiceItem[] = [
  { id: "meal-1", name: "Vegetarian Gourmet Meal", category: "meal", dietaryTag: "vegetarian", priceCents: 2500, description: "Fresh seasonal vegetables with quinoa and herb dressing." },
  { id: "meal-2", name: "Gluten-Free Chicken Breast", category: "meal", dietaryTag: "gluten_free", priceCents: 2800, description: "Grilled organic chicken with steamed asparagus." },
  { id: "wifi-1", name: "High-Speed Flight WiFi Pass", category: "wifi", priceCents: 1500, description: "Unlimited streaming and browsing for the entire flight." },
  { id: "bag-1", name: "Extra Checked Baggage (23kg)", category: "baggage", priceCents: 4500, description: "Additional checked bag allowance up to 23kg." },
];

const bookingServicesMap: Map<string, InflightServiceItem[]> = new Map();

export class InflightServicesService {
  getCatalog(): InflightServiceItem[] {
    return CATALOG;
  }

  async addServicesToBooking(bookingId: string, serviceIds: string[]): Promise<InflightServiceItem[]> {
    const items = CATALOG.filter((s) => serviceIds.includes(s.id));
    bookingServicesMap.set(bookingId, items);
    return items;
  }

  async getBookingServices(bookingId: string): Promise<InflightServiceItem[]> {
    return bookingServicesMap.get(bookingId) || [];
  }

  calculateServicePricing(services: InflightServiceItem[]): { totalCents: number; currency: string } {
    const totalCents = services.reduce((sum, s) => sum + s.priceCents, 0);
    return { totalCents, currency: "USD" };
  }
}

export const inflightServicesService = new InflightServicesService();
