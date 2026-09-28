"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

interface SeatMapSelectorProps {
  flightId: string;
  bookingId?: string;
  selectedSeat?: string | null;
  onSeatSelect: (seatNumber: string, price: number) => void;
}

export function SeatMapSelector({
  flightId,
  bookingId,
  selectedSeat,
  onSeatSelect,
}: SeatMapSelectorProps) {
  const [seatMapData, setSeatMapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    fetch(`${apiBase}/api/services/seats/${flightId}`)
      .then((res) => res.json())
      .then((data) => {
        setSeatMapData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load seat availability");
        setLoading(false);
      });
  }, [flightId]);

  const handleSelect = async (seatNumber: string, price: number, isAvailable: boolean) => {
    if (!isAvailable) return;
    if (bookingId) {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      try {
        await fetch(`${apiBase}/api/services/seat/lock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flightId, seatNumber, bookingId }),
        });
      } catch (e) {
        console.error("Failed to lock seat", e);
      }
    }
    onSeatSelect(seatNumber, price);
  };

  if (loading) return <div className="p-8 text-center">Loading seat map...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const rows = seatMapData?.seatMap ? Object.keys(seatMapData.seatMap) : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const cols = ["A", "B", "C", "D", "E", "F"];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Select Your Seat</span>
          {selectedSeat && (
            <Badge variant="default" className="bg-primary text-primary-foreground">
              Selected: {selectedSeat}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-secondary border border-border" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">✓</div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted opacity-50" />
            <span>Occupied</span>
          </div>
        </div>

        <div className="p-6 bg-secondary/20 rounded-xl border border-border overflow-x-auto">
          <div className="min-w-[320px] flex flex-col items-center gap-3">
            <div className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-2">Front of Aircraft</div>
            {rows.map((rowNum) => (
              <div key={rowNum} className="flex items-center gap-2">
                <span className="w-6 text-xs text-muted-foreground font-medium text-right">{rowNum}</span>
                <div className="flex gap-1.5">
                  {cols.slice(0, 3).map((col) => {
                    const seatId = `${rowNum}${col}`;
                    const isSelected = selectedSeat === seatId;
                    const seatInfo = seatMapData?.seatMap?.[rowNum]?.[col];
                    const isAvailable = seatInfo ? seatInfo.available : true;
                    const price = seatInfo?.price || 1500;

                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSelect(seatId, price, isAvailable)}
                        disabled={!isAvailable}
                        className={cn(
                          "w-9 h-9 rounded-md text-xs font-semibold flex items-center justify-center transition-all",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50"
                            : isAvailable
                            ? "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border"
                            : "bg-muted text-muted-foreground opacity-40 cursor-not-allowed"
                        )}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
                <div className="w-6" />
                <div className="flex gap-1.5">
                  {cols.slice(3, 6).map((col) => {
                    const seatId = `${rowNum}${col}`;
                    const isSelected = selectedSeat === seatId;
                    const seatInfo = seatMapData?.seatMap?.[rowNum]?.[col];
                    const isAvailable = seatInfo ? seatInfo.available : true;
                    const price = seatInfo?.price || 1500;

                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSelect(seatId, price, isAvailable)}
                        disabled={!isAvailable}
                        className={cn(
                          "w-9 h-9 rounded-md text-xs font-semibold flex items-center justify-center transition-all",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50"
                            : isAvailable
                            ? "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border"
                            : "bg-muted text-muted-foreground opacity-40 cursor-not-allowed"
                        )}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
                <span className="w-6 text-xs text-muted-foreground font-medium">{rowNum}</span>
              </div>
            ))}
            <div className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mt-2">Rear of Aircraft</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
