"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";

type Profile = {
  age: number | null;
  sex: string | null;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: string | null;
  goal: string | null;
  dietType: string | null;
  allergies: string | null;
  dailyCalories: number | null;
};

export default function ProfilePage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/profile");
      setLoading(false);
      if (!res.ok) {
        setError("Failed to load profile.");
        return;
      }
      const j = await res.json();
      setData(j);
    })();
  }, []);

  const user = data?.user;
  const profile: Profile | null = data?.profile ?? null;
  const stats = data?.stats ?? { logs: 0, posts: 0 };

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <div className="rounded-xl bg-white border border-zinc-200 overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-emerald-400 to-lime-300" />
          {/* Avatar + actions */}
          <div className="-mt-10 flex items-end justify-between px-4 pb-4">
            <div className="flex items-end gap-4">
              <div className="h-20 w-20 rounded-full border-4 border-white bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-800">
                {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
              </div>
              <div className="pb-1">
                <div className="text-xl font-bold text-zinc-900">
                  {user?.name || "BiteBalance User"}
                </div>
                <div className="text-sm text-zinc-600">{user?.email}</div>
              </div>
            </div>
            <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/login" })}>
              Logout
            </Button>
          </div>
        </div>

        {loading ? <div className="text-sm text-zinc-600">Loading...</div> : null}
        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Stats</CardTitle>
              <CardDescription>Your activity</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-emerald-50 p-4">
                <div className="text-xs text-emerald-700">Food logs</div>
                <div className="text-2xl font-bold text-emerald-900">{stats.logs}</div>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4">
                <div className="text-xs text-emerald-700">Posts</div>
                <div className="text-2xl font-bold text-emerald-900">{stats.posts}</div>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Health Profile</CardTitle>
              <CardDescription>From your onboarding survey</CardDescription>
            </CardHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Daily calories" value={profile?.dailyCalories ? `${profile.dailyCalories} kcal` : "—"} />
              <Info label="Goal" value={profile?.goal ?? "—"} />
              <Info label="Diet type" value={profile?.dietType ?? "—"} />
              <Info label="Activity" value={profile?.activityLevel ?? "—"} />
              <Info label="Height" value={profile?.heightCm ? `${profile.heightCm} cm` : "—"} />
              <Info label="Weight" value={profile?.weightKg ? `${profile.weightKg} kg` : "—"} />
              <Info label="Age" value={profile?.age ?? "—"} />
              <Info label="Sex" value={profile?.sex ?? "—"} />
              <div className="sm:col-span-2">
                <Info label="Allergies" value={profile?.allergies ?? "—"} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3">
      <div className="text-xs font-semibold text-zinc-600">{label}</div>
      <div className="mt-1 text-sm text-zinc-900">{String(value)}</div>
    </div>
  );
}

