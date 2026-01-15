"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { BreakfastTargetCard } from "@/components/meals/BreakfastTargetCard";
import { AddMealModal } from "@/components/meals/AddMealModal";
import { BottomNav } from "@/components/mobile/BottomNav";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Food = { id: string; name: string };
type MealType = "Breakfast" | "Lunch" | "Dinner";
type LogItem = {
  id: string;
  quantity: number;
  mealType: string;
  loggedAt: string;
  food: { name: string; calories: number; protein: number | null; carbs: number | null; fat: number | null };
};

export default function MealLogsPage() {
  const [foods, setFoods] = React.useState<Food[]>([]);
  const [foodId, setFoodId] = React.useState<string>("");
  const [quantity, setQuantity] = React.useState("1");
  const [mealType, setMealType] = React.useState<MealType>("Breakfast");
  const [logs, setLogs] = React.useState<LogItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  async function loadFoods() {
    const res = await fetch("/api/foods");
    const j = await res.json();
    const list: Food[] = (j.items ?? []).map((x: any) => ({ id: x.id, name: x.name }));
    setFoods(list);
    if (!foodId && list[0]) setFoodId(list[0].id);
  }

  async function loadLogs() {
    const res = await fetch("/api/meal-logs");
    if (!res.ok) return;
    const j = await res.json();
    setLogs(j.items ?? []);
  }

  React.useEffect(() => {
    loadFoods();
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const q = Number(quantity);
    if (!foodId) return setError("Select a food.");
    if (!Number.isFinite(q) || q <= 0) return setError("Quantity must be > 0.");

    setLoading(true);
    const res = await fetch("/api/meal-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foodId, quantity: q, mealType }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? "Failed to save log.");
      return;
    }
    await loadLogs();
  }

  const [activeMealType, setActiveMealType] = React.useState<MealType>("Breakfast");

  const breakfastLogs = logs.filter((l) => l.mealType === "Breakfast");
  const lunchLogs = logs.filter((l) => l.mealType === "Lunch");
  const dinnerLogs = logs.filter((l) => l.mealType === "Dinner");

  const currentLogs =
    activeMealType === "Breakfast"
      ? breakfastLogs
      : activeMealType === "Lunch"
        ? lunchLogs
        : dinnerLogs;

  const currentCalories = currentLogs.reduce(
    (sum, l) => sum + l.food.calories * l.quantity,
    0
  );

  const mealEntries = currentLogs.map((l) => ({
    id: l.id,
    foodName: l.food.name,
    quantity: l.quantity,
    calories: l.food.calories,
    protein: l.food.protein,
    carbs: l.food.carbs,
    fat: l.food.fat,
  }));

  async function handleDelete(id: string) {
    // TODO: Add DELETE endpoint
    await loadLogs();
  }

  return (
    <DashboardShell>
      <div className="space-y-6 pb-20 md:pb-6">
        {/* Meal Type Tabs */}
        <div className="flex gap-2 border-b border-emerald-100">
          {(["Breakfast", "Lunch", "Dinner"] as MealType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveMealType(type)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeMealType === type
                  ? "border-emerald-500 text-emerald-900"
                  : "border-transparent text-emerald-600 hover:text-emerald-900"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add meals by searching</CardTitle>
            <CardDescription>
              Use <span className="font-semibold">➕ Add Meal</span> to search foods and log them.
            </CardDescription>
          </CardHeader>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
        </Card>

        {/* Breakfast/Lunch/Dinner Target Card */}
        <BreakfastTargetCard
          mealType={activeMealType}
          targetCalories={activeMealType === "Breakfast" ? 365 : activeMealType === "Lunch" ? 500 : 600}
          currentCalories={currentCalories}
          entries={mealEntries}
          onDelete={handleDelete}
        />
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />

      {/* Add Meal Modal */}
      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadLogs}
        defaultMealType={activeMealType}
      />
    </DashboardShell>
  );
}

