"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <div className="text-center py-12 text-zinc-500">
          <p className="text-lg mb-2">⚙️</p>
          <p>Settings page coming soon!</p>
        </div>
      </Card>
    </DashboardShell>
  );
}
