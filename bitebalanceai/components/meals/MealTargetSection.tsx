"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

type MealEntry = {
  id: string;
  quantity: number;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

interface MealTargetSectionProps {
  mealType: string;
  targetCalories: number;
  entries: MealEntry[];
}

export function MealTargetSection({ mealType, targetCalories, entries }: MealTargetSectionProps) {
  const totalCalories = entries.reduce((sum, e) => sum + e.calories * e.quantity, 0);
  const totalProtein = entries.reduce((sum, e) => sum + (e.protein || 0) * e.quantity, 0);
  const totalCarbs = entries.reduce((sum, e) => sum + (e.carbs || 0) * e.quantity, 0);
  const totalFat = entries.reduce((sum, e) => sum + (e.fat || 0) * e.quantity, 0);

  const progress = Math.min((totalCalories / targetCalories) * 100, 100);
  const remaining = Math.max(targetCalories - totalCalories, 0);

  return (
    <Card className="border-2 border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{mealType} Target</span>
          <span className="text-lg font-bold text-emerald-700">
            {Math.round(totalCalories)} / {targetCalories} kcal
          </span>
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-emerald-700 font-medium">Progress</span>
            <span className="text-emerald-600">
              {remaining > 0 ? `${Math.round(remaining)} kcal remaining` : "Target reached!"}
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-emerald-100">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Macro Breakdown */}
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-zinc-50 p-3">
          <div className="text-center">
            <div className="text-xs text-zinc-500">Protein</div>
            <div className="text-lg font-bold text-teal-700">{Math.round(totalProtein)}g</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-zinc-500">Carbs</div>
            <div className="text-lg font-bold text-sky-700">{Math.round(totalCarbs)}g</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-zinc-500">Fat</div>
            <div className="text-lg font-bold text-yellow-700">{Math.round(totalFat)}g</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
