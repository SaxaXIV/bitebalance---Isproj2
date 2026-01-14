"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Item = {
  id: string;
  title: string;
  description?: string | null;
  points: number;
  status: string;
  progress: number;
};

export default function ChallengesPage() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setError(null);
    const res = await fetch("/api/challenges");
    if (!res.ok) {
      setError("Failed to load challenges (are you logged in?).");
      return;
    }
    const j = await res.json();
    setItems(j.items ?? []);
  }

  React.useEffect(() => {
    load();
  }, []);

  async function updateChallenge(id: string, action: "complete" | "increment") {
    const res = await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId: id, action }),
    });
    if (!res.ok) {
      setError("Failed to update challenge.");
      return;
    }
    await load();
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Challenges</CardTitle>
          <CardDescription>Earn points by completing healthy habits.</CardDescription>
        </CardHeader>
        {error ? <div className="mb-2 text-sm text-red-600">{error}</div> : null}
        <div className="grid gap-2">
          {items.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-md border border-zinc-200 bg-white p-3"
            >
              <div>
                <div className="text-sm font-semibold text-zinc-900">{c.title}</div>
                {c.description ? (
                  <div className="text-xs text-zinc-600">{c.description}</div>
                ) : null}
                <div className="text-xs text-zinc-600">
                  Status: {c.status} • Progress: {c.progress}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold">{c.points} pts</div>
                <Button
                  variant="secondary"
                  onClick={() => updateChallenge(c.id, "increment")}
                >
                  + Progress
                </Button>
                {c.status !== "completed" && (
                  <Button
                    variant="primary"
                    onClick={() => updateChallenge(c.id, "complete")}
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!items.length ? (
            <div className="text-sm text-zinc-600">
              No challenges yet. They will appear once you are logged in.
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

