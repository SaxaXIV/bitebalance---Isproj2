import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(email?: string | null) {
  const allow = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!email) return false;
  return allow.includes(email.toLowerCase());
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const { name, calories, protein, carbs, fat, fiber, source } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Food name is required" }, { status: 400 });
    }

    if (typeof calories !== "number" || calories < 0) {
      return NextResponse.json({ error: "Valid calories value is required" }, { status: 400 });
    }

    const food = await prisma.food.create({
      data: {
        name: name.trim(),
        calories: Number(calories),
        protein: protein != null ? Number(protein) : null,
        carbs: carbs != null ? Number(carbs) : null,
        fat: fat != null ? Number(fat) : null,
        fiber: fiber != null ? Number(fiber) : null,
        source: source || "fnri",
      },
    });

    return NextResponse.json({ success: true, food });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Food with this name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create food" }, { status: 500 });
  }
}
