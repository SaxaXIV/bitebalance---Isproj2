import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const age = Number(body?.age);
  const sex = (body?.sex ?? "").toString();
  const heightCm = Number(body?.heightCm);
  const weightKg = Number(body?.weightKg);
  const activityLevel = (body?.activityLevel ?? "").toString();
  const goal = (body?.goal ?? "").toString();
  const dietType = (body?.dietType ?? "").toString();
  const allergies = (body?.allergies ?? "").toString() || null;
  const dailyCalories = Number(body?.dailyCalories);

  if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg)) {
    return NextResponse.json({ error: "Invalid height/weight." }, { status: 400 });
  }

  const userId = (session.user as any).id as string;

  await prisma.userProfile.upsert({
    where: { userId },
    update: {
      age: Number.isFinite(age) ? age : null,
      sex: sex || null,
      heightCm,
      weightKg,
      activityLevel: activityLevel || null,
      goal: goal || null,
      dietType: dietType || null,
      allergies: allergies || null,
      dailyCalories: Number.isFinite(dailyCalories) ? dailyCalories : null,
    },
    create: {
      userId,
      age: Number.isFinite(age) ? age : null,
      sex: sex || null,
      heightCm,
      weightKg,
      activityLevel: activityLevel || null,
      goal: goal || null,
      dietType: dietType || null,
      allergies: allergies || null,
      dailyCalories: Number.isFinite(dailyCalories) ? dailyCalories : null,
    },
  });

  return NextResponse.json({ ok: true });
}

