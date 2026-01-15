"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Activity = "low" | "moderate" | "high";
type Goal = "lose" | "maintain" | "gain";

export default function OnboardingPage() {
  const router = useRouter();
  const [heightCm, setHeightCm] = React.useState("");
  const [weightKg, setWeightKg] = React.useState("");
  const [activityLevel, setActivityLevel] = React.useState<Activity>("moderate");
  const [goal, setGoal] = React.useState<Goal>("maintain");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  function validate() {
    const h = Number(heightCm);
    const w = Number(weightKg);
    if (!Number.isFinite(h) || h < 80 || h > 250) return "Height must be 80–250 cm.";
    if (!Number.isFinite(w) || w < 25 || w > 300) return "Weight must be 25–300 kg.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setError(null);
    setLoading(true);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        activityLevel,
        goal,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? "Failed to save onboarding.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Onboarding</CardTitle>
          <CardDescription>Tell us a bit about you.</CardDescription>
        </CardHeader>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Height (cm)"
              inputMode="numeric"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              required
            />
            <Input
              label="Weight (kg)"
              inputMode="numeric"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              required
            />
          </div>

          <label className="block">
            <div className="mb-1 text-sm font-medium text-zinc-900">Activity level</div>
            <select
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as Activity)}
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-medium text-zinc-900">Goal</div>
            <select
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
              value={goal}
              onChange={(e) => setGoal(e.target.value as Goal)}
            >
              <option value="lose">Lose weight</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain weight</option>
            </select>
          </label>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save & continue"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/dashboard")}>
              Skip
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

