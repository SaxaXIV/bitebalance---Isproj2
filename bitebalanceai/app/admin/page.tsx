"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, THead, TH, TD } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [posts, setPosts] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [seedLoading, setSeedLoading] = React.useState(false);
  const [seedResult, setSeedResult] = React.useState<string | null>(null);
  
  // Food form state
  const [foodForm, setFoodForm] = React.useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    source: "fnri",
  });
  const [foodFormLoading, setFoodFormLoading] = React.useState(false);
  const [foodFormError, setFoodFormError] = React.useState<string | null>(null);
  const [foodFormSuccess, setFoodFormSuccess] = React.useState<string | null>(null);
  
  // Warning modal state
  const [warningModal, setWarningModal] = React.useState<{
    open: boolean;
    userId: string | null;
    userName: string;
  }>({ open: false, userId: null, userName: "" });
  const [warningMessage, setWarningMessage] = React.useState("");
  const [warningLoading, setWarningLoading] = React.useState(false);

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
    if (!confirm("Are you sure you want to delete this post?")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    await load();
  }

  async function deleteUser(id: string, email: string) {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete user");
        return;
      }
      await load();
    } catch (err) {
      alert("Failed to delete user");
    } finally {
      setLoading(false);
    }
  }

  async function sendWarning() {
    if (!warningModal.userId || !warningMessage.trim()) {
      alert("Please enter a warning message");
      return;
    }
    setWarningLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${warningModal.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: warningMessage }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to send warning");
        return;
      }
      alert(`Warning sent to ${warningModal.userName}`);
      setWarningModal({ open: false, userId: null, userName: "" });
      setWarningMessage("");
    } catch (err) {
      alert("Failed to send warning");
    } finally {
      setWarningLoading(false);
    }
  }

  async function addFood(e: React.FormEvent) {
    e.preventDefault();
    setFoodFormError(null);
    setFoodFormSuccess(null);
    setFoodFormLoading(true);
    
    try {
      const res = await fetch("/api/admin/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: foodForm.name.trim(),
          calories: Number(foodForm.calories),
          protein: foodForm.protein ? Number(foodForm.protein) : null,
          carbs: foodForm.carbs ? Number(foodForm.carbs) : null,
          fat: foodForm.fat ? Number(foodForm.fat) : null,
          fiber: foodForm.fiber ? Number(foodForm.fiber) : null,
          source: foodForm.source,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        setFoodFormError(data.error || "Failed to add food");
        return;
      }
      
      setFoodFormSuccess(`Food "${foodForm.name}" added successfully!`);
      setFoodForm({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        fiber: "",
        source: "fnri",
      });
    } catch (err) {
      setFoodFormError("Failed to add food");
    } finally {
      setFoodFormLoading(false);
    }
  }

  async function seedFoods() {
    if (!confirm("This will add 500 dishes to the food database. Continue?")) return;
    setSeedLoading(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/admin/seed-foods", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setSeedResult(`Error: ${data.error || "Failed to seed foods"}`);
        return;
      }
      setSeedResult(`Success! Created ${data.created} new foods and updated ${data.updated} existing foods.`);
    } catch (err) {
      setSeedResult("Failed to seed foods");
    } finally {
      setSeedLoading(false);
    }
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

      {/* Add Food Section */}
      <Card>
        <CardHeader>
          <CardTitle>Add Food to Database</CardTitle>
          <CardDescription>Manually add a new food item to the food database</CardDescription>
        </CardHeader>
        <form onSubmit={addFood} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Food Name *
              </label>
              <input
                type="text"
                required
                value={foodForm.name}
                onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                placeholder="e.g., Chicken Adobo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Calories *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={foodForm.calories}
                onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                placeholder="e.g., 220"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={foodForm.protein}
                onChange={(e) => setFoodForm({ ...foodForm, protein: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                placeholder="e.g., 28"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={foodForm.carbs}
                onChange={(e) => setFoodForm({ ...foodForm, carbs: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={foodForm.fat}
                onChange={(e) => setFoodForm({ ...foodForm, fat: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                placeholder="e.g., 9"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Fiber (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={foodForm.fiber}
                onChange={(e) => setFoodForm({ ...foodForm, fiber: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                placeholder="e.g., 2"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Source
              </label>
              <select
                value={foodForm.source}
                onChange={(e) => setFoodForm({ ...foodForm, source: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2"
              >
                <option value="fnri">FNRI</option>
                <option value="ai">AI</option>
              </select>
            </div>
          </div>
          {foodFormError && (
            <div className="text-sm text-red-600">{foodFormError}</div>
          )}
          {foodFormSuccess && (
            <div className="text-sm text-emerald-600">{foodFormSuccess}</div>
          )}
          <Button type="submit" disabled={foodFormLoading}>
            {foodFormLoading ? "Adding..." : "Add Food"}
          </Button>
        </form>
      </Card>

      {/* Seed Foods Section */}
      <Card>
        <CardHeader>
          <CardTitle>Seed Food Database</CardTitle>
          <CardDescription>Add 500 Filipino dishes to the food database</CardDescription>
        </CardHeader>
        <div className="space-y-2">
          <Button onClick={seedFoods} disabled={seedLoading} variant="secondary">
            {seedLoading ? "Seeding..." : "Seed 500 Dishes"}
          </Button>
          {seedResult && (
            <div className={`text-sm ${seedResult.startsWith("Error") ? "text-red-600" : "text-emerald-600"}`}>
              {seedResult}
            </div>
          )}
        </div>
      </Card>

      {/* Users Table */}
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
              <TH>Role</TH>
              <TH>Created</TH>
              <TH>Actions</TH>
            </tr>
          </THead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <TD className="font-medium text-zinc-900">{u.name ?? "—"}</TD>
                <TD>{u.username ?? "—"}</TD>
                <TD>{u.email}</TD>
                <TD>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    {u.role === "admin" ? "Admin" : "Member"}
                  </span>
                </TD>
                <TD>{new Date(u.createdAt).toLocaleDateString()}</TD>
                <TD>
                  <div className="flex gap-2">
                    <Button
                      variant="danger"
                      onClick={() => deleteUser(u.id, u.email)}
                      disabled={loading}
                      className="text-xs px-2 py-1"
                    >
                      Delete
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setWarningModal({
                          open: true,
                          userId: u.id,
                          userName: u.name || u.email,
                        })
                      }
                      disabled={loading}
                      className="text-xs px-2 py-1"
                    >
                      Warn
                    </Button>
                  </div>
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Posts Table */}
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

      {/* Warning Modal */}
      {warningModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Send Warning to {warningModal.userName}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Warning Message
                </label>
                <textarea
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 min-h-[100px]"
                  placeholder="Enter warning message..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setWarningModal({ open: false, userId: null, userName: "" });
                    setWarningMessage("");
                  }}
                  disabled={warningLoading}
                >
                  Cancel
                </Button>
                <Button onClick={sendWarning} disabled={warningLoading}>
                  {warningLoading ? "Sending..." : "Send Warning"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
