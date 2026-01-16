"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface TodaysBalanceCardProps {
  goal: number;
  consumed: number;
  remaining: number;
}

export function TodaysBalanceCard({ goal, consumed, remaining }: TodaysBalanceCardProps) {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage < 50) return "#10b981"; // teal
    if (percentage < 75) return "#eab308"; // yellow
    if (percentage < 100) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-center">Today&apos;s Balance</CardTitle>
      </CardHeader>
      <div className="flex flex-col items-center justify-center py-8">
        {/* Circular Progress Ring */}
        <div className="relative mb-6">
          <svg className="transform -rotate-90" width="200" height="200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="16"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={getColor()}
              strokeWidth="16"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div 
              className="text-5xl font-bold transition-colors duration-300"
              style={{ color: getColor() }}
            >
              {remaining}
            </div>
            <div className="text-sm text-zinc-600 mt-1">calories remaining</div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-2">
            <span className="text-sm font-medium text-zinc-600">GOAL</span>
            <span className="text-lg font-semibold text-zinc-900">{goal}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-2">
            <span className="text-sm font-medium text-zinc-600">FOOD</span>
            <span className="text-lg font-semibold text-zinc-900">{consumed}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-2 border-2 border-emerald-200">
            <span className="text-sm font-medium text-emerald-700">LEFT</span>
            <span className="text-lg font-semibold text-emerald-900">{remaining}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
