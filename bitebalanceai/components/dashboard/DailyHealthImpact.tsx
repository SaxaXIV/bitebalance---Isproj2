"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

interface DailyHealthImpactProps {
  hasFoodLogged: boolean;
}

export function DailyHealthImpact({ hasFoodLogged }: DailyHealthImpactProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Health Impact</CardTitle>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2">
        {/* CAUSE Section */}
        <div className="rounded-lg bg-zinc-50 p-4 border-2 border-zinc-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            CAUSE
          </div>
          <div className="text-base font-medium text-zinc-900">
            {hasFoodLogged
              ? "Your logged meals are contributing to your health goals"
              : "No food logged yet"}
          </div>
        </div>

        {/* RESULT Section */}
        <div className="rounded-lg bg-emerald-50 p-4 border-2 border-emerald-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">
            RESULT
          </div>
          <div className="text-base font-medium text-emerald-900">
            {hasFoodLogged
              ? "Track your progress and see improvements over time"
              : "Log your meals to see how they impact your body"}
          </div>
        </div>
      </div>

      {/* Balanced Profile Link */}
      <div className="mt-4 pt-4 border-t border-zinc-200">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <span>View Balanced Profile</span>
          <span>→</span>
        </Link>
      </div>
    </Card>
  );
}
