import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { CloudUpload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, SecureNote } from "@/components/medshare";
import { users } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_dash/upload")({
  head: () => ({
    meta: [
      { title: "Upload File — MedShare" },
      { name: "description", content: "Upload a medical document and share it with authorized users." },
      { property: "og:title", content: "Upload File — MedShare" },
      { property: "og:description", content: "Upload and securely share a medical document." },
    ],
  }),
  component: UploadPage,
});

function fmt(n: number) {
  return n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`;
}

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [user, setUser] = useState("");
  const [access, setAccess] = useState("view");
  const input = useRef<HTMLInputElement>(null);

  return (
    <>
      <PageHeader title="Upload File" subtitle="Add a medical document and choose who can access it." />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
            className={cn("grid place-items-center rounded-3xl border-2 border-dashed bg-card p-12 text-center transition", drag ? "border-primary bg-accent" : "border-border")}
          >
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-glow"><CloudUpload className="h-8 w-8" /></span>
            <p className="mt-5 font-display text-lg font-semibold">Drag & Drop Medical Document</p>
            <p className="my-2 text-sm text-muted-foreground">or</p>
            <Button variant="outline" onClick={() => input.current?.click()}>Browse Files</Button>
            <input ref={input} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.dcm" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
            <p className="mt-3 text-xs text-muted-foreground">PDF, JPG, PNG or DICOM</p>
          </div>
          {file && (
            <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card animate-in fade-in slide-in-from-bottom-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground"><FileText className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{file.name}</p>
                <p className="text-xs text-muted-foreground">{fmt(file.size)}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} aria-label="Remove"><X /></Button>
            </div>
          )}
        </div>
        <div className="space-y-5 rounded-3xl border bg-card p-6 shadow-card lg:col-span-2">
          <h2 className="font-semibold">Share With</h2>
          <div className="space-y-2">
            <Label>Select user</Label>
            <Select value={user} onValueChange={setUser}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Search doctors, staff…" /></SelectTrigger>
              <SelectContent>{users.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Permission</Label>
            <RadioGroup value={access} onValueChange={setAccess} className="gap-2">
              {([["view", "View Only"], ["download", "View & Download"]] as const).map(([v, l]) => (
                <label key={v} className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-accent">
                  <RadioGroupItem value={v} /> {l}
                </label>
              ))}
            </RadioGroup>
          </div>
          <SecureNote />
          <Button className="w-full" size="lg" disabled={!file}
            onClick={() => { toast.success(`${file!.name} uploaded${user ? ` and shared with ${user}` : ""}`); setFile(null); setUser(""); }}>
            Upload
          </Button>
        </div>
      </div>
    </>
  );
}
