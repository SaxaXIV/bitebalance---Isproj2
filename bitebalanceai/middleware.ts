import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = new Set([
  "/login",
  "/register",
  "/",
]);

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname.startsWith("/api/register")) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore next internals/static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Check if NEXTAUTH_SECRET is configured
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error("NEXTAUTH_SECRET is not configured");
    // Allow access to public paths even if secret is missing
    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }
    // For protected routes, redirect to login with error
    if (!pathname.startsWith("/api")) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "configuration");
      return NextResponse.redirect(url);
    }
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const token = await getToken({ req, secret });
  const isAuthed = Boolean(token);

  // Helper function to check if user is admin
  function isAdmin(email?: string | null) {
    if (!email) return false;
    const allow = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    return allow.includes(email.toLowerCase());
  }

  const userEmail = token?.email as string | undefined;
  const userIsAdmin = isAdmin(userEmail);

  // If not authed and trying to access protected route → /login
  if (!isAuthed && !isPublicPath(pathname) && !pathname.startsWith("/api")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Block protected APIs too (except public ones)
  if (!isAuthed && pathname.startsWith("/api") && !isPublicPath(pathname)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Redirect root path to login
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If not authenticated and trying to access /admin → redirect to login
  if (!isAuthed && pathname === "/admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", "/admin");
    return NextResponse.redirect(url);
  }

  // If authenticated but not admin and trying to access /admin → redirect to dashboard
  if (isAuthed && !userIsAdmin && pathname === "/admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // If authed and visiting login/register → redirect based on admin status
  if (isAuthed && (pathname === "/login" || pathname === "/register")) {
    const url = req.nextUrl.clone();
    url.pathname = userIsAdmin ? "/admin" : "/dashboard";
    return NextResponse.redirect(url);
  }

  // Redirect admins from onboarding/dashboard to admin page
  if (isAuthed && userIsAdmin && (pathname === "/onboarding" || pathname === "/dashboard")) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

