import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { CloudUpload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, SecureNote } from "@/components/medshare";
import { documentsAPI, sharingAPI, usersAPI, type User } from "@/lib/api";
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

const DOCUMENT_TYPES = [
  "Prescription",
  "Blood Test",
  "MRI",
  "X-Ray",
  "Medical Report",
  "Discharge Summary",
  "Other",
];

function fmt(n: number) {
  return n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`;
}

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("Other");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [access, setAccess] = useState<"VIEW" | "DOWNLOAD">("VIEW");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usersAPI.list()
      .then((res) => { if (res.data) setUsers(res.data); })
      .catch(() => { });
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    if (!title.trim()) { toast.error("Please enter a document title"); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("document_type", docType);
      formData.append("file", file);

      const uploadRes = await documentsAPI.upload(formData);
      if (!uploadRes.success || !uploadRes.data) throw new Error("Upload failed");

      const docId = uploadRes.data.id;

      // If a user was selected, share with them
      if (selectedUserId) {
        await sharingAPI.share(docId, parseInt(selectedUserId), access);
        const userName = users.find((u) => String(u.id) === selectedUserId)?.full_name ?? "user";
        toast.success(`${file.name} uploaded and shared with ${userName}`);
      } else {
        toast.success(`${file.name} uploaded successfully`);
      }

      // Reset form
      setFile(null);
      setTitle("");
      setDocType("Other");
      setSelectedUserId("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Upload File" subtitle="Add a medical document and choose who can access it." />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          {/* Drop Zone */}
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

          {/* File preview */}
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

          {/* Title input */}
          <div className="space-y-2">
            <Label htmlFor="doc-title">Document Title</Label>
            <Input id="doc-title" placeholder="e.g. Blood Test Report — Oct 2026" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} />
          </div>

          {/* Document type */}
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Share panel */}
        <div className="space-y-5 rounded-3xl border bg-card p-6 shadow-card lg:col-span-2">
          <h2 className="font-semibold">Share With (Optional)</h2>
          <div className="space-y-2">
            <Label>Select user</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Search doctors, staff…" /></SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.full_name} · {u.role === "ADMIN" ? "Admin" : u.role === "DOCTOR" ? "Doctor" : u.role === "NURSE" ? "Nurse" : "Patient"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Permission</Label>
            <RadioGroup value={access} onValueChange={(v) => setAccess(v as "VIEW" | "DOWNLOAD")} className="gap-2">
              {([["VIEW", "View Only"], ["DOWNLOAD", "View & Download"]] as const).map(([v, l]) => (
                <label key={v} className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-accent">
                  <RadioGroupItem value={v} /> {l}
                </label>
              ))}
            </RadioGroup>
          </div>
          <SecureNote />
          <Button className="w-full" size="lg" disabled={!file || loading} onClick={handleUpload}>
            {loading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>
    </>
  );
}
