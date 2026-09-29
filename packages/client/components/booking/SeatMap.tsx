"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Seat {
  number: string;
  row: number;
  column: string;
  cabinClass: "economy" | "business" | "first";
  status: "available" | "occupied" | "locked" | "held";
  price: number;
  features?: string[];
}

interface SeatMapProps {
  flightId: string;
  cabinClass?: "economy" | "business" | "first";
  selectedSeat?: string;
  onSeatSelect: (seat: Seat) => void;
  onSeatLock?: (seatNumber: string) => Promise<boolean>;
  onSeatUnlock?: (seatNumber: string) => Promise<boolean>;
  currency?: string;
}

export function SeatMap({
  flightId,
  cabinClass = "economy",
  selectedSeat,
  onSeatSelect,
  onSeatLock,
  onSeatUnlock,
  currency = "USD",
}: SeatMapProps) {
  const [loadingSeat, setLoadingSeat] = useState<string | null>(null);
  const [seats, setSeats] = useState<Seat[]>(() => {
    const generated: Seat[] = [];
    const rows = cabinClass === "economy" ? 20 : 10;
    const cols = ["A", "B", "C", "D", "E", "F"];
    for (let r = 1; r <= rows; r++) {
      for (const c of cols) {
        const number = `${r}${c}`;
        const isOccupied = (r * 3 + c.charCodeAt(0)) % 7 === 0;
        const isExtraLegroom = r === 1 || r === 10;
        generated.push({
          number,
          row: r,
          column: c,
          cabinClass,
          status: isOccupied ? "occupied" : "available",
          price: isExtraLegroom ? 3000 : 1500,
          features: isExtraLegroom ? ["extra_legroom"] : [],
        });
      }
    }
    return generated;
  });

  const handleSeatClick = async (seat: Seat) => {
    if (seat.status === "occupied" || seat.status === "locked") return;

    if (selectedSeat === seat.number) {
      if (onSeatUnlock) {
        setLoadingSeat(seat.number);
        try {
          await onSeatUnlock(seat.number);
        } finally {
          setLoadingSeat(null);
        }
      }
      onSeatSelect({ ...seat, number: "" });
      return;
    }

    if (onSeatLock) {
      setLoadingSeat(seat.number);
      try {
        const success = await onSeatLock(seat.number);
        if (!success) return;
      } catch (err) {
        console.error("Failed to lock seat", err);
        return;
      } finally {
        setLoadingSeat(null);
      }
    }

    onSeatSelect(seat);
  };

  const rowsMap = seats.reduce<Record<number, Seat[]>>((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Select Your Seat</span>
          <div className="flex gap-4 text-xs font-normal">
            <div className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-muted border inline-block" /> Available</div>
            <div className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-primary inline-block" /> Selected</div>
            <div className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-destructive/40 inline-block" /> Occupied</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="w-full bg-muted/30 p-4 rounded-xl flex flex-col items-center gap-2 overflow-x-auto">
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Front of Aircraft</div>
          {Object.entries(rowsMap).map(([rowNum, rowSeats]) => (
            <div key={rowNum} className="flex items-center gap-2">
              <span className="w-6 text-xs text-muted-foreground text-right">{rowNum}</span>
              <div className="flex gap-1.5">
                {rowSeats.slice(0, 3).map((seat) => {
                  const isSelected = selectedSeat === seat.number;
                  const isOccupied = seat.status === "occupied" || seat.status === "locked";
                  return (
                    <button
                      key={seat.number}
                      type="button"
                      disabled={isOccupied || loadingSeat === seat.number}
                      onClick={() => handleSeatClick(seat)}
                      className={cn(
                        "w-9 h-9 rounded-md text-xs font-medium transition-all flex items-center justify-center border",
                        isOccupied && "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
                        isSelected && "bg-primary text-primary-foreground border-primary shadow",
                        !isOccupied && !isSelected && "bg-card hover:border-primary"
                      )}
                    >
                      {seat.column}
                    </button>
                  );
                })}
                <div className="w-4" />
                {rowSeats.slice(3, 6).map((seat) => {
                  const isSelected = selectedSeat === seat.number;
                  const isOccupied = seat.status === "occupied" || seat.status === "locked";
                  return (
                    <button
                      key={seat.number}
                      type="button"
                      disabled={isOccupied || loadingSeat === seat.number}
                      onClick={() => handleSeatClick(seat)}
                      className={cn(
                        "w-9 h-9 rounded-md text-xs font-medium transition-all flex items-center justify-center border",
                        isOccupied && "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
                        isSelected && "bg-primary text-primary-foreground border-primary shadow",
                        !isOccupied && !isSelected && "bg-card hover:border-primary"
                      )}
                    >
                      {seat.column}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {selectedSeat && (
          <div className="w-full flex justify-between items-center bg-accent/50 p-3 rounded-lg">
            <div>
              <span className="text-sm font-semibold">Selected Seat: {selectedSeat}</span>
            </div>
            <Badge variant="default">Confirmed Hold</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
