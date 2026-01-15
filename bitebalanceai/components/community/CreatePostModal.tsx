"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Failed to create post.");
      return;
    }
    setText("");
    onSuccess();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Create Post</CardTitle>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-900"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !text.trim()} className="flex-1">
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
