"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Meal = {
  id: string;
  date: string;
  mealType: string;
  title: string;
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const mealTypes = ["Breakfast", "Lunch", "Dinner"];

function startOfWeek(d: Date) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7));
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function MealPlannerPage() {
  const [weekStart, setWeekStart] = React.useState(startOfWeek(new Date()));
  const [items, setItems] = React.useState<Meal[]>([]);
  const [selectedDay, setSelectedDay] = React.useState(0);
  const [mealType, setMealType] = React.useState("Breakfast");
  const [title, setTitle] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    const start = isoDate(weekStart);
    const end = isoDate(new Date(weekStart.getTime() + 6 * 86400000));
    const res = await fetch(`/api/meal-plans?start=${start}&end=${end}`);
    if (!res.ok) {
      setError("Failed to load plans.");
      return;
    }
    const j = await res.json();
    const list: Meal[] = (j.items ?? []).map((p: any) => ({
      id: p.id,
      date: p.date,
      mealType: p.mealType,
      title: p.title,
    }));
    setItems(list);
  }

  React.useEffect(() => {
    setError(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  async function addMeal() {
    if (!title.trim()) return;
    setLoading(true);
    const date = new Date(weekStart.getTime() + selectedDay * 86400000);
    const res = await fetch("/api/meal-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: isoDate(date),
        mealType,
        title: title.trim(),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Failed to save meal (are you logged in?).");
      return;
    }
    setTitle("");
    await load();
  }

  const weekDates = days.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Meal Planner</CardTitle>
          <CardDescription>
            Plan your week by assigning meals to days.
          </CardDescription>
        </CardHeader>

        <div className="mb-4 flex items-center gap-2 text-sm">
          <Button
            variant="secondary"
            onClick={() =>
              setWeekStart((prev) => new Date(prev.getTime() - 7 * 86400000))
            }
          >
            Previous week
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              setWeekStart((prev) => new Date(prev.getTime() + 7 * 86400000))
            }
          >
            Next week
          </Button>
          <div className="ml-auto text-zinc-600">
            Week of {isoDate(weekStart)}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-7">
          {weekDates.map((d, idx) => {
            const key = isoDate(d);
            const dayMeals = items.filter((m) => m.date.slice(0, 10) === key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDay(idx)}
                className={`rounded-md border p-3 text-left ${
                  selectedDay === idx
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <div className="mb-1 text-xs font-semibold text-zinc-600">
                  {days[idx]} {key}
                </div>
                <div className="space-y-1 text-xs text-zinc-700">
                  {dayMeals.map((m) => (
                    <div key={m.id}>
                      <span className="font-semibold">{m.mealType}:</span>{" "}
                      {m.title}
                    </div>
                  ))}
                  {!dayMeals.length ? (
                    <div className="text-zinc-400">No meals yet</div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div>
            <div className="mb-1 text-sm font-medium text-zinc-900">
              Meal type
            </div>
            <select
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              {mealTypes.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <Input
            label="Meal title"
            placeholder="e.g. Oatmeal + eggs"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex items-end">
            <Button className="w-full" onClick={addMeal} disabled={loading}>
              {loading ? "Saving..." : "Add meal"}
            </Button>
          </div>
        </div>

        {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
      </Card>
    </div>
  );
}

