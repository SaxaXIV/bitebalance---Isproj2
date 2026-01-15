"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { emitMealLogged } from "@/lib/clientEvents";

type Food = { id: string; name: string; calories: number };

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultMealType?: string;
}

export function AddMealModal({
  isOpen,
  onClose,
  onSuccess,
  defaultMealType = "Breakfast",
}: AddMealModalProps) {
  const [foods, setFoods] = React.useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [foodId, setFoodId] = React.useState("");
  const [quantity, setQuantity] = React.useState("1");
  const [mealType, setMealType] = React.useState(defaultMealType);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      // Only load once user starts searching
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && searchQuery.trim().length >= 2) {
      const timer = setTimeout(() => {
        loadFoods();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, isOpen]);

  async function loadFoods() {
    const params = new URLSearchParams();
    if (searchQuery.trim().length >= 2) params.set("q", searchQuery.trim());
    const res = await fetch(`/api/foods?${params.toString()}`);
    if (res.ok) {
      const j = await res.json();
      const items: Food[] = (j.items ?? []).map((x: any) => ({
        id: x.id,
        name: x.name,
        calories: x.calories ?? 0,
      }));
      setFoods(items);
      if (items.length > 0 && !foodId) {
        setFoodId(items[0].id);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
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
      setError(j?.error ?? "Failed to save meal.");
      return;
    }
    onSuccess();
    emitMealLogged();
    onClose();
    setFoodId("");
    setQuantity("1");
    setSearchQuery("");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add Meal</CardTitle>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-900"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              label="Search Food"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <label className="block">
            <div className="mb-1 text-sm font-medium text-zinc-900">Food</div>
            <select
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
              value={foodId}
              onChange={(e) => setFoodId(e.target.value)}
              required
            >
              <option value="">Select a food...</option>
              {foods.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.calories} kcal)
                </option>
              ))}
            </select>
            {foods.length === 0 ? (
              <div className="mt-1 text-xs text-zinc-500">Type at least 2 characters to search foods.</div>
            ) : null}
          </label>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              inputMode="decimal"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="0.1"
              step="0.1"
            />

            <label className="block">
              <div className="mb-1 text-sm font-medium text-zinc-900">Meal Type</div>
              <select
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                required
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
            </label>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Meal"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
