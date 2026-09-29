"";

import React, { useState } from "react";

export interface Seat {
  seatNumber: string;
  cabinClass: string;
  isAvailable: boolean;
  priceCents: number;
  preference: "window" | "aisle" | "middle" | "extra_legroom";
}

interface SeatMapProps {
  flightId: string;
  seats: Seat[];
  selectedSeat?: string;
  onSelectSeat: (seatNumber: string) => void;
}

export function SeatMap({ flightId, seats, selectedSeat, onSelectSeat }: SeatMapProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredSeats = seats.filter((s) => {
    if (filter === "all") return true;
    return s.preference === filter;
  });

  return (
    <div className="w-full max-w-2xl mx-auto border rounded-lg p-6 bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-lg">Select Your Seat</span>
        <div className="flex gap-2">
          {['all', 'window', 'aisle', 'extra_legroom'].map((f) => (
            <button
              key={f}
              type="button"
              className={`px-3 py-1 text-xs rounded border ${filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
              onClick={() => setFilter(f)}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 text-center">
        {filteredSeats.map((seat) => {
          const isSelected = selectedSeat === seat.seatNumber;
          return (
            <button
              key={seat.seatNumber}
              type="button"
              disabled={!seat.isAvailable}
              className={`h-12 flex flex-col items-center justify-center text-xs font-bold rounded border ${isSelected ? "bg-blue-600 text-white border-blue-600" : seat.isAvailable ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-50" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              onClick={() => onSelectSeat(seat.seatNumber)}
            >
              <span>{seat.seatNumber}</span>
              <span className="text-[10px] opacity-70">
                ${(seat.priceCents / 100).toFixed(0)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
