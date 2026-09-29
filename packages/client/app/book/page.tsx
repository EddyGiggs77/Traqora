import React from 'react';
import SeatSelection from '../../components/booking/SeatSelection';
import InflightServices from '../../components/booking/InflightServices';

export default function BookPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Complete Your Booking</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SeatSelection flightId="default-flight-id" bookingId="default-booking-id" onSelect={(seat) => console.log(seat)} />
        <InflightServices cabinClass="economy" bookingId="default-booking-id" onUpdate={(services) => console.log(services)} />
      </div>
    </main>
  );
}
