"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Plan = {
  id: string;
  name: string;
  priceCents: number;
  features?: string | null;
};

export default function SubscriptionsPage() {
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [currentPlanName, setCurrentPlanName] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function load() {
    setError(null);
    const res = await fetch("/api/subscriptions");
    if (!res.ok) {
      setError("Failed to load plans.");
      return;
    }
    const j = await res.json();
    setPlans(j.plans ?? []);
    setCurrentPlanName(j.current?.plan?.name ?? null);
  }

  React.useEffect(() => {
    load();
  }, []);

  async function changePlan(name: string) {
    setLoading(true);
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planName: name }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Failed to change subscription (are you logged in?).");
      return;
    }
    await load();
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>Choose a plan that fits your goals.</CardDescription>
        </CardHeader>
        {error ? <div className="mb-2 text-sm text-red-600">{error}</div> : null}
        <div className="grid gap-3 md:grid-cols-2">
          {plans.map((p) => {
            const features = (p.features ?? "").split(",").filter(Boolean);
            const price =
              p.priceCents === 0 ? "$0" : `$${(p.priceCents / 100).toFixed(0)}/mo`;
            const isCurrent = currentPlanName === p.name;
            return (
              <div key={p.id} className="rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex items-baseline justify-between">
                  <div className="text-sm font-semibold text-zinc-900">{p.name}</div>
                  <div className="text-sm text-zinc-700">{price}</div>
                </div>
                <ul className="mt-3 list-disc pl-5 text-sm text-zinc-700">
                  {features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Button
                    variant={isCurrent ? "secondary" : "primary"}
                    disabled={isCurrent || loading}
                    onClick={() => changePlan(p.name)}
                  >
                    {isCurrent ? "Current plan" : "Select"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

