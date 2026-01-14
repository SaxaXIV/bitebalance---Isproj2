"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/foods", label: "Foods" },
  { href: "/meal-logs", label: "Meal Logs" },
  { href: "/meal-planner", label: "Meal Planner" },
  { href: "/community", label: "Community" },
  { href: "/challenges", label: "Challenges" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const { data } = useSession();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-sm font-semibold text-zinc-900">
          BiteBalanceAI
        </Link>
        <nav className="hidden flex-wrap gap-3 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-700 hover:text-zinc-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {data?.user ? (
            <>
              <span className="hidden text-sm text-zinc-600 sm:inline">
                {data.user.email}
              </span>
              <Button variant="secondary" onClick={() => signOut()}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link className="text-sm text-zinc-700 hover:text-zinc-900" href="/login">
                Login
              </Link>
              <Link className="text-sm text-zinc-700 hover:text-zinc-900" href="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

