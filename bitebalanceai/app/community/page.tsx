"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Comment = { id: string; body: string; author: string; createdAt: string };
type Post = {
  id: string;
  author: string;
  body: string;
  likes: number;
  createdAt: string;
  comments: Comment[];
};

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setError(null);
    const res = await fetch("/api/community");
    if (!res.ok) {
      setError("Failed to load posts.");
      return;
    }
    const j = await res.json();
    const items: Post[] = (j.items ?? []).map((p: any) => ({
      id: p.id,
      author: p.user?.email ?? "User",
      body: p.body,
      likes: p.likes,
      createdAt: p.createdAt,
      comments: (p.comments ?? []).map((c: any) => ({
        id: c.id,
        body: c.body,
        author: c.user?.email ?? "User",
        createdAt: c.createdAt,
      })),
    }));
    setPosts(items);
  }

  React.useEffect(() => {
    load();
  }, []);

  async function createPost() {
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Failed to create post (are you logged in?).");
      return;
    }
    setText("");
    await load();
  }

  async function likePost(id: string) {
    await fetch("/api/community/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id }),
    });
    await load();
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Community</CardTitle>
          <CardDescription>Share updates and tips with others.</CardDescription>
        </CardHeader>
        <div className="flex gap-2">
          <Input
            placeholder="Write a post..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button onClick={createPost} disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
        {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
      </Card>

      <div className="grid gap-3">
        {posts.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-900">{p.author}</div>
                <div className="mt-1 text-sm text-zinc-700">{p.body}</div>
                <div className="mt-2 space-y-1 text-xs text-zinc-600">
                  {p.comments.map((c) => (
                    <div key={c.id}>
                      <span className="font-semibold">{c.author}:</span> {c.body}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => likePost(p.id)}
              >
                Like ({p.likes})
              </Button>
            </div>
          </Card>
        ))}
        {!posts.length ? (
          <div className="text-sm text-zinc-600">No posts yet. Be the first!</div>
        ) : null}
      </div>
    </div>
  );
}

