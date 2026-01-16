"use client";

import * as React from "react";

type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

interface FoodSearchProps {
  mealType: string;
  onAddFood: (food: Food) => void;
}

export function FoodSearch({ mealType, onAddFood }: FoodSearchProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<Food[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  React.useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: searchQuery.trim(), limit: "10" });
        const res = await fetch(`/api/foods?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          const items: Food[] = (data.items ?? []).map((x: any) => ({
            id: x.id,
            name: x.name,
            calories: x.calories ?? 0,
            protein: x.protein ?? null,
            carbs: x.carbs ?? null,
            fat: x.fat ?? null,
          }));
          setSuggestions(items);
          setShowSuggestions(items.length > 0);
        }
      } catch (err) {
        console.error("Failed to search foods:", err);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  function handleSelectFood(food: Food) {
    onAddFood(food);
    setSearchQuery("");
    setShowSuggestions(false);
    setSuggestions([]);
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder={`Search & add to ${mealType}...`}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          className="h-12 w-full rounded-lg border border-emerald-200 bg-white pl-10 pr-4 text-sm text-emerald-900 placeholder:text-emerald-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400">
          🔍
        </div>
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-emerald-200 bg-white shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((food) => (
            <button
              key={food.id}
              type="button"
              onClick={() => handleSelectFood(food)}
              className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors border-b border-emerald-50 last:border-b-0"
            >
              <div className="font-medium text-emerald-900">{food.name}</div>
              <div className="text-xs text-emerald-600 mt-1">
                {food.calories} kcal
                {food.protein !== null && ` • ${food.protein}g protein`}
                {food.carbs !== null && ` • ${food.carbs}g carbs`}
                {food.fat !== null && ` • ${food.fat}g fat`}
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && searchQuery.trim().length >= 2 && suggestions.length === 0 && !loading && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-emerald-200 bg-white shadow-lg px-4 py-3 text-sm text-zinc-500">
          No foods found. Try a different search term.
        </div>
      )}
    </div>
  );
}
