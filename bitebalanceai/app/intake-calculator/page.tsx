"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function IntakeCalculatorPage() {
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState<"male" | "female">("male");
  const [height, setHeight] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [activityLevel, setActivityLevel] = React.useState<"low" | "moderate" | "high">("moderate");
  const [goal, setGoal] = React.useState<"lose" | "maintain" | "gain">("maintain");
  const [dailyCalories, setDailyCalories] = React.useState<number | null>(null);

  const calculateIntake = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    
    if (a > 0 && h > 0 && w > 0) {
      // BMR calculation using Mifflin-St Jeor Equation
      let bmr = 10 * w + 6.25 * h - 5 * a;
      if (gender === "male") {
        bmr += 5;
      } else {
        bmr -= 161;
      }

      // Activity multiplier
      const activityMultipliers = {
        low: 1.2,
        moderate: 1.55,
        high: 1.725,
      };

      let tdee = bmr * activityMultipliers[activityLevel];

      // Goal adjustment
      if (goal === "lose") tdee -= 500;
      else if (goal === "gain") tdee += 500;

      setDailyCalories(Math.round(tdee));
    }
  };

  return (
    <DashboardShell>
      <Card>
        <CardHeader>
          <CardTitle>Daily Calorie Intake Calculator</CardTitle>
          <CardDescription>Calculate your recommended daily calorie intake</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2"
              placeholder="Enter age"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as "male" | "female")}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
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
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as "low" | "moderate" | "high")}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2"
            >
              <option value="low">Low (sedentary)</option>
              <option value="moderate">Moderate (active)</option>
              <option value="high">High (very active)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as "lose" | "maintain" | "gain")}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2"
            >
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Weight</option>
            </select>
          </div>
          <Button onClick={calculateIntake} className="w-full">
            Calculate Daily Intake
          </Button>
          {dailyCalories !== null && (
            <div className="mt-6 p-4 rounded-lg bg-emerald-50 border-2 border-emerald-200">
              <div className="text-center">
                <div className="text-sm text-emerald-600 mb-1">Recommended Daily Calories</div>
                <div className="text-4xl font-bold text-emerald-900">{dailyCalories} kcal</div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </DashboardShell>
  );
}
