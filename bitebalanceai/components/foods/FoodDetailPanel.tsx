"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fiber?: number | null;
  category?: string;
};

type SimilarFood = {
  id: string;
  name: string;
  calories: number;
};

type Props = {
  food: Food | null;
  similarFoods?: SimilarFood[];
  mealType: string;
  onAddToLog: (foodId: string, mealType: string, quantity: number) => void;
};

export function FoodDetailPanel({ food, similarFoods = [], mealType, onAddToLog }: Props) {
  if (!food) {
    return (
      <Card>
        <div className="py-12 text-center text-sm text-emerald-600">
          Select a food to view details
        </div>
      </Card>
    );
  }

  const totalMacros = (food.protein ?? 0) + (food.carbs ?? 0) + (food.fat ?? 0);
  const proteinPercent = totalMacros > 0 ? ((food.protein ?? 0) / totalMacros) * 100 : 0;
  const carbsPercent = totalMacros > 0 ? ((food.carbs ?? 0) / totalMacros) * 100 : 0;
  const fatPercent = totalMacros > 0 ? ((food.fat ?? 0) / totalMacros) * 100 : 0;

  const [qty, setQty] = React.useState(1);
  const [aiText, setAiText] = React.useState<string | null>(null);
  const [aiLoading, setAiLoading] = React.useState(false);

  React.useEffect(() => {
    setQty(1);
    setAiText(null);
  }, [food.id]);

  async function analyzeImpact() {
    if (!food) return;
    setAiLoading(true);
    setAiText(null);
    const prompt = `Analyze the health impact of eating: ${food.name}. Quantity: ${qty} serving(s).\nMacros per serving: ${food.calories} kcal, protein ${(food.protein ?? 0)}g, carbs ${(food.carbs ?? 0)}g, fat ${(food.fat ?? 0)}g.\nKeep it short (3-5 bullet points) and include a note for calorie goal adherence.`;
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    setAiLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setAiText(j?.error ?? "AI analysis unavailable.");
      return;
    }
    const j = await res.json().catch(() => ({}));
    setAiText(j?.response ?? "AI analysis unavailable.");
  }

  return (
    <Card>
      <CardHeader>
        <div className="mb-2">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {food.category || mealType}
          </span>
        </div>
        <CardTitle className="text-2xl text-emerald-900">{food.name}</CardTitle>
        <div className="text-sm text-emerald-600">Serving Size: 1 serving</div>
      </CardHeader>

      <div className="space-y-6">
        {/* Calorie Circle Chart */}
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24">
            <svg className="h-24 w-24 -rotate-90 transform">
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeDasharray={`${(food.calories / 500) * 251.2} 251.2`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-900">{food.calories}</div>
                <div className="text-xs text-emerald-600">KCAL</div>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-400" />
              <span className="text-emerald-700">Fat: {food.fat ?? 0}g</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-400" />
              <span className="text-emerald-700">Carbs: {food.carbs ?? 0}g</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="text-emerald-700">Protein: {food.protein ?? 0}g</span>
            </div>
          </div>
        </div>

        {/* Meal Impact */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-red-600">📈</span>
            <span className="text-sm font-semibold text-red-900">Impact Analysis</span>
          </div>
          <div className="mb-2">
            <span className="rounded-full bg-red-200 px-2 py-1 text-xs font-semibold text-red-800">
              {food.carbs && food.carbs > 30 ? "HIGH CARBS" : "MODERATE"}
            </span>
          </div>
          <div className="text-xs text-red-800">
            <div className="font-medium">EFFECT:</div>
            <div>
              {food.carbs && food.carbs > 30
                ? "Rapid spike in blood glucose followed by an insulin crash. May lead to sudden fatigue."
                : "Provides sustained energy with balanced macronutrients."}
            </div>
          </div>
        </div>

        {/* Similar Foods */}
        {similarFoods.length > 0 && (
          <div>
            <div className="mb-3 text-sm font-semibold text-emerald-900">Similar Foods</div>
            <div className="space-y-2">
              {similarFoods.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-md border border-emerald-100 bg-white p-2"
                >
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
                    🍎
                  </div>
                  <div className="flex-1 text-sm text-emerald-900">{item.name}</div>
                  <div className="text-xs font-semibold text-emerald-600">{item.calories} kcal</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add to Log Button */}
        <div className="pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-emerald-900">Quantity</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-9 w-9 rounded-full border border-emerald-200 bg-white text-emerald-800"
              >
                −
              </button>
              <div className="min-w-[2rem] text-center text-sm font-semibold text-emerald-900">
                {qty}
              </div>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="h-9 w-9 rounded-full border border-emerald-200 bg-white text-emerald-800"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-3">
            <Button variant="secondary" className="w-full" onClick={analyzeImpact} disabled={aiLoading}>
              {aiLoading ? "Analyzing..." : "Ask Gemini: impact analysis"}
            </Button>
            {aiText ? (
              <div className="mt-2 rounded-lg border border-emerald-100 bg-white p-3 text-xs text-zinc-700 whitespace-pre-wrap">
                {aiText}
              </div>
            ) : null}
          </div>

          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600"
            onClick={() => onAddToLog(food.id, mealType, qty)}
          >
            + Add to {mealType} Log
          </Button>
        </div>
      </div>
    </Card>
  );
}
