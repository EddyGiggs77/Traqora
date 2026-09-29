"use client";

import React, { useState } from "react";
import { SeatMap, Seat } from "../../components/booking/SeatMap";
import { ServicesCatalog, InflightServiceItem } from "../../components/booking/ServicesCatalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookServicesPage() {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [selectedServices, setSelectedServices] = useState<InflightServiceItem[]>([]);

  const mockServices: InflightServiceItem[] = [
    { id: "m1", name: "Vegetarian Buddha Bowl", description: "Quinoa, roasted chickpeas, avocado, tahini dressing", price: 1800, type: "meal", dietary: ["vegetarian", "vegan", "gluten_free"] },
    { id: "m2", name: "Halal Herb Grilled Chicken", description: "Tender chicken breast with rosemary potatoes", price: 2200, type: "meal", dietary: ["halal", "dairy_free"] },
    { id: "m3", name: "Kosher Roast Beef", description: "Certified kosher roast beef with seasonal vegetables", price: 2400, type: "meal", dietary: ["kosher"] },
    { id: "w1", name: "High-Speed Flight WiFi", description: "Unlimited streaming and browsing throughout the flight", price: 1500, type: "wifi" },
    { id: "b1", name: "Extra Checked Baggage (23kg)", description: "Additional checked bag up to 23kg", price: 4500, type: "baggage" },
    { id: "e1", name: "Premium Entertainment Pass", description: "Access to latest movies, live TV, and audiobooks", price: 1000, type: "entertainment" },
  ];

  const handleToggleService = (service: InflightServiceItem) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) return prev.filter((s) => s.id !== service.id);
      return [...prev, service];
    });
  };

  const baseFare = 45000;
  const seatPrice = selectedSeat ? selectedSeat.price : 0;
  const servicesTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalAmount = baseFare + seatPrice + servicesTotal;

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Enhance Your Journey</h1>
      </div>

      <SeatMap
        flightId="flight-1"
        selectedSeat={selectedSeat?.number}
        onSeatSelect={(seat) => setSelectedSeat(seat.number ? seat : null)}
        onSeatLock={async () => true}
        onSeatUnlock={async () => true}
      />

      <ServicesCatalog
        services={mockServices}
        selectedServiceIds={selectedServices.map((s) => s.id)}
        onToggleService={handleToggleService}
      />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Base Flight Fare</span>
            <span>${(baseFare / 100).toFixed(2)}</span>
          </div>
          {selectedSeat && (
            <div className="flex justify-between text-sm">
              <span>Seat Selection ({selectedSeat.number})</span>
              <span>${(seatPrice / 100).toFixed(2)}</span>
            </div>
          )}
          {selectedServices.map((s) => (
            <div key={s.id} className="flex justify-between text-sm">
              <span>{s.name}</span>
              <span>${(s.price / 100).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold text-base">
            <span>Total Amount</span>
            <span>${(totalAmount / 100).toFixed(2)}</span>
          </div>
          <Button className="w-full mt-4" size="lg">
            Proceed to Payment
          </Button>
        </CardContent>
      </Card> 
    </div>
  );
}
