import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const postId = (body?.postId ?? "").toString();
  if (!postId) return NextResponse.json({ error: "postId is required." }, { status: 400 });

  const post = await prisma.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } },
  });

  return NextResponse.json({ item: post });
}

