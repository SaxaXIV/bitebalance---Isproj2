"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

type MealEntry = {
  id: string;
  foodName: string;
  quantity: number;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

type Props = {
  mealType: string;
  targetCalories: number;
  currentCalories: number;
  entries: MealEntry[];
  onDelete?: (id: string) => void;
};

export function BreakfastTargetCard({
  mealType,
  targetCalories,
  currentCalories,
  entries,
  onDelete,
}: Props) {
  const progress = Math.min((currentCalories / targetCalories) * 100, 100);
  const totalProtein = entries.reduce((sum, e) => sum + (e.protein ?? 0) * e.quantity, 0);
  const totalCarbs = entries.reduce((sum, e) => sum + (e.carbs ?? 0) * e.quantity, 0);
  const totalFat = entries.reduce((sum, e) => sum + (e.fat ?? 0) * e.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🎯</span>
          {mealType} Target
        </CardTitle>
      </CardHeader>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-emerald-700">
              {Math.round(currentCalories)} / {targetCalories} kcal
            </span>
            <span className="text-emerald-600">
              {Math.round(targetCalories - currentCalories)} left
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-emerald-100">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-md bg-emerald-50 p-2 text-center">
            <div className="font-semibold text-emerald-900">{Math.round(totalProtein)}g</div>
            <div className="text-emerald-600">Protein</div>
          </div>
          <div className="rounded-md bg-blue-50 p-2 text-center">
            <div className="font-semibold text-blue-900">{Math.round(totalCarbs)}g</div>
            <div className="text-blue-600">Carbs</div>
          </div>
          <div className="rounded-md bg-amber-50 p-2 text-center">
            <div className="font-semibold text-amber-900">{Math.round(totalFat)}g</div>
            <div className="text-amber-600">Fat</div>
          </div>
        </div>

        {/* Meal Entries */}
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-white p-3"
            >
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                🍽️
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-emerald-900 truncate">
                  {entry.foodName}
                </div>
                <div className="text-xs text-emerald-600">
                  {entry.quantity}x • P: {Math.round((entry.protein ?? 0) * entry.quantity)}g C:{" "}
                  {Math.round((entry.carbs ?? 0) * entry.quantity)}g F:{" "}
                  {Math.round((entry.fat ?? 0) * entry.quantity)}g
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-emerald-700">
                  {Math.round(entry.calories * entry.quantity)} kcal
                </div>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(entry.id)}
                    className="mt-1 text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="text-emerald-400">›</div>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="py-8 text-center text-sm text-emerald-600">
              No {mealType.toLowerCase()} entries yet. Add foods to get started!
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
