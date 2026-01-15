"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { CreatePostModal } from "@/components/community/CreatePostModal";
import { CommentModal } from "@/components/community/CommentModal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BottomNav } from "@/components/mobile/BottomNav";

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
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [commentModal, setCommentModal] = React.useState<{
    isOpen: boolean;
    postId: string;
    postAuthor: string;
    postBody: string;
  }>({ isOpen: false, postId: "", postAuthor: "", postBody: "" });

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
    <DashboardShell>
      <div className="space-y-6 pb-20 md:pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Community</h1>
            <p className="text-sm text-zinc-600">Share updates and tips with others</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>➕ Create Post</Button>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="grid gap-4">
          {posts.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                        {p.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">{p.author}</div>
                        <div className="text-xs text-zinc-500">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-zinc-700 whitespace-pre-wrap">{p.body}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t border-zinc-100 pt-3">
                  <button
                    type="button"
                    onClick={() => likePost(p.id)}
                    className="flex items-center gap-2 text-sm text-zinc-600 hover:text-emerald-600"
                  >
                    <span>❤️</span>
                    <span>{p.likes}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCommentModal({
                        isOpen: true,
                        postId: p.id,
                        postAuthor: p.author,
                        postBody: p.body,
                      })
                    }
                    className="flex items-center gap-2 text-sm text-zinc-600 hover:text-emerald-600"
                  >
                    <span>💬</span>
                    <span>{p.comments.length}</span>
                  </button>
                </div>

                {p.comments.length > 0 && (
                  <div className="space-y-2 border-t border-zinc-100 pt-3">
                    {p.comments.map((c) => (
                      <div key={c.id} className="flex gap-2 text-sm">
                        <span className="font-semibold text-zinc-900">{c.author}:</span>
                        <span className="text-zinc-700">{c.body}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
          {!posts.length && (
            <Card>
              <div className="py-8 text-center text-sm text-zinc-600">
                No posts yet. Be the first to share!
              </div>
            </Card>
          )}
        </div>
      </div>

      <BottomNav />

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={load}
      />

      <CommentModal
        isOpen={commentModal.isOpen}
        onClose={() => setCommentModal({ ...commentModal, isOpen: false })}
        onSuccess={load}
        postId={commentModal.postId}
        postAuthor={commentModal.postAuthor}
        postBody={commentModal.postBody}
      />
    </DashboardShell>
  );
}

