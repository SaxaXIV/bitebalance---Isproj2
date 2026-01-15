import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(email?: string | null) {
  const allow = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!email) return false;
  return allow.includes(email.toLowerCase());
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = ctx.params.id;
  await prisma.post.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

