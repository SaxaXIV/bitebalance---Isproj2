"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
