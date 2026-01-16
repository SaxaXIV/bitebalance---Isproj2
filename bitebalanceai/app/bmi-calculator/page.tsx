"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function BMICalculatorPage() {
  const [height, setHeight] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [bmi, setBmi] = React.useState<number | null>(null);
  const [category, setCategory] = React.useState<string>("");

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmiValue = w / ((h / 100) ** 2);
      setBmi(Number(bmiValue.toFixed(1)));
      
      if (bmiValue < 18.5) setCategory("Underweight");
      else if (bmiValue < 25) setCategory("Normal weight");
      else if (bmiValue < 30) setCategory("Overweight");
      else setCategory("Obese");
    }
  };

  return (
    <DashboardShell>
      <Card>
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>Calculate your Body Mass Index</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2"
              placeholder="Enter height in cm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2"
              placeholder="Enter weight in kg"
            />
          </div>
          <Button onClick={calculateBMI} className="w-full">
            Calculate BMI
          </Button>
          {bmi !== null && (
            <div className="mt-6 p-4 rounded-lg bg-emerald-50 border-2 border-emerald-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-900 mb-2">{bmi}</div>
                <div className="text-lg font-semibold text-emerald-700">{category}</div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </DashboardShell>
  );
}
