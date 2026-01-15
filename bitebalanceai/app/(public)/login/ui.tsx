"use client";

import * as React from "react";
import Link from "next/link";
import { getProviders, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search?.get("callbackUrl") ?? "/onboarding";

  const [googleEnabled, setGoogleEnabled] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const providers = await getProviders().catch(() => null);
      setGoogleEnabled(Boolean(providers && (providers as any).google));
    })();
  }, []);

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

  async function onGoogle() {
    setError(null);
    setLoading(true);
    if (!googleEnabled) {
      setLoading(false);
      setError("Google login is not configured yet.");
      return;
    }
    await signIn("google", { callbackUrl: "/onboarding" });
    // NextAuth will redirect; keep loading state for UI
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
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 pr-12 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-700">
              <button type="button" className="opacity-60 hover:opacity-100">
                Forgot Password?
              </button>
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
              onClick={onGoogle}
              disabled={loading || !googleEnabled}
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold text-emerald-700 shadow-md hover:shadow-lg"
            >
              G
            </button>
            {!googleEnabled ? (
              <div className="text-center text-[11px] text-emerald-700/70">
                Google login will be enabled after you set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Vercel.
              </div>
            ) : null}

            <Link
              href="/register"
              className="mt-4 block w-full text-center text-xs font-medium text-emerald-800 hover:text-emerald-900"
            >
              Create an Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

