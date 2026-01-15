import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(email?: string | null) {
  const allow = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!email) return false;
  return allow.includes(email.toLowerCase());
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true, name: true, username: true } } },
    take: 200,
  });

  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      body: p.body,
      likes: p.likes,
      createdAt: p.createdAt.toISOString(),
      author: p.user?.username ?? p.user?.name ?? p.user?.email ?? "User",
      authorEmail: p.user?.email ?? null,
    })),
  });
}

