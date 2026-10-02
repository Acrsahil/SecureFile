import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthShell } from "@/components/auth-shell";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — MedShare" },
      { name: "description", content: "Create a MedShare account as a patient, doctor or hospital staff." },
      { property: "og:title", content: "Register — MedShare" },
      { property: "og:description", content: "Join MedShare to share medical documents securely." },
    ],
  }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  return (
    <AuthShell title="Create your account" subtitle="Start sharing medical documents securely.">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (pw !== pw2) { toast.error("Passwords do not match"); return; }
          toast.success("Account created");
          navigate({ to: "/dashboard" });
        }}
      >
        <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" required maxLength={100} /></div>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="pw2">Confirm Password</Label><Input id="pw2" type="password" required value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select defaultValue="patient">
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="staff">Hospital Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full" size="lg">Register</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already registered? <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link>
      </p>
    </AuthShell>
  );
}
