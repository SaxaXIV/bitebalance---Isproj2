import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function isAdmin(email?: string | null) {
  const allow = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!email) return false;
  return allow.includes(email.toLowerCase());
}

export async function POST() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // This endpoint just acknowledges the request
  // In production, you might want to invalidate all sessions from the database
  // For now, clients will need to call signOut() themselves
  
  return NextResponse.json({ 
    success: true, 
    message: "To logout, use the signOut() function from next-auth/react on the client side" 
  });
}
