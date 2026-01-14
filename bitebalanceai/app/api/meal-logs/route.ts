import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const items = await prisma.foodLog.findMany({
    where: { userId },
    orderBy: { loggedAt: "desc" },
    take: 50,
    include: { food: true },
  });

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const body = await req.json().catch(() => null);
  const foodId = (body?.foodId ?? "").toString();
  const quantity = Number(body?.quantity);
  const mealType = (body?.mealType ?? "").toString();

  if (!foodId) return NextResponse.json({ error: "foodId is required." }, { status: 400 });
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return NextResponse.json({ error: "quantity must be > 0." }, { status: 400 });
  }
  if (!mealType) return NextResponse.json({ error: "mealType is required." }, { status: 400 });

  const created = await prisma.foodLog.create({
    data: {
      userId,
      foodId,
      quantity,
      mealType,
      loggedAt: new Date(),
    },
  });

  return NextResponse.json({ item: created });
}

