"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snack", "Soda", "Drink", "Fast Food"];
const mealTypes = ["Breakfast", "Lunch", "Snack"];

type Props = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedMealType: string;
  onMealTypeChange: (meal: string) => void;
};

export function FoodHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedMealType,
  onMealTypeChange,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400">
          🔍
        </div>
        <input
          type="text"
          placeholder="Search foods..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-12 w-full rounded-lg border border-emerald-200 bg-white pl-10 pr-4 text-sm text-emerald-900 placeholder:text-emerald-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      {/* Category Chips - Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-emerald-500 text-white"
                : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Meal Type Pills */}
      <div className="flex gap-2">
        {mealTypes.map((meal) => (
          <button
            key={meal}
            type="button"
            onClick={() => onMealTypeChange(meal)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              selectedMealType === meal
                ? "bg-emerald-100 text-emerald-900"
                : "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            {meal}
          </button>
        ))}
      </div>
    </div>
  );
}
