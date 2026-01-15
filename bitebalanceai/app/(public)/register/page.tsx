"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create an account to start logging meals.</CardDescription>
        </CardHeader>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <Input
            label="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
          <div className="text-sm text-zinc-600">
            Already have an account?{" "}
            <Link className="text-zinc-900 underline" href="/login">
              Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

