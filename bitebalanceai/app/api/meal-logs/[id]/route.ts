import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const logId = params.id;

  try {
    // Verify the log belongs to the user
    const log = await prisma.foodLog.findUnique({
      where: { id: logId },
      select: { userId: true },
    });

    if (!log) {
      return NextResponse.json({ error: "Food log not found" }, { status: 404 });
    }

    if (log.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.foodLog.delete({
      where: { id: logId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete food log" }, { status: 500 });
  }
}
