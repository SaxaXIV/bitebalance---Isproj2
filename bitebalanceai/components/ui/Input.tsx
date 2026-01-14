"use client";

import * as React from "react";

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function Input({
  label,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <label className="block">
      {label ? (
        <div className="mb-1 text-sm font-medium text-zinc-900">{label}</div>
      ) : null}
      <input
        {...props}
        className={cx(
          "w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400",
          error ? "border-red-400" : "border-zinc-200",
          className
        )}
      />
      {error ? (
        <div className="mt-1 text-sm text-red-600">{error}</div>
      ) : null}
    </label>
  );
}

