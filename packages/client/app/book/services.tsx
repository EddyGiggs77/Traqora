"use client";

import React, { useState } from "react";
import { SeatMap, Seat } from "../../components/booking/SeatMap";
import { InFlightServices, InflightServiceItem } from "../../components/booking/InFlightServices";

export default function BookingServicesPage() {
  const [selectedSeat, setSelectedSeat] = useState<string>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const mockSeats: Seat[] = [
    { seatNumber: "12A", cabinClass: "economy", isAvailable: true, priceCents: 2000, preference: "window" },
    { seatNumber: "12B", cabinClass: "economy", isAvailable: true, priceCents: 1500, preference: "middle" },
    { seatNumber: "12C", cabinClass: "economy", isAvailable: false, priceCents: 1500, preference: "aisle" },
    { seatNumber: "1F", cabinClass: "business", isAvailable: true, priceCents: 5000, preference: "extra_legroom" },
  ];

  const mockServices: InflightServiceItem[] = [
    { id: "s1", name: "Vegetarian Meal", category: "meal", dietaryInfo: ["vegetarian", "gluten_free"], priceCents: 1500 },
    { id: "s2", name: "High-Speed WiFi (Flight Pass)", category: "wifi", priceCents: 2000 },
    { id: "s3", name: "Extra Checked Baggage (23kg)", category: "baggage", priceCents: 4000 },
  ];

  const handleToggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleComplete = () => {
    alert(`Booking updated with Seat: ${selectedSeat || "None"} and Services: ${selectedServices.join(", ")}`);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Customize Your Flight</h1>
      <SeatMap
        flightId="flight-1"
        seats={mockSeats}
        selectedSeat={selectedSeat}
        onSelectSeat={setSelectedSeat}
      />
      <InFlightServices
        services={mockServices}
        selectedServiceIds={selectedServices}
        onToggleService={handleToggleService}
      />
      <div className="flex justify-center">
        <button
          type="button"
          className="px-6 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
          onClick={handleComplete}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
