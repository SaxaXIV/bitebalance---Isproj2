"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, THead, TH, TD } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [posts, setPosts] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setError(null);
    const [u, p] = await Promise.all([
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/posts").then((r) => r.json()),
    ]).catch(() => [null, null]);

    if (!u || u.error) {
      setError(u?.error ?? "Failed to load admin data. Set ADMIN_EMAILS on Vercel.");
      return;
    }
    setUsers(u.users ?? []);
    setPosts(p?.posts ?? []);
  }

  React.useEffect(() => {
    load();
  }, []);

  async function deletePost(id: string) {
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
          <CardDescription>View registrations and moderate posts.</CardDescription>
        </CardHeader>
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <Table>
          <THead>
            <tr>
              <TH>Name</TH>
              <TH>Username</TH>
              <TH>Email</TH>
              <TH>Created</TH>
            </tr>
          </THead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <TD className="font-medium text-zinc-900">{u.name ?? "—"}</TD>
                <TD>{u.username ?? "—"}</TD>
                <TD>{u.email}</TD>
                <TD>{new Date(u.createdAt).toLocaleDateString()}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts (moderation)</CardTitle>
        </CardHeader>
        <Table>
          <THead>
            <tr>
              <TH>Author</TH>
              <TH>Post</TH>
              <TH>Created</TH>
              <TH>Action</TH>
            </tr>
          </THead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b align-top">
                <TD className="font-medium text-zinc-900">{p.author}</TD>
                <TD className="max-w-[420px] whitespace-pre-wrap">{p.body}</TD>
                <TD>{new Date(p.createdAt).toLocaleDateString()}</TD>
                <TD>
                  <Button variant="danger" onClick={() => deletePost(p.id)}>
                    Delete
                  </Button>
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

