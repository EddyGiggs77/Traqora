import React, { useState } from 'react';

interface InflightServicesProps {
  cabinClass: string;
  bookingId: string;
  onUpdate: (services: any[]) => void;
}

export default function InflightServices({ cabinClass, bookingId, onUpdate }: InflightServicesProps) {
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});

  const catalog = [
    { id: 'meal-veg', name: 'Vegetarian Meal', price: 1500 },
    { id: 'wifi-full', name: 'Full Flight WiFi', price: 2500 },
    { id: 'baggage-extra', name: 'Extra Baggage', price: 4000 },
  ];

  const toggleService = (id: string) => {
    const updated = { ...selectedServices };
    if (updated[id]) {
      delete updated[id];
    } else {
      updated[id] = 1;
    }
    setSelectedServices(updated);
    onUpdate(Object.entries(updated).map(([sId, qty]) => ({ id: sId, quantity: qty })));
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">In-flight Services</h2>
      <div className="space-y-2">
        {catalog.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-2 border rounded">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">${(item.price / 100).toFixed(2)}</p>
            </div>
            <button
              onClick={() => toggleService(item.id)}
              className={`px-3 py-1 rounded ${selectedServices[item.id] ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              {selectedServices[item.id] ? 'Selected' : 'Add'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
