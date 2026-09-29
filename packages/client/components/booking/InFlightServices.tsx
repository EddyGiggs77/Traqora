"use client";

import React, { useState } from "react";

export interface InflightServiceItem {
  id: string;
  name: string;
  category: "meal" | "wifi" | "baggage" | "entertainment";
  dietaryInfo?: string[];
  priceCents: number;
}

interface InFlightServicesProps {
  services: InflightServiceItem[];
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
}

export function InFlightServices({
  services,
  selectedServiceIds,
  onToggleService,
}: InFlightServicesProps) {
  const [dietaryFilter, setDietaryFilter] = useState<string>("all");

  const dietaryOptions = ["vegetarian", "vegan", "halal", "kosher", "gluten_free"];

  const filteredServices = services.filter((s) => {
    if (dietaryFilter === "all") return true;
    return s.dietaryInfo?.includes(dietaryFilter);
  });

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 border rounded-lg p-6 bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-lg">In-Flight Services & Amenities</span>
        <select
          className="text-sm border rounded p-1"
          value={dietaryFilter}
          onChange={(e) => setDietaryFilter(e.target.value)}
        >
          <option value="all">All Dietary Options</option>
          {dietaryOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {filteredServices.map((service) => {
          const isSelected = selectedServiceIds.includes(service.id);
          return (
            <div
              key={service.id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div>
                <h4 className="font-semibold">{service.name}</h4>
                <p className="text-xs text-gray-500 capitalize">Category: {service.category}</p>
                {service.dietaryInfo && service.dietaryInfo.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {service.dietaryInfo.map((diet) => (
                      <span key={diet} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        {diet}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">${(service.priceCents / 100).toFixed(2)}</span>
                <button
                  type="button"
                  className={`px-3 py-1 text-xs rounded border ${isSelected ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`}
                  onClick={() => onToggleService(service.id)}
                >
                  {isSelected ? "Selected" : "Add"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
