import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>BiteBalanceAI</CardTitle>
          <CardDescription>
            Track meals, understand macros, and plan your week.
          </CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Register</Button>
          </Link>
          <Link href="/onboarding">
            <Button variant="ghost">Onboarding</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
