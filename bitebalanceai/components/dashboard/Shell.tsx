"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/meal-logs", label: "Food Log", icon: "🍽️" },
  { href: "/foods", label: "Food Database", icon: "📚" },
  { href: "/recipes", label: "Your Recipes", icon: "🍳" },
  { href: "/meal-planner", label: "Meal Plan", icon: "📅" },
  { href: "/bmi-calculator", label: "BMI Calculator", icon: "⚖️" },
  { href: "/intake-calculator", label: "Intake Calculator", icon: "🧮" },
  { href: "/community", label: "Community", icon: "👥" },
  { href: "/reports", label: "My Reports", icon: "📈" },
  { href: "/profile", label: "My Profile", icon: "👤" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-emerald-50">
      {/* Left Sidebar */}
      <aside className="hidden w-64 border-r border-emerald-100 bg-white px-4 py-6 text-sm md:flex md:flex-col">
        <div className="mb-8 text-xl font-bold text-emerald-700">Bite Balance</div>
        
        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-emerald-600">
          MAIN MENU
        </div>
        
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  active
                    ? "bg-emerald-100 text-emerald-900 font-semibold"
                    : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile at Bottom */}
        <div className="mt-auto border-t border-emerald-100 pt-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-200 flex items-center justify-center text-xs font-semibold text-emerald-700">
              {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-emerald-900 truncate">
                {session?.user?.name || session?.user?.email || "User"}
              </div>
              <div className="text-xs text-emerald-600">Free Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-10 border-b border-emerald-100 bg-white px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-emerald-700">Bite Balance</h1>
              <span className="hidden md:block text-sm text-zinc-500">
                {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                href="/subscriptions"
                className="hidden sm:block rounded-lg border border-emerald-300 bg-white px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                Subscription
              </Link>
              <button className="relative hover:opacity-80 transition-opacity">
                <span className="text-lg md:text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-red-500 border-2 border-white"></span>
              </button>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="hidden sm:inline-flex rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                Logout
              </button>
              <Link
                href="/profile"
                className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-emerald-200 flex items-center justify-center text-xs font-semibold text-emerald-700 hover:bg-emerald-300 transition-colors cursor-pointer"
              >
                {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "U"}
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-emerald-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
