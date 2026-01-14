import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  // Seed a few challenges if none exist.
  const count = await prisma.challenge.count();
  if (count === 0) {
    await prisma.challenge.createMany({
      data: [
        { title: "7-day logging streak", description: "Log at least one meal per day for a week.", points: 100 },
        { title: "Hit protein goal 3x", description: "Hit your protein target on 3 separate days.", points: 50 },
        { title: "Drink water daily", description: "Track water intake every day for 5 days.", points: 20 },
      ],
    });
  }

  const challenges = await prisma.challenge.findMany({
    orderBy: { points: "desc" },
  });

  const userStates = await prisma.userChallenge.findMany({
    where: { userId },
  });

  const items = challenges.map((c) => {
    const state = userStates.find((s) => s.challengeId === c.id);
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      points: c.points,
      isActive: c.isActive,
      status: state?.status ?? "active",
      progress: state?.progress ?? 0,
    };
  });

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const body = await req.json().catch(() => null);
  const challengeId = (body?.challengeId ?? "").toString();
  const action = (body?.action ?? "").toString(); // "complete" | "increment"

  if (!challengeId || !action) {
    return NextResponse.json({ error: "challengeId and action are required." }, { status: 400 });
  }

  const existing = await prisma.userChallenge.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
  });

  let updated;
  if (!existing) {
    updated = await prisma.userChallenge.create({
      data: {
        userId,
        challengeId,
        status: action === "complete" ? "completed" : "active",
        progress: action === "increment" ? 1 : 0,
      },
    });
  } else {
    updated = await prisma.userChallenge.update({
      where: { userId_challengeId: { userId, challengeId } },
      data:
        action === "complete"
          ? { status: "completed" }
          : { progress: { increment: 1 } },
    });
  }

  return NextResponse.json({ item: updated });
}

