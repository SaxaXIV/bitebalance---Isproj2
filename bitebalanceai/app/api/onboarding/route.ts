import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const heightCm = Number(body?.heightCm);
  const weightKg = Number(body?.weightKg);
  const activityLevel = (body?.activityLevel ?? "").toString();
  const goal = (body?.goal ?? "").toString();

  if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg)) {
    return NextResponse.json({ error: "Invalid height/weight." }, { status: 400 });
  }

  const userId = (session.user as any).id as string;

  await prisma.userProfile.upsert({
    where: { userId },
    update: { heightCm, weightKg, activityLevel, goal },
    create: { userId, heightCm, weightKg, activityLevel, goal },
  });

  return NextResponse.json({ ok: true });
}

