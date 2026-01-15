"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { CalorieGauge } from "@/components/dashboard/CalorieGauge";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Point = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type RecentMeal = {
  id: string;
  foodName: string;
  calories: number;
  mealType: string;
  loggedAt: string;
};

export default function DashboardPage() {
  const [data, setData] = React.useState<Point[]>([]);
  const [todayCalories, setTodayCalories] = React.useState(0);
  const [todayProtein, setTodayProtein] = React.useState(0);
  const [todayCarbs, setTodayCarbs] = React.useState(0);
  const [todayFat, setTodayFat] = React.useState(0);
  const [dailyGoal, setDailyGoal] = React.useState(2000);
  const [recentMeals, setRecentMeals] = React.useState<RecentMeal[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) {
        setError("Failed to load dashboard.");
        return;
      }
      const j = await res.json();
      setData(j.points ?? []);
      setTodayCalories(j.today?.calories ?? 0);
      setTodayProtein(j.today?.protein ?? 0);
      setTodayCarbs(j.today?.carbs ?? 0);
      setTodayFat(j.today?.fat ?? 0);
      setDailyGoal(j.dailyGoal ?? 2000);
      setRecentMeals(j.recentMeals ?? []);
    })();
  }, []);

  return (
    <DashboardShell>
      <div className="grid gap-6">
        {/* Main Calorie Gauge and Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Calories</CardTitle>
              <CardDescription>Your daily progress</CardDescription>
            </CardHeader>
            <div className="flex items-center justify-center py-6">
              <CalorieGauge consumed={todayCalories} goal={dailyGoal} size={240} />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Quick access to main features</CardDescription>
            </CardHeader>
            <QuickActions onRefresh={() => setRefreshKey((k) => k + 1)} />
          </Card>
        </div>

        {/* Today's Macros */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Macros</CardTitle>
            <CardDescription>Protein, Carbs, and Fat breakdown</CardDescription>
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-emerald-50 p-4">
              <div className="text-sm text-emerald-600">Protein</div>
              <div className="text-2xl font-bold text-emerald-900">{todayProtein}g</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="text-sm text-blue-600">Carbs</div>
              <div className="text-2xl font-bold text-blue-900">{todayCarbs}g</div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="text-sm text-yellow-600">Fat</div>
              <div className="text-2xl font-bold text-yellow-900">{todayFat}g</div>
            </div>
          </div>
        </Card>

        {/* Recent Meals */}
        {recentMeals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Meals</CardTitle>
              <CardDescription>Your latest food entries</CardDescription>
            </CardHeader>
            <div className="space-y-2">
              {recentMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 p-3"
                >
                  <div>
                    <div className="font-medium text-zinc-900">{meal.foodName}</div>
                    <div className="text-xs text-zinc-600 capitalize">{meal.mealType}</div>
                  </div>
                  <div className="text-sm font-semibold text-zinc-900">{meal.calories} kcal</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Weekly Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Calories</CardTitle>
            <CardDescription>Calories consumed over the last 7 days</CardDescription>
          </CardHeader>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
