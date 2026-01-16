"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function ReportsPage() {
  return (
    <DashboardShell>
      <Card>
        <CardHeader>
          <CardTitle>My Reports</CardTitle>
          <CardDescription>View detailed nutrition reports and analytics</CardDescription>
        </CardHeader>
        <div className="text-center py-12 text-zinc-500">
          <p className="text-lg mb-2">📈</p>
          <p>Nutrition reports coming soon!</p>
        </div>
      </Card>
    </DashboardShell>
  );
}
