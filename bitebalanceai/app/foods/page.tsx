"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table, THead, TH, TD } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

export default function FoodsPage() {
  const [q, setQ] = React.useState("");
  const [minCalories, setMinCalories] = React.useState("");
  const [minProtein, setMinProtein] = React.useState("");
  const [minCarbs, setMinCarbs] = React.useState("");
  const [minFat, setMinFat] = React.useState("");
  const [foods, setFoods] = React.useState<Food[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (minCalories) params.set("minCalories", minCalories);
    if (minProtein) params.set("minProtein", minProtein);
    if (minCarbs) params.set("minCarbs", minCarbs);
    if (minFat) params.set("minFat", minFat);
    const res = await fetch(`/api/foods?${params.toString()}`);
    setLoading(false);
    if (!res.ok) {
      setError("Failed to load foods.");
      return;
    }
    const j = await res.json();
    setFoods(j.items ?? []);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Food Database</CardTitle>
          <CardDescription>Search and filter foods (FNRI + AI-generated).</CardDescription>
        </CardHeader>

        <div className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-5">
            <Input label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Input label="Min calories" inputMode="numeric" value={minCalories} onChange={(e) => setMinCalories(e.target.value)} />
            <Input label="Min protein" inputMode="numeric" value={minProtein} onChange={(e) => setMinProtein(e.target.value)} />
            <Input label="Min carbs" inputMode="numeric" value={minCarbs} onChange={(e) => setMinCarbs(e.target.value)} />
            <Input label="Min fat" inputMode="numeric" value={minFat} onChange={(e) => setMinFat(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={load} disabled={loading}>
              {loading ? "Loading..." : "Apply"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setQ("");
                setMinCalories("");
                setMinProtein("");
                setMinCarbs("");
                setMinFat("");
                setTimeout(load, 0);
              }}
            >
              Clear
            </Button>
          </div>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
        </div>
      </Card>

      <Card>
        <Table>
          <THead>
            <tr>
              <TH>Name</TH>
              <TH>Calories</TH>
              <TH>Protein</TH>
              <TH>Carbs</TH>
              <TH>Fat</TH>
            </tr>
          </THead>
          <tbody>
            {foods.map((f) => (
              <tr key={f.id} className="border-b">
                <TD className="font-medium text-zinc-900">{f.name}</TD>
                <TD>{f.calories}</TD>
                <TD>{f.protein ?? "-"}</TD>
                <TD>{f.carbs ?? "-"}</TD>
                <TD>{f.fat ?? "-"}</TD>
              </tr>
            ))}
            {!foods.length ? (
              <tr>
                <TD colSpan={5} className="py-6 text-center text-zinc-600">
                  No foods found.
                </TD>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

