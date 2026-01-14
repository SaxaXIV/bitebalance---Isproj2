import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user ? ((session.user as any).id as string) : null;

  const plansCount = await prisma.subscriptionPlan.count();
  if (plansCount === 0) {
    await prisma.subscriptionPlan.createMany({
      data: [
        {
          name: "Free",
          priceCents: 0,
          features: "Meal logging,Basic dashboard",
        },
        {
          name: "Pro",
          priceCents: 900,
          features: "AI meal ideas,Advanced analytics,Meal planner",
        },
      ],
    });
  }

  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { priceCents: "asc" },
  });

  let current: any = null;
  if (userId) {
    current = await prisma.subscription.findFirst({
      where: { userId, status: "active" },
      include: { plan: true },
    });
  }

  return NextResponse.json({ plans, current });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const body = await req.json().catch(() => null);
  const planName = (body?.planName ?? "").toString();
  if (!planName) return NextResponse.json({ error: "planName is required." }, { status: 400 });

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { name: planName },
  });
  if (!plan) return NextResponse.json({ error: "Plan not found." }, { status: 404 });

  // Cancel existing active subscription, if any.
  await prisma.subscription.updateMany({
    where: { userId, status: "active" },
    data: { status: "canceled", endsAt: new Date() },
  });

  const sub = await prisma.subscription.create({
    data: {
      userId,
      planId: plan.id,
      status: "active",
      startedAt: new Date(),
    },
    include: { plan: true },
  });

  return NextResponse.json({ subscription: sub });
}

