"use client";

import * as React from "react";

type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  category?: string;
};

type Props = {
  foods: Food[];
  onSelect: (food: Food) => void;
  selectedId?: string;
  title?: string;
};

export function FoodResultsList({ foods, onSelect, selectedId, title = "Recent Searches" }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-emerald-900">{title}</h2>
      <div className="space-y-2">
        {foods.map((food) => (
          <button
            key={food.id}
            type="button"
            onClick={() => onSelect(food)}
            className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
              selectedId === food.id
                ? "border-emerald-400 bg-emerald-50"
                : "border-emerald-100 bg-white hover:bg-emerald-50"
            }`}
          >
            <div className="h-12 w-12 flex-shrink-0 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              🍎
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-emerald-900 truncate">{food.name}</div>
              <div className="text-xs text-emerald-600">
                {food.calories} kcal • {food.protein ?? 0}g protein
              </div>
            </div>
            <div className="text-emerald-400">›</div>
          </button>
        ))}
        {foods.length === 0 && (
          <div className="py-8 text-center text-sm text-emerald-600">
            No foods found. Try searching!
          </div>
        )}
      </div>
    </div>
  );
}
