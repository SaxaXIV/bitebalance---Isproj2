"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to login page
    router.push("/login");
  }, [router]);

  // Show loading or redirect immediately
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-2xl font-bold text-emerald-900">Bite Balance</div>
        <div className="text-zinc-600">Redirecting to login...</div>
      </div>
    </div>
  );
}
