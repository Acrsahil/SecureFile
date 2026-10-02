import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/medshare";
import { currentUser } from "@/lib/mock-data";

export const Route = createFileRoute("/_dash/profile")({
  head: () => ({
    meta: [
      { title: "Profile — MedShare" },
      { name: "description", content: "View and edit your MedShare profile." },
      { property: "og:title", content: "Profile — MedShare" },
      { property: "og:description", content: "Your MedShare profile details." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [p, setP] = useState(currentUser);
  const [edit, setEdit] = useState(false);
  const fields = [["name", "Name"], ["email", "Email"], ["role", "Role"], ["organization", "Organization"]] as const;
  return (
    <>
      <PageHeader title="Profile" subtitle="Your personal information." />
      <div className="max-w-2xl rounded-3xl border bg-card p-6 shadow-card">
        <div className="mb-6 flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand font-display text-xl font-bold text-primary-foreground">SA</span>
          <div><p className="font-display text-lg font-semibold">{p.name}</p><p className="text-sm text-muted-foreground">{p.role} · {p.organization}</p></div>
        </div>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); setEdit(false); toast.success("Profile updated"); }}>
          {fields.map(([k, l]) => (
            <div key={k} className="space-y-2">
              <Label htmlFor={k}>{l}</Label>
              <Input id={k} value={p[k]} disabled={!edit || k === "role"} maxLength={100} onChange={(e) => setP({ ...p, [k]: e.target.value })} />
            </div>
          ))}
          <div className="flex gap-2 sm:col-span-2">
            {edit ? (
              <><Button type="submit">Save changes</Button><Button type="button" variant="outline" onClick={() => { setP(currentUser); setEdit(false); }}>Cancel</Button></>
            ) : (
              <Button type="button" onClick={() => setEdit(true)}>Edit profile</Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
