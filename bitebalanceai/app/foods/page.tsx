"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { FoodHeader } from "@/components/foods/FoodHeader";
import { FoodResultsList } from "@/components/foods/FoodResultsList";
import { FoodDetailPanel } from "@/components/foods/FoodDetailPanel";
import { BottomNav } from "@/components/mobile/BottomNav";

type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  category?: string;
};

export default function FoodsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedMealType, setSelectedMealType] = React.useState("Breakfast");
  const [foods, setFoods] = React.useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = React.useState<Food | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    const res = await fetch(`/api/foods?${params.toString()}`);
    setLoading(false);
    if (!res.ok) {
      setError("Failed to load foods.");
      return;
    }
    const j = await res.json();
    const items = j.items ?? [];
    setFoods(items);
    if (items.length > 0 && !selectedFood) {
      setSelectedFood(items[0]);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) load();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  async function handleAddToLog(foodId: string, mealType: string) {
    const res = await fetch("/api/meal-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foodId, quantity: 1, mealType }),
    });
    if (res.ok) {
      alert(`Added to ${mealType}!`);
    }
  }

  const similarFoods = foods
    .filter((f) => f.id !== selectedFood?.id && f.category === selectedFood?.category)
    .slice(0, 5);

  return (
    <DashboardShell>
      <div className="space-y-6 pb-20 md:pb-6">
        {/* Header with Search & Filters */}
        <FoodHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedMealType={selectedMealType}
          onMealTypeChange={setSelectedMealType}
        />

        {error && <div className="text-sm text-red-600">{error}</div>}

        {/* Three Column Layout: Results List | Detail Panel */}
        <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
          {/* Left: Food Results List */}
          <div className="order-2 lg:order-1">
            <FoodResultsList
              foods={foods}
              onSelect={setSelectedFood}
              selectedId={selectedFood?.id}
              title={`${foods.length} RESULTS`}
            />
          </div>

          {/* Right: Food Detail Panel */}
          <div className="order-1 lg:order-2">
            <FoodDetailPanel
              food={selectedFood}
              similarFoods={similarFoods}
              mealType={selectedMealType}
              onAddToLog={handleAddToLog}
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </DashboardShell>
  );
}

