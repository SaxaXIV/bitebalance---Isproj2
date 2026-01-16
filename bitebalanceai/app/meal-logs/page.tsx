"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { FoodSearch } from "@/components/meals/FoodSearch";
import { FoodItem } from "@/components/meals/FoodItem";
import { MealTargetSection } from "@/components/meals/MealTargetSection";
import { MealImpactAnalysis } from "@/components/meals/MealImpactAnalysis";
import { BottomNav } from "@/components/mobile/BottomNav";
import { Button } from "@/components/ui/Button";

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

type FoodItemData = {
  id: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

type LogItem = {
  id: string;
  quantity: number;
  mealType: string;
  loggedAt: string;
  food: Food;
};

const MEAL_TARGETS: Record<MealType, number> = {
  Breakfast: 365,
  Lunch: 500,
  Dinner: 600,
  Snack: 200,
};

export default function MealLogsPage() {
  const [activeMealType, setActiveMealType] = React.useState<MealType>("Breakfast");
  const [logs, setLogs] = React.useState<LogItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load logs on mount
  React.useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/meal-logs");
      if (!res.ok) {
        throw new Error("Failed to load meal logs");
      }
      const data = await res.json();
      setLogs(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meals");
    } finally {
      setLoading(false);
    }
  }

  // Filter logs by active meal type
  const currentLogs = React.useMemo(() => {
    return logs.filter((l) => l.mealType === activeMealType);
  }, [logs, activeMealType]);

  // Convert to FoodItemData format
  const foodItems = React.useMemo(() => {
    return currentLogs.map((log): FoodItemData => ({
      id: log.id,
      name: log.food.name,
      quantity: log.quantity,
      calories: log.food.calories,
      protein: log.food.protein,
      carbs: log.food.carbs,
      fat: log.food.fat,
    }));
  }, [currentLogs]);

  // Meal entries for target section
  const mealEntries = React.useMemo(() => {
    return currentLogs.map((log) => ({
      id: log.id,
      quantity: log.quantity,
      calories: log.food.calories,
      protein: log.food.protein,
      carbs: log.food.carbs,
      fat: log.food.fat,
    }));
  }, [currentLogs]);

  async function handleAddFood(food: Food) {
    setError(null);
    try {
      const res = await fetch("/api/meal-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodId: food.id,
          quantity: 1,
          mealType: activeMealType,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add food");
      }

      await loadLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add food");
    }
  }

  async function handleQuantityChange(id: string, quantity: number) {
    if (quantity < 0.1 || quantity > 999) return;

    // Optimistically update UI
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, quantity } : log))
    );

    // In a real app, you'd have a PATCH endpoint, but for now we'll delete and recreate
    // For better UX, we could add a PATCH endpoint later
    try {
      const log = logs.find((l) => l.id === id);
      if (!log) return;

      // Delete old log
      await fetch(`/api/meal-logs/${id}`, { method: "DELETE" });

      // Create new log with updated quantity
      await fetch("/api/meal-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodId: log.food.id,
          quantity,
          mealType: activeMealType,
        }),
      });

      await loadLogs();
    } catch (err) {
      // Revert on error
      await loadLogs();
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/meal-logs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete food");
      }
      await loadLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete food");
    }
  }

  const totalCalories = React.useMemo(() => {
    return foodItems.reduce((sum, item) => sum + item.calories * item.quantity, 0);
  }, [foodItems]);

  return (
    <DashboardShell>
      <div className="space-y-6 pb-20 md:pb-6">
        {/* Meal Type Tabs */}
        <div className="flex gap-2 border-b border-emerald-100 overflow-x-auto">
          {(["Breakfast", "Lunch", "Dinner", "Snack"] as MealType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveMealType(type)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeMealType === type
                  ? "border-emerald-500 text-emerald-900 font-semibold"
                  : "border-transparent text-emerald-600 hover:text-emerald-900"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Food Search */}
        <FoodSearch mealType={activeMealType} onAddFood={handleAddFood} />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 text-zinc-500">Loading meals...</div>
        )}

        {/* Meal Target Section */}
        {!loading && (
          <MealTargetSection
            mealType={activeMealType}
            targetCalories={MEAL_TARGETS[activeMealType]}
            entries={mealEntries}
          />
        )}

        {/* Food Items List */}
        {!loading && foodItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">
              Food Items ({foodItems.length})
            </h3>
            {foodItems.map((item) => (
              <FoodItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* AI Meal Impact Analysis */}
        {!loading && foodItems.length > 0 && (
          <MealImpactAnalysis mealType={activeMealType} items={foodItems} />
        )}

        {/* Meal Summary Footer */}
        {!loading && foodItems.length > 0 && (
          <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-6 space-y-4">
            <div className="text-center">
              <div className="text-sm text-emerald-700 mb-1">Total {activeMealType} Calories</div>
              <div className="text-5xl font-bold text-emerald-900">{Math.round(totalCalories)}</div>
            </div>

            <div className="border-t border-emerald-200 pt-4 space-y-3">
              <div className="text-center text-sm text-zinc-600">
                Finished Logging?
              </div>
              <Button
                variant="secondary"
                className="w-full bg-orange-500 text-white hover:bg-orange-600"
              >
                Suggest Fix Next Meal
              </Button>
              <div className="text-xs text-center text-zinc-500">
                Get a personalized recommendation for your next meal based on what you just ate
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && foodItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🍽️</div>
            <div className="text-lg font-medium text-zinc-700 mb-2">No foods logged yet</div>
            <div className="text-sm text-zinc-500">
              Use the search bar above to add foods to your {activeMealType.toLowerCase()}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </DashboardShell>
  );
}
