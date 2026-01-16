"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

interface NutritionBreakdownProps {
  protein: number;
  fat: number;
  carbs: number;
  proteinGoal?: number;
  fatGoal?: number;
  carbsGoal?: number;
}

export function NutritionBreakdown({
  protein,
  fat,
  carbs,
  proteinGoal = 150,
  fatGoal = 65,
  carbsGoal = 200,
}: NutritionBreakdownProps) {
  const proteinPercent = Math.min((protein / proteinGoal) * 100, 100);
  const fatPercent = Math.min((fat / fatGoal) * 100, 100);
  const carbsPercent = Math.min((carbs / carbsGoal) * 100, 100);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Protein Card */}
      <Card className="border-t-4 border-t-teal-500 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-600">PROTEIN</CardTitle>
        </CardHeader>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-teal-700">{protein}g</div>
          <div className="text-xs text-zinc-500">
            {proteinPercent.toFixed(0)}% of goal
          </div>
          <div className="w-full bg-zinc-200 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Fat Card */}
      <Card className="border-t-4 border-t-yellow-500 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-600">FAT</CardTitle>
        </CardHeader>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-yellow-700">{fat}g</div>
          <div className="text-xs text-zinc-500">
            {fatPercent.toFixed(0)}% of goal
          </div>
          <div className="w-full bg-zinc-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${fatPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Carbs Card */}
      <Card className="border-t-4 border-t-sky-500 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-600">CARBS</CardTitle>
        </CardHeader>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-sky-700">{carbs}g</div>
          <div className="text-xs text-zinc-500">
            {carbsPercent.toFixed(0)}% of goal
          </div>
          <div className="w-full bg-zinc-200 rounded-full h-2">
            <div
              className="bg-sky-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* View Full Nutrition Report Link */}
      <div className="sm:col-span-3 pt-2">
        <Link
          href="/reports"
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
        >
          View Full Nutrition Report →
        </Link>
      </div>
    </div>
  );
}
