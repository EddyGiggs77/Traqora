"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, Luggage, Utensils, Play, Check } from "lucide-react";

export interface InflightServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "meal" | "wifi" | "baggage" | "entertainment";
  dietary?: string[];
}

interface ServicesCatalogProps {
  services: InflightServiceItem[];
  selectedServiceIds: string[];
  onToggleService: (service: InflightServiceItem) => void;
  currency?: string;
}

export function ServicesCatalog({
  services,
  selectedServiceIds,
  onToggleService,
  currency = "USD",
}: ServicesCatalogProps) {
  const [dietaryFilter, setDietaryFilter] = useState<string>("all");

  const dietaryOptions = [
    "vegetarian",
    "vegan",
    "halal",
    "kosher",
    "gluten_free",
    "dairy_free",
    "nut_free",
    "low_sodium",
    "diabetic",
  ];

  const filteredMeals = services.filter((s) => {
    if (s.type !== "meal") return true;
    if (dietaryFilter === "all") return true;
    return s.dietary?.includes(dietaryFilter);
  });

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>In-Flight Services & Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="meal" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="meal" className="flex items-center gap-2"><Utensils className="w-4 h-4" /> Meals</TabsTrigger>
            <TabsTrigger value="wifi" className="flex items-center gap-2"><Wifi className="w-4 h-4" /> WiFi</TabsTrigger>
            <TabsTrigger value="baggage" className="flex items-center gap-2"><Luggage className="w-4 h-4" /> Baggage</TabsTrigger>
            <TabsTrigger value="entertainment" className="flex items-center gap-2"><Play className="w-4 h-4" /> Media</TabsTrigger>
          </TabsList>

          <TabsContent value="meal" className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant={dietaryFilter === "all" ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => setDietaryFilter("all")}
              >
                All Diets
              </Badge>
              {dietaryOptions.map((diet) => (
                <Badge
                  key={diet}
                  variant={dietaryFilter === diet ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => setDietaryFilter(diet)}
                >
                  {diet.replace("__", " ")}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMeals
                .filter((s) => s.type === "meal")
                .map((service) => {
                  const isSelected = selectedServiceIds.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      className={`p-4 rounded-lg border flex flex-col justify-between gap-3 ${isSelected ? "border-primary bg-primary/5" : "border-border"}`}
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm">{service.name}</h4>
                          <span className="font-medium text-sm">${(service.price / 100).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                        {service.dietary && service.dietary.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {service.dietary.map((d) => (
                              <span key={d} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded capitalize">
                                {d}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => onToggleService(service)}
                        className="w-full"
                      >
                        {isSelected ? <><Check className="w-4 h-4 mr-1" /> Added</> : "Add Meal"}
                      </Button>
                    </div>
                  );
                })}
            </div>
          </TabsContent>

          {(['wifi', 'baggage', 'entertainment'] as const).map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services
                  .filter((s) => s.type === type)
                  .map((service) => {
                    const isSelected = selectedServiceIds.includes(service.id);
                    return (
                      <div
                        key={service.id}
                        className={`p-4 rounded-lg border flex flex-col justify-between gap-3 ${isSelected ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-sm">{service.name}</h4>
                            <span className="font-medium text-sm">${(service.price / 100).toFixed(2)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                        </div>
                        <Button
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => onToggleService(service)}
                          className="w-full"
                        >
                          {isSelected ? <><Check className="w-4 h-4 mr-1" /> Added</> : "Add Service"}
                        </Button>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
