"use client";

import * as React from "react";

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function PasswordStrength({ password }: { password: string }) {
  const strength = React.useMemo(() => {
    if (!password) return { level: 0, label: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { level: 2, label: "Fair", color: "bg-yellow-500" };
    if (score <= 5) return { level: 3, label: "Good", color: "bg-blue-500" };
    return { level: 4, label: "Strong", color: "bg-green-500" };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="flex h-2 gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cx(
              "h-full flex-1 rounded",
              i <= strength.level ? strength.color : "bg-zinc-200"
            )}
          />
        ))}
      </div>
      <div className="text-xs text-zinc-600">
        Password strength: <span className="font-medium">{strength.label}</span>
      </div>
    </div>
  );
}
