"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

type MealItem = {
  name: string;
  quantity: number;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

interface MealImpactAnalysisProps {
  mealType: string;
  items: MealItem[];
}

type AnalysisResult = {
  cause: string;
  result: string;
  loading: boolean;
  error: string | null;
};

export function MealImpactAnalysis({ mealType, items }: MealImpactAnalysisProps) {
  const [analysis, setAnalysis] = React.useState<AnalysisResult>({
    cause: "",
    result: "",
    loading: false,
    error: null,
  });
  const [debounceTimer, setDebounceTimer] = React.useState<NodeJS.Timeout | null>(null);

  const totalServings = items.reduce((sum, item) => sum + item.quantity, 0);

  React.useEffect(() => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Don't analyze if no items
    if (items.length === 0) {
      setAnalysis({ cause: "", result: "", loading: false, error: null });
      return;
    }

    // Set loading state immediately
    setAnalysis((prev) => ({ ...prev, loading: true, error: null }));

    // Debounce API call
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/meal-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mealType,
            items: items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              calories: item.calories,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat,
            })),
            totalServings,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to analyze meal");
        }

        const data = await res.json();
        setAnalysis({
          cause: data.cause || "Meal composition analyzed.",
          result: data.result || "This meal provides energy and nutrients.",
          loading: false,
          error: null,
        });
      } catch (err) {
        setAnalysis({
          cause: "Unable to analyze meal at this time.",
          result: "Please try again later or continue logging your meal.",
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }, 500); // 500ms debounce

    setDebounceTimer(timer);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [mealType, JSON.stringify(items), totalServings]);

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="border-2 border-purple-200 bg-purple-50/30">
      <CardHeader>
        <CardTitle className="text-purple-900">
          IMPACT ANALYSIS {totalServings > 1 ? `(FOR ${totalServings.toFixed(1)} SERVINGS)` : ""}
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        {analysis.loading && (
          <div className="flex items-center gap-2 text-sm text-purple-700">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
            <span>Analyzing intake impact...</span>
          </div>
        )}

        {!analysis.loading && (analysis.cause || analysis.result) && (
          <div className={`space-y-4 animate-in fade-in duration-400`}>
            {/* CAUSE Section */}
            <div className="rounded-lg bg-red-50 border-2 border-red-200 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-2">
                CAUSE
              </div>
              <div className="text-sm font-medium text-red-900">{analysis.cause}</div>
            </div>

            {/* RESULT Section */}
            <div className="rounded-lg bg-red-50 border-2 border-red-200 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-2">
                RESULT
              </div>
              <div className="text-sm font-medium text-red-900">{analysis.result}</div>
            </div>
          </div>
        )}

        {analysis.error && (
          <div className="text-xs text-red-600">
            {analysis.error}
          </div>
        )}
      </div>
    </Card>
  );
}
