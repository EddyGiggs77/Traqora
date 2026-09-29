"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Seat {
  seatNumber: string;
  cabinClass: "economy" | "business" | "first";
  status: "available" | "booked" | "held";
  priceCents: number;
  preference?: "window" | "aisle" | "middle" | "extra_legroom";
}

interface SeatMapProps {
  flightId: string;
  cabinClass?: "economy" | "business" | "first";
  selectedSeatNumber?: string;
  onSeatSelect: (seat: Seat) => void;
  displayCurrency?: string;
  rates?: Record<string, number>;
}

export function SeatMap({
  flightId,
  cabinClass = "economy",
  selectedSeatNumber,
  onSeatSelect,
  displayCurrency = "USD",
  rates,
}: SeatMapProps) {
  const [seats, setSeats] = useState<Seat[]>(() => {
    const rows = 12;
    const cols = ["A", "B", "C", "D", "E", "F"];
    const generated: Seat[] = [];
    for (let r = 1; r <= rows; r++) {
      for (const c of cols) {
        const seatNum = `${r}${c}`;
        const isWindow = c === "A" || c === "F";
        const isAisle = c === "C" || c === "D";
        const pref = isWindow ? "window" : isAisle ? "aisle" : "middle";
        generated.push({
          seatNumber: seatNum,
          cabinClass: r <= 2 ? "business" : "economy",
          status: Math.random() < 0.3 ? "booked" : "available",
          priceCents: r <= 2 ? 15000 : 3000,
          preference: pref,
        });
      }
    }
    return generated;
  });

  const convertPrice = (priceCents: number): string => {
    const val = (priceCents / 100) * (rates && displayCurrency !== "USD" ? rates[displayCurrency] || 1 : 1);
    return `${displayCurrency === "USD" ? "$" : displayCurrency + " "}${val.toFixed(2)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Select Your Seat</span>
          <div className="flex gap-4 text-xs font-normal">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-secondary rounded-sm" /> Available</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary rounded-sm" /> Selected</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-muted rounded-sm" /> Booked</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-2 max-w-md mx-auto">
          {seats.map((seat) => {
            const isSelected = selectedSeatNumber === seat.seatNumber;
            const isBooked = seat.status === "booked";
            return (
              <button
                key={seat.seatNumber}
                disabled={isBooked}
                onClick={() => onSeatSelect(seat)}
                className={cn(
                  "p-3 rounded-lg text-sm font-semibold transition-all border flex flex-col items-center justify-center",
                  isBooked && "bg-muted text-muted-foreground opacity-50 cursor-not-allowed",
                  isSelected && "bg-primary text-primary-foreground border-primary shadow-md",
                  !isBooked && !isSelected && "bg-background hover:bg-secondary border-border"
                )}
              >
                <span>{seat.seatNumber}</span>
                <span className="text-[10px] opacity-75">{convertPrice(seat.priceCents)}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
