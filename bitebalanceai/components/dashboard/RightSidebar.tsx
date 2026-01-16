"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

export function RightSidebar() {
  return (
    <div className="space-y-4">
      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Links</CardTitle>
        </CardHeader>
        <div className="space-y-2">
          <Link
            href="/foods"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50 transition-colors text-sm text-zinc-700 hover:text-emerald-700"
          >
            <span>📚</span>
            <span>Food Database</span>
          </Link>
          <Link
            href="/recipes"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50 transition-colors text-sm text-zinc-700 hover:text-emerald-700"
          >
            <span>🍳</span>
            <span>Your Recipes</span>
          </Link>
          <Link
            href="/community"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50 transition-colors text-sm text-zinc-700 hover:text-emerald-700"
          >
            <span>👥</span>
            <span>Community</span>
          </Link>
        </div>
      </Card>

      {/* Nutrition Knowledge */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nutrition Knowledge</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          <div className="border-l-4 border-emerald-500 pl-3">
            <div className="text-sm font-semibold text-zinc-900">Growth</div>
            <div className="text-xs text-zinc-600 mt-1">
              Essential nutrients for healthy development
            </div>
          </div>
          <div className="border-l-4 border-emerald-500 pl-3">
            <div className="text-sm font-semibold text-zinc-900">Energy</div>
            <div className="text-xs text-zinc-600 mt-1">
              Fuel your body with balanced macronutrients
            </div>
          </div>
          <div className="border-l-4 border-emerald-500 pl-3">
            <div className="text-sm font-semibold text-zinc-900">Disease Prevention</div>
            <div className="text-xs text-zinc-600 mt-1">
              Reduce risk through proper nutrition
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
