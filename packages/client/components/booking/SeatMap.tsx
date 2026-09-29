"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";

interface Seat {
  seatNumber: string;
  cabinClass: "economy" | "business" | "first";
  isAvailable: boolean;
  isHeld?: boolean;
  priceCents: number;
  characteristics: string[];
}

interface SeatMapProps {
  flightId: string;
  seats: Seat[];
  selectedSeatNumber?: string;
  onSelectSeat: (seatNumber: string, priceCents: number) => void;
  displayCurrency?: CurrencyCode;
  rates?: Record<string, number>;
}

export function SeatMap({
  flightId,
  seats,
  selectedSeatNumber,
  onSelectSeat,
  displayCurrency = "USD",
  rates,
}: SeatMapProps) {
  const [filterClass, setFilterClass] = useState<string>("all");

  const convertPrice = (priceInCents: number): number => {
    if (displayCurrency === "USD" || !rates) return priceInCents / 100;
    return (priceInCents / 100) * (rates[displayCurrency] || 1);
  };

  const filteredSeats = seats.filter(
    (s) => filterClass === "all" || s.cabinClass === filterClass
  );

  // Group seats by row number
  const rowsMap = filteredSeats.reduce((acc, seat) => {
    const match = seat.seatNumber.match(/^([0-9]{1,2})([A-F])$/);
    if (!match) return acc;
    const [, rowStr, col] = match;
    const rowNum = parseInt(rowStr, 10);
    if (!acc[rowNum]) acc[rowNum] = {};
    acc[rowNum][col] = seat;
    return acc;
  }, {} as Record<number, Record<string, Seat>>);

  const sortedRowNumbers = Object.keys(rowsMap)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Select Your Seat</span>
          <div className="flex gap-2">
            {["all", "economy", "business", "first"].map((cls) => (
              <Button
                key={cls}
                variant={filterClass === cls ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterClass(cls)}
                className="capitalize"
              >
                {cls}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" /> Selected
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-secondary border" /> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted opacity-50" /> Occupied / Held
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 border rounded-md space-y-3">
          {sortedRowNumbers.map((rowNum) => {
            const rowSeats = rowsMap[rowNum];
            const cols = ["A", "B", "C", "D", "E", "F"];
            return (
              <div key={rowNum} className="flex items-center justify-center gap-2">
                <span className="w-8 text-right text-xs font-mono text-muted-foreground">
                  {rowNum}
                </span>
                <div className="flex gap-1">
                  {cols.map((col, idx) => {
                    const seat = rowSeats[col];
                    if (!seat) {
                      return <div key={col} className="w-9 h-9" />;
                    }
                    const isSelected = selectedSeatNumber === seat.seatNumber;
                    const isClickable = seat.isAvailable && !seat.isHeld;

                    return (
                      <button
                        key={col}
                        disabled={!isClickable}
                        onClick={() => onSelectSeat(seat.seatNumber, seat.priceCents)}
                        className={cn(
                          "w-9 h-9 rounded text-xs font-medium flex items-center justify-center transition-colors border",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : isClickable
                            ? "bg-background hover:bg-accent border-input"
                            : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                        )}
                        title={`${seat.seatNumber} - ${seat.cabinClass} - ${formatCurrency(convertPrice(seat.priceCents), displayCurrency)}`}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {selectedSeatNumber && (
          <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium">Selected Seat: {selectedSeatNumber}</p>
              <p className="text-xs text-muted-foreground">
                Includes seat selection fee and preferences.
              </p>
            </div>
            <Badge variant="outline">Confirmed Selection</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
