import React, { useState } from 'react';

interface SeatSelectionProps {
  flightId: string;
  bookingId: string;
  onSelect: (seat: string) => void;
}

export default function SeatSelection({ flightId, bookingId, onSelect }: SeatSelectionProps) {
  const [selectedSeat, setSelectedSeat] = useState<string>('');
  const seats = ['12A', '12B', '12C', '12D', '12E', '12F'];

  const handleSelect = (seat: string) => {
    setSelectedSeat(seat);
    onSelect(seat);
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Select Your Seat</h2>
      <div className="grid grid-cols-3 gap-2">
        {seats.map((seat) => (
          <button
            key={seat}
            onClick={() => handleSelect(seat)}
            className={`p-2 border rounded ${selectedSeat === seat ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            {seat}
          </button>
        ))}
      </div>
    </div>
  );
}
