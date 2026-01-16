"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

interface QuickActionCardProps {
  icon: string;
  title: string;
  href: string;
  description?: string;
}

function QuickActionCard({ icon, title, href, description }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:border-emerald-300 cursor-pointer">
        <div className="flex items-center gap-4 p-4">
          <div className="text-4xl group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-zinc-900 group-hover:text-emerald-700 transition-colors">
              {title}
            </div>
            {description && (
              <div className="text-xs text-zinc-500 mt-1">{description}</div>
            )}
          </div>
          <div className="text-zinc-400 group-hover:text-emerald-600 transition-colors">
            →
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function QuickActionCards() {
  return (
    <div className="space-y-3">
      <QuickActionCard
        icon="🍽️"
        title="Food Log"
        href="/meal-logs"
        description="Track your meals"
      />
      <QuickActionCard
        icon="⚖️"
        title="BMI Calculator"
        href="/bmi-calculator"
        description="Calculate your BMI"
      />
      <QuickActionCard
        icon="🧮"
        title="Daily Calorie Intake Calculator"
        href="/intake-calculator"
        description="Calculate your daily needs"
      />
    </div>
  );
}
