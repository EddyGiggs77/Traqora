"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Wifi, Luggage, Utensils, Play, Plus, X } from "lucide-react";

interface InFlightServicesSelectorProps {
  bookingId: string;
  cabinClass?: string;
  onServiceAdded?: () => void;
}

export function InFlightServicesSelector({
  bookingId,
  cabinClass = "economy",
  onServiceAdded,
}: InFlightServicesSelectorProps) {
  const [catalog, setCatalog] = useState<any>(null);
  const [selectedMeals, setSelectedMeals] = useState<any[]>([]);
  const [selectedWifi, setSelectedWifi] = useState<any[]>([]);
  const [selectedBaggage, setSelectedBaggage] = useState<any[]>([]);
  const [selectedEntertainment, setSelectedEntertainment] = useState<any[]>([]);
  const [dietaryFilter, setDietaryFilter] = useState<string>("all");

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    fetch(`${apiBase}/api/services/catalog?cabinClass=${cabinClass}`)
      .then((res) => res.json())
      .then((data) => setCatalog(data))
      .catch(() => {});
  }, [cabinClass]);

  const addMeal = async (meal: any) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    try {
      const res = await fetch(`${apiBase}/api/services/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          meals: [{ mealId: meal.id, dietary: meal.dietary || "vegetarian", quantity: 1 }],
        }),
      });
      if (res.ok) {
        setSelectedMeals([...selectedMeals, meal]);
        if (onServiceAdded) onServiceAdded();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addWifi = async (wifiPkg: any) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    try {
      const res = await fetch(`${apiBase}/api/services/wifi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          wifi: [{ wifiId: wifiPkg.id, packageType: wifiPkg.packageType || "fullFlight", quantity: 1 }],
        }),
      });
      if (res.ok) {
        setSelectedWifi([...selectedWifi, wifiPkg]);
        if (onServiceAdded) onServiceAdded();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addBaggage = async (bag: any) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    try {
      const res = await fetch(`${apiBase}/api/services/baggage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          baggage: [{ baggageId: bag.id, pieces: 1, baggageType: bag.baggageType || "standard" }],
        }),
      });
      if (res.ok) {
        setSelectedBaggage([...selectedBaggage, bag]);
        if (onServiceAdded) onServiceAdded();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addEntertainment = async (ent: any) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    try {
      const res = await fetch(`${apiBase}/api/services/entertainment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          entertainment: [{ entertainmentId: ent.id, quantity: 1 }],
        }),
      });
      if (res.ok) {
        setSelectedEntertainment([...selectedEntertainment, ent]);
        if (onServiceAdded) onServiceAdded();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const mealsList = catalog?.meals || [
    { id: "m-1", name: "Classic Chicken", dietary: "none", price: 1500, description: "Grilled chicken with roasted vegetables." },
    { id: "m-2", name: "Vegetarian Pasta", dietary: "vegetarian", price: 1200, description: "Penne pasta with marinara sauce and parmesan." },
    { id: "m-3", name: "Vegan Curry", dietary: "vegan", price: 1300, description: "Chickpea and coconut curry with jasmine rice." },
    { id: "m-4", name: "Halal Lamb", dietary: "halal", price: 1800, description: "Tender lamb with spiced couscous." },
  ];

  const wifiList = catalog?.wifi || [
    { id: "w-1", name: "Basic Browsing", packageType: "fullFlight", price: 1000, description: "Messaging and web browsing for the entire flight." },
    { id: "w-2", name: "Streaming Pass", packageType: "fullFlight", price: 2500, description: "High-speed connection supporting video streaming." },
  ];

  const baggageList = catalog?.baggage || [
    { id: "b-1", name: "Extra Checked Bag (50lbs)", baggageType: "standard", price: 3500, description: "One additional standard checked bag." },
    { id: "b-2", name: "Oversized Equipment", baggageType: "sports_equipment", price: 7500, description: "Skis, golf clubs, or surfboards." },
  ];

  const entertainmentList = catalog?.entertainment || [
    { id: "e-1", name: "Premium Movie Bundle", price: 800, description: "Access to latest release blockbusters and boxsets." },
  ];

  const filteredMeals = dietaryFilter === "all"
    ? mealsList
    : mealsList.filter((m: any) => m.dietary === dietaryFilter);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>In-Flight Services & Add-ons</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="meals" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              <span>Meals</span>
            </TabsTrigger>
            <TabsTrigger value="wifi" className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <span>WiFi</span>
            </TabsTrigger>
            <TabsTrigger value="baggage" className="flex items-center gap-2">
              <Luggage className="w-4 h-4" />
              <span>Baggage</span>
            </TabsTrigger>
            <TabsTrigger value="entertainment" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>Media</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="space-y-4">
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
              <span className="text-sm font-medium text-muted-foreground mr-2">Dietary Filter:</span>
              {["all", "vegetarian", "vegan", "halal", "kosher", "gluten_free"].map((diet) => (
                <Button
                  key={diet}
                  variant={dietaryFilter === diet ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDietaryFilter(diet)}
                  className="capitalize"
                >
                  {diet.replace("_id", " ")}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMeals.map((meal: any) => (
                <div key={meal.id} className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{meal.name}</h4>
                      <Badge variant="secondary">${(meal.price / 100).toFixed(2)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>
                  </div>
                  <Button size="sm" onClick={() => addMeal(meal)} className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-1" /> Add Meal
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wifi" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wifiList.map((wifiPkg: any) => (
                <div key={wifiPkg.id} className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{wifiPkg.name}</h4>
                      <Badge variant="secondary">${(wifiPkg.price / 100).toFixed(2)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{wifiPkg.description}</p>
                  </div>
                  <Button size="sm" onClick={() => addWifi(wifiPkg)} className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-1" /> Add WiFi Pass
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="baggage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {baggageList.map((bag: any) => (
                <div key={bag.id} className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{bag.name}</h4>
                      <Badge variant="secondary">${(bag.price / 100).toFixed(2)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{bag.description}</p>
                  </div>
                  <Button size="sm" onClick={() => addBaggage(bag)} className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-1" /> Add Baggage
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="entertainment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entertainmentList.map((ent: any) => (
                <div key={ent.id} className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{ent.name}</h4>
                      <Badge variant="secondary">${(ent.price / 100).toFixed(2)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{ent.description}</p>
                  </div>
                  <Button size="sm" onClick={() => addEntertainment(ent)} className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-1" /> Add Entertainment
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
