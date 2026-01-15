"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideChrome = pathname === "/login" || pathname === "/register";

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      {hideChrome ? null : <Navbar />}
      <main className={hideChrome ? "" : "mx-auto w-full max-w-6xl px-4 py-8"}>
        {children}
      </main>
      {hideChrome ? null : <Footer />}
    </div>
  );
}
