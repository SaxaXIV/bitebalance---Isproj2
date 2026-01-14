"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, THead, TH, TD } from "@/components/ui/Table";

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

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Meal Logging</CardTitle>
          <CardDescription>Log meals and view your recent entries.</CardDescription>
        </CardHeader>

        <form className="grid gap-3 md:grid-cols-4" onSubmit={onSubmit}>
          <label className="block">
            <div className="mb-1 text-sm font-medium text-zinc-900">Food</div>
            <select
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
              value={foodId}
              onChange={(e) => setFoodId(e.target.value)}
            >
              {foods.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>

          <Input
            label="Quantity"
            inputMode="decimal"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <label className="block">
            <div className="mb-1 text-sm font-medium text-zinc-900">Meal type</div>
            <select
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealType)}
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
            </select>
          </label>

          <div className="flex items-end">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Add log"}
            </Button>
          </div>
        </form>

        {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}
      </Card>

      <Card>
        <Table>
          <THead>
            <tr>
              <TH>When</TH>
              <TH>Meal</TH>
              <TH>Food</TH>
              <TH>Qty</TH>
              <TH>Calories</TH>
            </tr>
          </THead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b">
                <TD>{new Date(l.loggedAt).toLocaleString()}</TD>
                <TD>{l.mealType}</TD>
                <TD className="font-medium text-zinc-900">{l.food.name}</TD>
                <TD>{l.quantity}</TD>
                <TD>{Math.round(l.food.calories * l.quantity)}</TD>
              </tr>
            ))}
            {!logs.length ? (
              <tr>
                <TD colSpan={5} className="py-6 text-center text-zinc-600">
                  No meal logs yet.
                </TD>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

