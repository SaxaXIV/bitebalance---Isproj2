import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(email?: string | null) {
  const allow = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!email) return false;
  return allow.includes(email.toLowerCase());
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const userId = params.id;

  try {
    // Prevent deleting yourself
    if ((session.user as any).id === userId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const userId = params.id;
  const body = await req.json().catch(() => ({}));
  const { message } = body;

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Warning message is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // In a real app, you'd send an email or notification here
    // For now, we'll just log it and return success
    console.log(`Warning sent to ${user.email}: ${message}`);

    return NextResponse.json({ 
      success: true, 
      message: `Warning sent to ${user.email}`,
      warningMessage: message 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send warning" }, { status: 500 });
  }
}
