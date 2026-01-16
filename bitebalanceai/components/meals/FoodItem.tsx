"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

type FoodItemData = {
  id: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

interface FoodItemProps {
  item: FoodItemData;
  onQuantityChange: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
}

export function FoodItem({ item, onQuantityChange, onDelete }: FoodItemProps) {
  const [quantity, setQuantity] = React.useState(item.quantity.toString());
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    setQuantity(item.quantity.toString());
  }, [item.quantity]);

  function handleQuantityChange(newQty: string) {
    setQuantity(newQty);
    const numQty = parseFloat(newQty);
    if (Number.isFinite(numQty) && numQty >= 0.1 && numQty <= 999) {
      setIsUpdating(true);
      onQuantityChange(item.id, numQty);
      setTimeout(() => setIsUpdating(false), 300);
    }
  }

  function increment() {
    const newQty = Math.min(999, item.quantity + 0.1);
    handleQuantityChange(newQty.toFixed(1));
  }

  function decrement() {
    const newQty = Math.max(0.1, item.quantity - 0.1);
    handleQuantityChange(newQty.toFixed(1));
  }

  const totalCalories = item.calories * item.quantity;
  const totalProtein = (item.protein || 0) * item.quantity;
  const totalCarbs = (item.carbs || 0) * item.quantity;
  const totalFat = (item.fat || 0) * item.quantity;

  return (
    <div className={`group rounded-lg border border-emerald-100 bg-white p-4 transition-all hover:shadow-md ${isUpdating ? "scale-[1.02]" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left: Food Info */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-emerald-900">{item.name}</div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-600">
            <span>
              <span className="font-medium text-teal-700">Protein:</span> {totalProtein.toFixed(1)}g
            </span>
            <span>
              <span className="font-medium text-sky-700">Carbs:</span> {totalCarbs.toFixed(1)}g
            </span>
            <span>
              <span className="font-medium text-yellow-700">Fat:</span> {totalFat.toFixed(1)}g
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={decrement}
              className="h-8 w-8 rounded border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center"
            >
              −
            </button>
            <input
              type="number"
              min="0.1"
              max="999"
              step="0.1"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="h-8 w-20 rounded border border-emerald-300 px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              type="button"
              onClick={increment}
              className="h-8 w-8 rounded border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center"
            >
              +
            </button>
            <span className="text-xs text-zinc-500 ml-2">
              {item.quantity > 1 ? `${item.quantity.toFixed(1)} servings` : "1 serving"}
            </span>
          </div>
        </div>

        {/* Right: Calories and Actions */}
        <div className="flex flex-col items-end gap-2">
          <div className="text-2xl font-bold text-emerald-700">{Math.round(totalCalories)}</div>
          <div className="text-xs text-zinc-500">kcal</div>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 text-sm"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
