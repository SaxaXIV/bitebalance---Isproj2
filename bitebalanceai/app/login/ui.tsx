"use client";

import * as React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search?.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);

    if (!res || res.error) {
      setError("Invalid username or password.");
      return;
    }
    router.push(res.url ?? callbackUrl);
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
              type="email"
              required
              autoComplete="email"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
            />
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 pr-12 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400"
              >
                👁️
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-700">
              <button type="button" className="opacity-60 hover:opacity-100">
                Forgot Password?
              </button>
            </div>

            {/* Fake reCAPTCHA */}
            <div className="flex items-center gap-3 rounded-md bg-white px-3 py-2 text-[11px] text-emerald-800 shadow-inner">
              <div className="flex h-4 w-4 items-center justify-center rounded border border-emerald-300 bg-emerald-50" />
              <span>I&apos;m not a robot</span>
              <div className="ml-auto flex items-center gap-1">
                <div className="h-5 w-16 rounded bg-sky-100" />
                <span className="text-[9px] text-emerald-600">Privacy</span>
                <span className="text-[9px] text-emerald-600">Terms</span>
              </div>
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
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="my-4 flex items-center gap-4 text-[11px] text-emerald-700/70">
              <div className="h-px flex-1 bg-emerald-200" />
              <span>or</span>
              <div className="h-px flex-1 bg-emerald-200" />
            </div>

            <button
              type="button"
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold text-emerald-700 shadow-md hover:shadow-lg"
            >
              G
            </button>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="mt-4 block w-full text-center text-xs font-medium text-emerald-800 hover:text-emerald-900"
            >
              Create an Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

