"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordStrength } from "@/components/ui/PasswordStrength";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? "Failed to register.");
      return;
    }
    // Auto-login after registration and redirect to onboarding
    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (signInRes && !signInRes.error) {
      router.push("/onboarding");
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-300 via-emerald-200 to-emerald-100 px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-4xl font-bold tracking-tight text-emerald-900">
          Bite Balance
        </h1>

        <form
          onSubmit={onSubmit}
          className="rounded-[32px] bg-lime-100/90 p-8 shadow-xl shadow-emerald-300/40"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
            />
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
            />
            <div className="space-y-2">
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
              />
              <PasswordStrength password={password} />
            </div>

            {error && (
              <div className="text-center text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-full bg-lime-400 text-sm font-semibold text-emerald-900 shadow-md shadow-lime-300 transition-colors hover:bg-lime-300 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            <div className="text-center text-xs text-emerald-800">
              Already have an account?{" "}
              <Link className="font-medium hover:text-emerald-900" href="/login">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

