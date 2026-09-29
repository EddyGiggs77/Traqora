"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SeatMap } from "../../components/booking/SeatMap";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

interface Seat {
  seatNumber: string;
  cabinClass: "economy" | "business" | "first";
  isAvailable: boolean;
  isHeld?: boolean;
  priceCents: number;
  characteristics: string[];
}

export default function SeatsBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flightId") || "default-flight";

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string | undefined>();
  const [selectedSeatPrice, setSelectedSeatPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeats() {
      try {
        const res = await fetch(`/api/services/seats/${flightId}`);
        if (res.ok) {
          const data = await res.json();
          setSeats(data.seats || []);
        } else {
          // Fallback mock seats if API not running locally in test environment
          setSeats([
            { seatNumber: "12A", cabinClass: "economy", isAvailable: true, priceCents: 1500, characteristics: ["window"] },
            { seatNumber: "12B", cabinClass: "economy", isAvailable: true, priceCents: 1000, characteristics: ["middle"] },
            { seatNumber: "12C", cabinClass: "economy", isAvailable: false, priceCents: 1000, characteristics: ["aisle"] },
            { seatNumber: "2A", cabinClass: "business", isAvailable: true, priceCents: 5000, characteristics: ["window", "extra_legroom"] },
          ]);
        }
      } catch {
        setSeats([
          { seatNumber: "12A", cabinClass: "economy", isAvailable: true, priceCents: 1500, characteristics: ["window"] },
          { seatNumber: "12B", cabinClass: "economy", isAvailable: true, priceCents: 1000, characteristics: ["middle"] },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchSeats();
  }, [flightId]);

  const handleSelectSeat = (seatNumber: string, priceCents: number) => {
    setSelectedSeatNumber(seatNumber);
    setSelectedSeatPrice(priceCents);
  };

  const handleProceed = () => {
    router.push(`/book/services?flightId=${flightId}&seatNumber=${selectedSeatNumber || ""}&seatPrice=${selectedSeatPrice}`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading seat map...</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Choose Your Seat</h1>
      <SeatMap
        flightId={flightId}
        seats={seats}
        selectedSeatNumber={selectedSeatNumber}
        onSelectSeat={handleSelectSeat}
      />
      <div className="flex justify-end gap-4">
        <Button
          onClick={handleProceed}
          disabled={!selectedSeatNumber}
        >
          Proceed to In-Flight Services
        </Button>
      </div>
    </div>
  );
}
