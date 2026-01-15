"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface CalorieGaugeProps {
  consumed: number;
  goal: number;
  size?: number;
}

export function CalorieGauge({ consumed, goal, size = 200 }: CalorieGaugeProps) {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);

  // Color based on percentage
  const getColor = () => {
    if (percentage < 50) return "#10b981"; // green
    if (percentage < 75) return "#eab308"; // yellow
    if (percentage < 100) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  const data = [
    { name: "consumed", value: Math.min(consumed, goal), fill: getColor() },
    { name: "remaining", value: Math.max(goal - consumed, 0), fill: "#e5e7eb" },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size / 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={size * 0.3}
              outerRadius={size * 0.45}
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: getColor() }}>
              {Math.round(consumed)}
            </div>
            <div className="text-sm text-zinc-600">of {goal} kcal</div>
            <div className="mt-1 text-xs text-zinc-500">
              {remaining > 0 ? `${Math.round(remaining)} remaining` : "Goal reached!"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
