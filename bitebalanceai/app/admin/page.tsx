"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, THead, TH, TD } from "@/components/ui/Table";

export default function AdminPage() {
  // Minimal placeholder tables; wire to admin APIs later.
  const users = [
    { email: "admin@example.com", role: "admin" },
    { email: "user@example.com", role: "user" },
  ];
  const foods = [
    { name: "Chicken breast", calories: 165 },
    { name: "Rice", calories: 205 },
  ];

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
          <CardDescription>Manage users, foods, reports (minimal UI).</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <Table>
          <THead>
            <tr>
              <TH>Email</TH>
              <TH>Role</TH>
            </tr>
          </THead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b">
                <TD className="font-medium text-zinc-900">{u.email}</TD>
                <TD>{u.role}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Foods</CardTitle>
        </CardHeader>
        <Table>
          <THead>
            <tr>
              <TH>Name</TH>
              <TH>Calories</TH>
            </tr>
          </THead>
          <tbody>
            {foods.map((f) => (
              <tr key={f.name} className="border-b">
                <TD className="font-medium text-zinc-900">{f.name}</TD>
                <TD>{f.calories}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

