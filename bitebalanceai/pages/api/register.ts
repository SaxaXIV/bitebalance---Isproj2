import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

function calcDailyCalories(opts: {
  age: number;
  sex: string;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  goal: string;
}) {
  const { age, sex, heightCm, weightKg, activityLevel, goal } = opts;
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Allow", "POST, OPTIONS");
  // Helpful sanity check: if you visit /api/register in browser, you should see this JSON.
  if (req.method === "GET") {
    res.status(200).json({
      ok: true,
      handler: "pages/api/register.ts",
      allow: "POST, OPTIONS",
      time: new Date().toISOString(),
    });
    return;
  }

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed", method: req.method });
    return;
  }

  try {
    const body = req.body ?? {};
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
      res.status(400).json({ error: "Full name, email and password are required." });
      return;
    }
    if (!username) {
      res.status(400).json({ error: "Username is required." });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords do not match." });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters." });
      return;
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      res.status(409).json({ error: "Email already in use." });
      return;
    }
    const usernameExists = await prisma.user.findFirst({ where: { username } });
    if (usernameExists) {
      res.status(409).json({ error: "Username already in use." });
      return;
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

    res.setHeader("X-Register-Handler", "pages-api");
    res.status(200).json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ? String(err.message) : "Registration failed." });
  }
}

