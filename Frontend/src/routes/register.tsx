import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthShell } from "@/components/auth-shell";
import { authAPI, saveTokens, saveUser, hierarchyAPI, type User } from "@/lib/api";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — SecureMediShare" },
      { name: "description", content: "Create a MedShare account as a patient, doctor or hospital staff." },
      { property: "og:title", content: "Register — MedShare" },
      { property: "og:description", content: "Join MedShare to share medical documents securely." },
    ],
  }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("PATIENT");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("0");

  useEffect(() => {
    hierarchyAPI.staffList().then((res) => {
      if (res.data) setDoctors(res.data.filter(u => u.role === "DOCTOR"));
    }).catch(() => { });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== pw2) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register({
        full_name: fullName,
        email,
        role,
        password: pw,
        password2: pw2,
        assigned_to: role === "PATIENT" && selectedDoctor !== "0" ? parseInt(selectedDoctor, 10) : null,
      });
      if (res.success && res.data) {
        saveTokens(res.data.access, res.data.refresh);
        saveUser(res.data.user);
        toast.success("Account created! Welcome to MedShare.");
        navigate({ to: "/dashboard" });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start sharing medical documents securely.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" required maxLength={100} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw2">Confirm Password</Label>
            <Input id="pw2" type="password" required value={pw2} onChange={(e) => setPw2(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PATIENT">Patient</SelectItem>
              <SelectItem value="DOCTOR">Doctor</SelectItem>
              <SelectItem value="NURSE">Nurse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {role === "PATIENT" && (
          <div className="space-y-2">
            <Label>Assign to Doctor (Optional)</Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select a doctor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                {doctors.map(d => (
                  <SelectItem key={d.id} value={String(d.id)}>{d.full_name} {d.specialty ? `(${d.specialty})` : ""}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already registered? <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link>
      </p>
    </AuthShell>
  );
}
