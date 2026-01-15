import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const logs = await prisma.foodLog.findMany({
    where: { userId, loggedAt: { gte: start, lte: end } },
    include: { food: true },
    orderBy: { loggedAt: "asc" },
  });

  const map = new Map<
    string,
    { calories: number; protein: number; carbs: number; fat: number }
  >();
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    map.set(isoDay(d), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }

  for (const l of logs) {
    const key = isoDay(new Date(l.loggedAt));
    const agg = map.get(key) ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };
    const q = l.quantity;
    agg.calories += (l.food.calories ?? 0) * q;
    agg.protein += (l.food.protein ?? 0) * q;
    agg.carbs += (l.food.carbs ?? 0) * q;
    agg.fat += (l.food.fat ?? 0) * q;
    map.set(key, agg);
  }

  const points = Array.from(map.entries()).map(([date, v]) => ({
    date,
    calories: Math.round(v.calories),
    protein: Math.round(v.protein),
    carbs: Math.round(v.carbs),
    fat: Math.round(v.fat),
  }));

  // Get today's totals
  const todayKey = isoDay(new Date());
  const todayData = map.get(todayKey) ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  // Get user's daily calorie goal from profile
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { dailyCalories: true },
  });

  const dailyGoal = profile?.dailyCalories ?? 2000;

  // Get recent meals (last 5)
  const recentLogs = await prisma.foodLog.findMany({
    where: { userId },
    include: { food: true },
    orderBy: { loggedAt: "desc" },
    take: 5,
  });

  return NextResponse.json({
    points,
    today: {
      calories: Math.round(todayData.calories),
      protein: Math.round(todayData.protein),
      carbs: Math.round(todayData.carbs),
      fat: Math.round(todayData.fat),
    },
    dailyGoal,
    recentMeals: recentLogs.map((l) => ({
      id: l.id,
      foodName: l.food.name,
      calories: Math.round(l.food.calories * l.quantity),
      mealType: l.mealType,
      loggedAt: l.loggedAt.toISOString(),
    })),
  });
}

