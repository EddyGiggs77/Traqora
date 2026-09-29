"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, Luggage, Wifi, Play, Plus, Check } from "lucide-react";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";

interface MealService {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  dietaryFilter: string;
}

interface AncillaryService {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  type: "baggage" | "wifi" | "entertainment";
}

interface ServiceOrder {
  serviceId: string;
  name: string;
  type: "meal" | "baggage" | "wifi" | "entertainment";
  quantity: number;
  priceCents: number;
  dietaryOption?: string;
}

interface InFlightServicesProps {
  meals: MealService[];
  ancillaries: AncillaryService[];
  selectedServices: ServiceOrder[];
  onServiceAdd: (service: ServiceOrder) => void;
  onServiceRemove: (serviceId: string) => void;
  displayCurrency?: CurrencyCode;
  rates?: Record<string, number>;
}

const DIETARY_OPTIONS = [
  "all",
  "vegetarian",
  "vegan",
  "halal",
  "kosher",
  "gluten_free",
  "dairy_free",
  "nut_free",
];

export function InFlightServices({
  meals,
  ancillaries,
  selectedServices,
  onServiceAdd,
  onServiceRemove,
  displayCurrency = "USD",
  rates,
}: InFlightServicesProps) {
  const [selectedDiet, setSelectedDiet] = useState("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const convertPrice = (priceInCents: number): number => {
    if (displayCurrency === "USD" || !rates) return priceInCents / 100;
    return (priceInCents / 100) * (rates[displayCurrency] || 1);
  };

  const filteredMeals = meals.filter(
    (m) => selectedDiet === "all" || m.dietaryFilter === selectedDiet
  );

  const handleAddMeal = (meal: MealService) => {
    const qty = quantities[meal.id] || 1;
    onServiceAdd({
      serviceId: meal.id,
      name: meal.name,
      type: "meal",
      quantity: qty,
      priceCents: meal.priceCents,
      dietaryOption: meal.dietaryFilter,
    });
  };

  const handleAddAncillary = (item: AncillaryService) => {
    const qty = quantities[item.id] || 1;
    onServiceAdd({
      serviceId: item.id,
      name: item.name,
      type: item.type,
      quantity: qty,
      priceCents: item.priceCents,
    });
  };

  const updateQty = (id: string, qty: number) => {
    setQuantities({ ...quantities, [id]: Math.max(1, Math.min(10, qty)) });
  };

  const isSelected = (id: string) => selectedServices.some((s) => s.serviceId === id);

  return (
    <Tabs defaultValue="meals" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="meals" className="flex items-center gap-2">
          <Utensils className="w-4 h-4" /> Meals
        </TabsTrigger>
        <TabsTrigger value="baggage" className="flex items-center gap-2">
          <Luggage className="w-4 h-4" /> Baggage
        </TabsTrigger>
        <TabsTrigger value="wifi" className="flex items-center gap-2">
          <Wifi className="w-4 h-4" /> WiFi
        </TabsTrigger>
        <TabsTrigger value="entertainment" className="flex items-center gap-2">
          <Play className="w-4 h-4" /> Media
        </TabsTrigger>
      </TabsList>

      <TabsContent value="meals" className="space-y-4">
        <div className="flex flex-wrap gap-2 py-2">
          {DIETARY_OPTIONS.map((diet) => (
            <Button
              key={diet}
              variant={selectedDiet === diet ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDiet(diet)}
              className="capitalize"
            >
              {diet.replace("_-", " ")}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeals.map((meal) => (
            <Card key={meal.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between text-base">
                  <span>{meal.name}</span>
                  <span>{formatCurrency(convertPrice(meal.priceCents), displayCurrency)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">{meal.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {meal.dietaryFilter}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={quantities[meal.id] || 1}
                      onChange={(e) => updateQty(meal.id, parseInt(e.target.value) || 1)}
                      className="w-16 h-8 text-center"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddMeal(meal)}
                      disabled={isSelected(meal.id)}
                    >
                      {isSelected(meal.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {["baggage", "wifi", "entertainment"].map((type) => (
        <TabsContent key={type} value={type} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ancillaries
              .filter((a) => a.type === type)
              .map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between text-base">
                      <span>{item.name}</span>
                      <span>{formatCurrency(convertPrice(item.priceCents), displayCurrency)}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <div className="flex items-center justify-end gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={quantities[item.id] || 1}
                        onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 h-8 text-center"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddAncillary(item)}
                        disabled={isSelected(item.id)}
                      >
                        {isSelected(item.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
