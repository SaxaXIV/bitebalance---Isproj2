import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id as string;

  const [user, profile, logsCount, postsCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    }),
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.foodLog.count({ where: { userId } }),
    prisma.post.count({ where: { userId } }),
  ]);

  return NextResponse.json({
    user,
    profile,
    stats: {
      logs: logsCount,
      posts: postsCount,
    },
  });
}

