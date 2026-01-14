"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

type Point = {
  date: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export default function DashboardPage() {
  const [data, setData] = React.useState<Point[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) {
        setError("Failed to load dashboard.");
        return;
      }
      const j = await res.json();
      setData(j.points ?? []);
    })();
  }, []);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Calories and macros for the last 7 days.</CardDescription>
        </CardHeader>
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#111827" strokeWidth={2} />
              <Line type="monotone" dataKey="protein" stroke="#16a34a" />
              <Line type="monotone" dataKey="carbs" stroke="#2563eb" />
              <Line type="monotone" dataKey="fat" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

