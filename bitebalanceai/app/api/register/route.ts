import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

export async function GET(req: Request) {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: corsHeaders(req) }
  );
}

function calcDailyCalories(opts: {
  age: number;
  sex: string;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  goal: string;
}) {
  const { age, sex, heightCm, weightKg, activityLevel, goal } = opts;
  // Mifflin-St Jeor
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr += sex === "male" ? 5 : -161;

  const mult: Record<string, number> = {
    sedentary: 1.2,
    low: 1.2,
    moderate: 1.55,
    active: 1.725,
    high: 1.725,
  };
  const tdee = bmr * (mult[activityLevel] ?? 1.55);

  const adjust: Record<string, number> = {
    lose: -500,
    lose_weight: -500,
    maintain: 0,
    gain: 300,
    gain_muscle: 300,
  };
  return Math.round(tdee + (adjust[goal] ?? 0));
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const fullName = (body?.fullName ?? body?.name ?? "").toString().trim() || null;
    const username = (body?.username ?? "").toString().trim().toLowerCase() || null;
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const password = (body?.password ?? "").toString();
    const confirmPassword = (body?.confirmPassword ?? "").toString();

    const address = (body?.address ?? "").toString().trim() || null;
    const cityCountry = (body?.cityCountry ?? "").toString().trim() || null;
    const age = Number(body?.age);
    const sex = (body?.sex ?? body?.gender ?? "").toString().trim().toLowerCase();
    const heightCm = Number(body?.heightCm);
    const weightKg = Number(body?.weightKg);
    const activityLevel = (body?.activityLevel ?? "").toString().trim().toLowerCase();
    const goal = (body?.goal ?? "").toString().trim().toLowerCase();
    const dietType = (body?.dietType ?? body?.dietaryPreference ?? "").toString().trim() || null;
    const allergies = (body?.allergies ?? "").toString().trim() || null;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email and password are required." },
        { status: 400, headers: corsHeaders(req) }
      );
    }
    if (!username) {
      return NextResponse.json({ error: "Username is required." }, { status: 400, headers: corsHeaders(req) });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400, headers: corsHeaders(req) });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409, headers: corsHeaders(req) });
    }
    const usernameExists = await prisma.user.findFirst({ where: { username } });
    if (usernameExists) {
      return NextResponse.json({ error: "Username already in use." }, { status: 409, headers: corsHeaders(req) });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash, name: fullName, username },
    });

    const hasProfileBasics =
      Number.isFinite(age) &&
      !!sex &&
      Number.isFinite(heightCm) &&
      Number.isFinite(weightKg) &&
      !!activityLevel &&
      !!goal;

    if (hasProfileBasics) {
      const dailyCalories = calcDailyCalories({
        age,
        sex,
        heightCm,
        weightKg,
        activityLevel,
        goal,
      });
      await prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
          address,
          cityCountry,
          age,
          sex,
          heightCm,
          weightKg,
          activityLevel,
          goal,
          dietType,
          allergies,
          dailyCalories,
        },
        create: {
          userId: user.id,
          address,
          cityCountry,
          age,
          sex,
          heightCm,
          weightKg,
          activityLevel,
          goal,
          dietType,
          allergies,
          dailyCalories,
        },
      });
    }

    return NextResponse.json({ ok: true }, { headers: corsHeaders(req) });
  } catch (err: any) {
    // Most common production cause: DB not migrated yet (missing username/address columns)
    const msg = err?.message ? String(err.message) : "Registration failed.";
    return NextResponse.json({ error: msg }, { status: 500, headers: corsHeaders(req) });
  }
}

