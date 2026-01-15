import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const seedFoods = [
  { name: "Chicken breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6, source: "fnri" },
  { name: "White rice (1 cup)", calories: 205, protein: 4.3, carbs: 45, fat: 0.4, source: "fnri" },
  { name: "Egg (1 large)", calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, source: "fnri" },
  { name: "Banana (1 medium)", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, source: "fnri" },
];

function num(q: string | null) {
  if (!q) return null;
  const n = Number(q);
  return Number.isFinite(n) ? n : null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const source = url.searchParams.get("source") ?? null; // "fnri" or "ai"
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? "50") || 50));
  const minCalories = num(url.searchParams.get("minCalories"));
  const minProtein = num(url.searchParams.get("minProtein"));
  const minCarbs = num(url.searchParams.get("minCarbs"));
  const minFat = num(url.searchParams.get("minFat"));

  const count = await prisma.food.count();
  if (count === 0) {
    await prisma.food.createMany({ data: seedFoods, skipDuplicates: true });
  }

  const where = {
    AND: [
      q ? { name: { contains: q, mode: "insensitive" as const } } : {},
      source ? { source } : {},
      minCalories != null ? { calories: { gte: minCalories } } : {},
      minProtein != null ? { protein: { gte: minProtein } } : {},
      minCarbs != null ? { carbs: { gte: minCarbs } } : {},
      minFat != null ? { fat: { gte: minFat } } : {},
    ],
  };

  const total = await prisma.food.count({ where });
  const items = await prisma.food.findMany({
    where,
    orderBy: { name: "asc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json({ items, total, page, limit });
}

