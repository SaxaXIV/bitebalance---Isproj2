"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function RecipesPage() {
  return (
    <DashboardShell>
      <Card>
        <CardHeader>
          <CardTitle>Your Recipes</CardTitle>
          <CardDescription>Manage and create your favorite recipes</CardDescription>
        </CardHeader>
        <div className="text-center py-12 text-zinc-500">
          <p className="text-lg mb-2">🍳</p>
          <p>Recipe management coming soon!</p>
        </div>
      </Card>
    </DashboardShell>
  );
}
