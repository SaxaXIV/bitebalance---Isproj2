"use client";

import * as React from "react";
import Link from "next/link";

interface QuickAction {
  icon: string;
  label: string;
  href: string;
  color: string;
}

const actions: QuickAction[] = [
  { icon: "➕", label: "Log Meal", href: "/meal-logs", color: "bg-emerald-500" },
  { icon: "🍎", label: "Foods", href: "/foods", color: "bg-blue-500" },
  { icon: "📅", label: "Meal Plan", href: "/meal-planner", color: "bg-purple-500" },
  { icon: "👥", label: "Community", href: "/community", color: "bg-pink-500" },
  { icon: "🏆", label: "Challenges", href: "/challenges", color: "bg-yellow-500" },
];

interface QuickActionsProps {
  onRefresh?: () => void;
}

export function QuickActions({ onRefresh }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          onClick={onRefresh}
          className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 hover:shadow-md"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${action.color} bg-opacity-10`}
          >
            <span>{action.icon}</span>
          </div>
          <span className="text-xs font-medium text-zinc-700">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}
