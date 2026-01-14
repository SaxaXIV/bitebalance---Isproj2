import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const body = await req.json().catch(() => null);
  const postId = (body?.postId ?? "").toString();
  const text = (body?.body ?? "").toString().trim();

  if (!postId || !text) {
    return NextResponse.json({ error: "postId and body are required." }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { postId, userId, body: text },
  });

  return NextResponse.json({ item: comment });
}

