import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, X, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/medshare";
import { profileAPI, saveUser, type User } from "@/lib/api";

export const Route = createFileRoute("/_dash/profile")({
  head: () => ({
    meta: [
      { title: "Profile — MedShare" },
      { name: "description", content: "View and edit your MedShare profile." },
    ],
  }),
  component: Profile,
});

const roleLabel = (r: string) => {
  switch (r) {
    case "ADMIN": return "Admin";
    case "DOCTOR": return "Doctor";
    case "NURSE": return "Nurse";
    default: return "Patient";
  }
};

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profileAPI.get()
      .then((res) => {
        if (res.data) {
          setUser(res.data);
          setFullName(res.data.full_name);
          setEmail(res.data.email);
          setPhone(res.data.phone || "");
          setSpecialty(res.data.specialty || "");
        }
      })
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  const handleSave = async () => {
    if (!fullName.trim()) { toast.error("Name cannot be empty"); return; }
    if (!email.trim()) { toast.error("Email cannot be empty"); return; }
    setSaving(true);
    try {
      const res = await profileAPI.update({ full_name: fullName, email, phone, specialty });
      if (res.data) {
        setUser(res.data);
        saveUser(res.data);
        setEditMode(false);
        toast.success("Profile updated successfully");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFullName(user.full_name);
      setEmail(user.email);
      setPhone(user.phone || "");
      setSpecialty(user.specialty || "");
    }
    setEditMode(false);
  };

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <PageHeader title="Profile" subtitle="Your personal information." />
        <div className="max-w-2xl rounded-3xl border bg-card p-6 shadow-card animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <span className="h-16 w-16 rounded-full bg-muted shrink-0" />
            <div className="space-y-2"><div className="h-4 bg-muted rounded w-32" /><div className="h-3 bg-muted rounded w-24" /></div>
          </div>
          {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-muted rounded-xl" />)}
        </div>
      </>
    );
  }

  // ── Field row helper ────────────────────────────────────────────────────
  const Field = ({ label, value, id, children }: { label: string; value: string; id: string; children?: React.ReactNode }) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</Label>
      {children ?? (
        <p className="rounded-xl border border-transparent bg-muted px-3 py-2.5 text-sm font-medium">
          {value}
        </p>
      )}
    </div>
  );

  return (
    <>
      <PageHeader title="Profile" subtitle="Your personal information." />
      <div className="max-w-2xl rounded-3xl border bg-card p-6 shadow-card">

        {/* Avatar header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-brand font-display text-xl font-bold text-primary-foreground shrink-0">
              {user.initials}
            </span>
            <div>
              <p className="font-display text-lg font-semibold">{user.full_name}</p>
              <p className="text-sm text-muted-foreground">{roleLabel(user.role)}</p>
            </div>
          </div>
          {!editMode && (
            <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
              <Pencil className="h-4 w-4 mr-1.5" /> Edit profile
            </Button>
          )}
        </div>

        {/* ── VIEW MODE ───────────────────────────────────────────────── */}
        {!editMode && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="v-name" label="Name" value={user.full_name} />
            <Field id="v-email" label="Email" value={user.email} />
            <Field id="v-role" label="Role" value={roleLabel(user.role)} />
            <Field id="v-since" label="Member Since" value={new Date(user.created_at).toLocaleDateString()} />
            {user.role !== "PATIENT" && (
              <Field id="v-specialty" label="Specialty" value={user.specialty || "—"} />
            )}
            <Field id="v-phone" label="Phone Number" value={user.phone || "—"} />
            {user.role !== "ADMIN" && user.assigned_to_name && (
              <Field id="v-assigned" label="Assigned To" value={user.assigned_to_name} />
            )}
          </div>
        )}

        {/* ── EDIT MODE ───────────────────────────────────────────────── */}
        {editMode && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="e-name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</Label>
                <Input
                  id="e-name"
                  autoFocus
                  value={fullName}
                  maxLength={150}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="e-email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</Label>
                <Input
                  id="e-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              {user.role !== "PATIENT" && (
                <div className="space-y-1.5">
                  <Label htmlFor="e-specialty" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Specialty</Label>
                  <Input
                    id="e-specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Cardiology"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="e-phone" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone Number</Label>
                <Input
                  id="e-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</Label>
                <p className="rounded-xl border border-transparent bg-muted px-3 py-2.5 text-sm font-medium text-muted-foreground">
                  {roleLabel(user.role)} <span className="text-xs">(cannot be changed)</span>
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Member Since</Label>
                <p className="rounded-xl border border-transparent bg-muted px-3 py-2.5 text-sm font-medium text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>

              {user.role !== "ADMIN" && user.assigned_to_name && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assigned To</Label>
                  <p className="rounded-xl border border-transparent bg-muted px-3 py-2.5 text-sm font-medium text-muted-foreground">
                    {user.assigned_to_name}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-1.5" />
                {saving ? "Saving…" : "Save changes"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1.5" /> Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
