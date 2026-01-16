"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { TodaysBalanceCard } from "@/components/dashboard/TodaysBalanceCard";
import { NutritionBreakdown } from "@/components/dashboard/NutritionBreakdown";
import { QuickActionCards } from "@/components/dashboard/QuickActionCards";
import { RightSidebar } from "@/components/dashboard/RightSidebar";
import { DailyHealthImpact } from "@/components/dashboard/DailyHealthImpact";
import { onMealLogged } from "@/lib/clientEvents";

type DashboardData = {
  points: Array<{
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  today: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  dailyGoal: number;
  recentMeals: Array<{
    id: string;
    foodName: string;
    calories: number;
    mealType: string;
    loggedAt: string;
  }>;
};

export default function DashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const loadDashboard = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/dashboard");
      if (!res.ok) {
        throw new Error("Failed to load dashboard");
      }
      const j = await res.json();
      setData({
        points: j.points ?? [],
        today: {
          calories: j.today?.calories ?? 0,
          protein: j.today?.protein ?? 0,
          carbs: j.today?.carbs ?? 0,
          fat: j.today?.fat ?? 0,
        },
        dailyGoal: j.dailyGoal ?? 2000,
        recentMeals: j.recentMeals ?? [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard, refreshKey]);

  React.useEffect(() => {
    return onMealLogged(() => {
      setRefreshKey((k) => k + 1);
    });
  }, []);

  // Calculate remaining calories
  const remaining = React.useMemo(() => {
    if (!data) return 0;
    return Math.max(data.dailyGoal - data.today.calories, 0);
  }, [data]);

  // Check if food has been logged
  const hasFoodLogged = React.useMemo(() => {
    return data ? data.today.calories > 0 : false;
  }, [data]);

  // Calculate macro goals based on daily calorie goal
  // Typical split: 30% protein, 30% fat, 40% carbs
  const macroGoals = React.useMemo(() => {
    if (!data) return { protein: 150, fat: 65, carbs: 200 };
    const dailyCal = data.dailyGoal;
    return {
      protein: Math.round((dailyCal * 0.3) / 4), // 30% of calories, 4 cal/g
      fat: Math.round((dailyCal * 0.3) / 9), // 30% of calories, 9 cal/g
      carbs: Math.round((dailyCal * 0.4) / 4), // 40% of calories, 4 cal/g
    };
  }, [data]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-zinc-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="text-sm font-medium text-red-800">{error}</div>
          <button
            onClick={() => loadDashboard()}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        </div>
      </DashboardShell>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <DashboardShell>
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Sidebar - Quick Actions (hidden on mobile, shown on desktop) */}
        <aside className="hidden lg:block lg:col-span-2">
          <div className="sticky top-24">
            <QuickActionCards />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Balance Card - Center */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <TodaysBalanceCard
                goal={data.dailyGoal}
                consumed={data.today.calories}
                remaining={remaining}
              />
            </div>
          </div>

          {/* Nutrition Breakdown Cards */}
          <div>
            <NutritionBreakdown
              protein={data.today.protein}
              fat={data.today.fat}
              carbs={data.today.carbs}
              proteinGoal={macroGoals.protein}
              fatGoal={macroGoals.fat}
              carbsGoal={macroGoals.carbs}
            />
          </div>

          {/* Daily Health Impact Section */}
          <DailyHealthImpact hasFoodLogged={hasFoodLogged} />
        </div>

        {/* Right Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <RightSidebar />
          </div>
        </aside>

        {/* Mobile Quick Actions and Right Sidebar - shown only on mobile */}
        <div className="lg:hidden space-y-4">
          <QuickActionCards />
          <RightSidebar />
        </div>
      </div>
    </DashboardShell>
  );
}
