import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth-shell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — MedShare" },
      { name: "description", content: "Sign in to your MedShare account." },
      { property: "og:title", content: "Login — MedShare" },
      { property: "og:description", content: "Sign in to access your secure medical documents." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  return (
    <AuthShell title="Welcome back" subtitle="Log in to access your medical documents.">
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required placeholder="you@example.com" /></div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Password</Label>
            <button type="button" className="text-xs font-medium text-primary hover:underline">Forgot Password?</button>
          </div>
          <Input id="password" type="password" required placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full" size="lg">Login</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account? <Link to="/register" className="font-semibold text-primary hover:underline">Register</Link>
      </p>
    </AuthShell>
  );
}
