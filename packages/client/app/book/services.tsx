"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InFlightServices } from "../../components/booking/InFlightServices";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { formatCurrency } from "../../lib/currency";

interface MealService {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  dietaryFilter: string;
}

interface AncillaryService {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  type: "baggage" | "wifi" | "entertainment";
}

interface ServiceOrder {
  serviceId: string;
  name: string;
  type: "meal" | "baggage" | "wifi" | "entertainment";
  quantity: number;
  priceCents: number;
  dietaryOption?: string;
}

export default function ServicesBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flightId") || "default-flight";
  const seatNumber = searchParams.get("seatNumber");
  const seatPrice = parseInt(searchParams.get("seatPrice") || "0", 10);

  const [meals, setMeals] = useState<MealService[]>([]);
  const [ancillaries, setAncillaries] = useState<AncillaryService[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`/api/services/inflight/${flightId}`);
        if (res.ok) {
          const data = await res.json();
          setMeals(data.meals || []);
          setAncillaries(data.ancillaries || []);
        } else {
          setMeals([
            { id: "m1", name: "Vegetarian Pasta", description: "Fresh pasta with garden vegetables", priceCents: 1500, dietaryFilter: "vegetarian" },
            { id: "m2", name: "Halal Chicken Grill", description: "Grilled chicken with rice and herbs", priceCents: 1800, dietaryFilter: "halal" },
          ]);
          setAncillaries([
            { id: "b1", name: "Extra Checked Bag (23kg)", description: "Additional checked luggage allowance", priceCents: 4500, type: "baggage" },
            { id: "w1", name: "High-Speed Flight WiFi", description: "Full flight streaming-speed internet", priceCents: 2000, type: "wifi" },
            { id: "e1", name: "Premium Entertainment Pass", description: "Blockbuster movies and live TV", priceCents: 1200, type: "entertainment" },
          ]);
        }
      } catch {
        setMeals([
          { id: "m1", name: "Vegetarian Pasta", description: "Fresh pasta with garden vegetables", priceCents: 1500, dietaryFilter: "vegetarian" },
        ]);
        setAncillaries([
          { id: "w1", name: "High-Speed Flight WiFi", description: "Full flight internet", priceCents: 2000, type: "wifi" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [flightId]);

  const handleServiceAdd = (service: ServiceOrder) => {
    setSelectedServices([...selectedServices.filter(s => s.serviceId !== service.serviceId), service]);
  };

  const handleServiceRemove = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(s => s.serviceId !== serviceId));
  };

  const servicesTotalCents = selectedServices.reduce((sum, s) => sum + s.priceCents * s.quantity, 0);
  const grandTotalCents = seatPrice + servicesTotalCents;

  const handleCompleteBooking = () => {
    router.push(`/book/checkout?flightId=${flightId}&seatNumber=${seatNumber || ""}&services=${encodeURIComponent(JSON.stringify(selectedServices))}`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading in-flight services...</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">In-Flight Services & Amenities</h1>
      <InFlightServices
        meals={meals}
        ancillaries={ancillaries}
        selectedServices={selectedServices}
        onServiceAdd={handleServiceAdd}
        onServiceRemove={handleServiceRemove}
      />

      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {seatNumber && (
            <div className="flex justify-between text-sm">
              <span>Seat Selection ({seatNumber})</span>
              <span>{formatCurrency(seatPrice / 100, "USD")}</span>
            </div>
          )}
          {selectedServices.map(s => (
            <div key={s.serviceId} className="flex justify-between text-sm">
              <span>{s.name} (x{s.quantity})</span>
              <span>{formatCurrency((s.priceCents * s.quantity) / 100, "USD")}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total Ancillary & Seat Cost</span>
            <span>{formatCurrency(grandTotalCents / 100, "USD")}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button onClick={handleCompleteBooking}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
