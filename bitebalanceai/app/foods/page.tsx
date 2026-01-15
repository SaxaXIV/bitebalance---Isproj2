"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { FoodHeader } from "@/components/foods/FoodHeader";
import { FoodResultsList } from "@/components/foods/FoodResultsList";
import { FoodDetailPanel } from "@/components/foods/FoodDetailPanel";
import { BottomNav } from "@/components/mobile/BottomNav";
import { emitMealLogged } from "@/lib/clientEvents";

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
  const [selectedSource, setSelectedSource] = React.useState<"all" | "fnri" | "ai">("all");
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
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
    if (selectedSource !== "all") params.set("source", selectedSource);
    params.set("page", String(page));
    params.set("limit", "50");
    const res = await fetch(`/api/foods?${params.toString()}`);
    setLoading(false);
    if (!res.ok) {
      setError("Failed to load foods.");
      return;
    }
    const j = await res.json();
    const items = j.items ?? [];
    setFoods(items);
    setTotal(j.total ?? items.length);
    if (items.length > 0 && !selectedFood) {
      setSelectedFood(items[0]);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedSource, page]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) load();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  async function handleAddToLog(foodId: string, mealType: string, quantity: number) {
    const res = await fetch("/api/meal-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foodId, quantity, mealType }),
    });
    if (res.ok) {
      emitMealLogged();
    }
  }

  const similarFoods = foods
    .filter((f) => f.id !== selectedFood?.id && f.category === selectedFood?.category)
    .slice(0, 5);

  return (
    <DashboardShell>
      <div className="space-y-6 pb-20 md:pb-6">
        {/* Source Tabs */}
        <div className="flex gap-2 border-b border-zinc-200">
          {(["all", "fnri", "ai"] as const).map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => setSelectedSource(source)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors capitalize ${
                selectedSource === source
                  ? "border-emerald-500 text-emerald-900"
                  : "border-transparent text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {source === "all" ? "All Foods" : source === "fnri" ? "FNRI Foods" : "AI-Generated"}
            </button>
          ))}
        </div>

        {/* Header with Search & Filters */}
        <FoodHeader
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setPage(1);
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            setPage(1);
          }}
          selectedMealType={selectedMealType}
          onMealTypeChange={setSelectedMealType}
        />

        {error && <div className="text-sm text-red-600">{error}</div>}
        {loading ? <div className="text-sm text-zinc-600">Loading foods...</div> : null}

        {/* Three Column Layout: Results List | Detail Panel */}
        <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
          {/* Left: Food Results List */}
          <div className="order-2 lg:order-1">
            <FoodResultsList
              foods={foods}
              onSelect={setSelectedFood}
              selectedId={selectedFood?.id}
              title={`${total} TOTAL • PAGE ${page}`}
            />
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 50 >= total}
                className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
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

