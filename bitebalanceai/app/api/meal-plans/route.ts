import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/meal-plans?start=YYYY-MM-DD&end=YYYY-MM-DD
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const url = new URL(req.url);
  const startStr = url.searchParams.get("start");
  const endStr = url.searchParams.get("end");

  const today = new Date();
  const monday = new Date(today);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const start = startStr ? new Date(startStr) : monday;
  const end = endStr ? new Date(endStr) : new Date(start.getTime() + 6 * 86400000);
  end.setHours(23, 59, 59, 999);

  const items = await prisma.mealPlan.findMany({
    where: { userId, date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ items });
}

// POST /api/meal-plans
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const body = await req.json().catch(() => null);
  const dateStr = (body?.date ?? "").toString();
  const mealType = (body?.mealType ?? "").toString();
  const title = (body?.title ?? "").toString();
  const notes = (body?.notes ?? "").toString() || null;

  if (!dateStr || !mealType || !title) {
    return NextResponse.json({ error: "date, mealType, and title are required." }, { status: 400 });
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  const plan = await prisma.mealPlan.create({
    data: { userId, date, mealType, title, notes },
  });

  return NextResponse.json({ item: plan });
}

