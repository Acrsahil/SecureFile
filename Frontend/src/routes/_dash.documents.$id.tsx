import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Eye, FileText, Lock, ShieldCheck, Share2, Trash2, UserMinus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  documentsAPI,
  sharingAPI,
  usersAPI,
  fetchProtectedFile,
  type Document,
  type DocumentAccess,
  type User,
} from "@/lib/api";

export const Route = createFileRoute("/_dash/documents/$id")({
  head: () => ({
    meta: [
      { title: "Document — MedShare" },
      { name: "description", content: "Secure document viewer." },
    ],
  }),
  component: Viewer,
});

function Viewer() {
  const { id } = Route.useParams();
  const router = useRouter();
  const docId = parseInt(id);

  const [doc, setDoc] = useState<Document | null>(null);
  const [access, setAccess] = useState<DocumentAccess[]>([]);
  const [myPermission, setMyPermission] = useState<"VIEW" | "DOWNLOAD" | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [shareUserId, setShareUserId] = useState("");
  const [sharePermission, setSharePermission] = useState<"VIEW" | "DOWNLOAD">("VIEW");
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      documentsAPI.get(docId),
      usersAPI.list(),
    ])
      .then(([docRes, usersRes]) => {
        if (docRes.data) setDoc(docRes.data);
        if (usersRes.data) setUsers(usersRes.data);
      })
      .catch(() => toast.error("Failed to load document"))
      .finally(() => setLoading(false));
  }, [docId]);

  // Load access list if owner; load my own permission if shared user
  useEffect(() => {
    if (!doc) return;
    if (doc.is_owner) {
      sharingAPI.listAccess(docId)
        .then((res) => { if (res.data) setAccess(res.data); })
        .catch(() => { });
    } else {
      // Find this document in the shared-with-me list to get permission
      sharingAPI.sharedWithMe()
        .then((res) => {
          const mine = res.data?.find((s) => s.document_id === docId);
          if (mine) setMyPermission(mine.permission);
        })
        .catch(() => { });
    }
  }, [doc, docId]);

  const handleView = async () => {
    try {
      const blob = await fetchProtectedFile(docId, false);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch {
      toast.error("Cannot open file — access denied");
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await fetchProtectedFile(docId, true);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc?.title ?? "document";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch {
      toast.error("Download denied — you need DOWNLOAD permission");
    }
  };

  const handleShare = async () => {
    if (!shareUserId) { toast.error("Please select a user"); return; }
    setSharing(true);
    try {
      await sharingAPI.share(docId, parseInt(shareUserId), sharePermission);
      const res = await sharingAPI.listAccess(docId);
      if (res.data) setAccess(res.data);
      setShareUserId("");
      toast.success("Document shared successfully");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Share failed");
    } finally {
      setSharing(false);
    }
  };

  const handleRevoke = async (userId: number, userName: string) => {
    if (!confirm(`Revoke ${userName}'s access?`)) return;
    try {
      await sharingAPI.revokeAccess(docId, userId);
      setAccess((a) => a.filter((x) => x.user !== userId));
      toast.success(`Access revoked for ${userName}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Revoke failed");
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border bg-card p-4 shadow-card animate-pulse h-96" />
        <div className="rounded-3xl border bg-card p-6 shadow-card animate-pulse h-96" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="py-20 text-center">
        <p className="font-semibold text-destructive">Document not found or access denied.</p>
        <Link to="/files" className="mt-2 block text-sm text-primary">Back to My Files</Link>
      </div>
    );
  }

  // canDownload: owner always can, shared users only if DOWNLOAD permission
  const canDownload = doc.is_owner || myPermission === "DOWNLOAD";

  // Find users not already having access
  const existingUserIds = access.map((a) => a.user);
  const availableUsers = users.filter((u) => !existingUserIds.includes(u.id));

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left — file preview */}
      <div className="lg:col-span-2 rounded-3xl border bg-card p-4 shadow-card">
        <div className="grid aspect-[3/4] max-h-[75vh] w-full place-items-center rounded-2xl bg-muted">
          <div className="text-center">
            <FileText className="mx-auto h-16 w-16 text-primary" />
            <p className="mt-3 font-display font-semibold">{doc.title}</p>
            <p className="text-sm text-muted-foreground">{doc.document_type} · {doc.file_size}</p>
            <div className="mt-4 flex justify-center gap-2">
              <Button size="sm" onClick={handleView}><Eye className="h-4 w-4 mr-1" /> View File</Button>
              <Button size="sm" variant="outline" onClick={handleDownload}><Download className="h-4 w-4 mr-1" /> Download</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right — info + share */}
      <div className="space-y-4">
        {/* Info card */}
        <div className="rounded-3xl border bg-card p-6 shadow-card">
          <h1 className="text-xl font-bold">{doc.title}</h1>
          <dl className="mt-5 space-y-3 text-sm">
            {[
              ["Type", doc.document_type],
              ["Uploaded by", doc.uploaded_by_name],
              ["Size", `${doc.file_extension} · ${doc.file_size}`],
              ["Date", new Date(doc.created_at).toLocaleDateString()],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-teal-soft p-4 text-teal">
            <ShieldCheck className="h-6 w-6 shrink-0" />
            <div>
              <p className="font-semibold">Authorized Access</p>
              <p className="text-xs">{doc.is_owner ? "You own this document" : "Shared with you"}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            <Button onClick={handleView}><Eye /> View</Button>
            <Button variant="outline" onClick={handleDownload}>{canDownload ? <Download /> : <Lock />} Download</Button>
            <Button variant="ghost" onClick={() => router.history.back()}><X /> Close</Button>
          </div>
        </div>

        {/* Share panel — only for document owner */}
        {doc.is_owner && (
          <div className="rounded-3xl border bg-card p-6 shadow-card space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Share2 className="h-4 w-4" /> Share Document</h2>
            <div className="space-y-2">
              <Label>Select user</Label>
              <Select value={shareUserId} onValueChange={setShareUserId}>
                <SelectTrigger><SelectValue placeholder="Choose a user…" /></SelectTrigger>
                <SelectContent>
                  {availableUsers.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.full_name} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Permission</Label>
              <Select value={sharePermission} onValueChange={(v) => setSharePermission(v as "VIEW" | "DOWNLOAD")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEW">View Only</SelectItem>
                  <SelectItem value="DOWNLOAD">View & Download</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleShare} disabled={sharing}>
              {sharing ? "Sharing…" : "Share"}
            </Button>

            {/* Current access list */}
            {access.length > 0 && (
              <div className="mt-2 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Who has access</p>
                {access.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                    <div>
                      <p className="font-medium">{a.user_name}</p>
                      <p className="text-xs text-muted-foreground">{a.permission === "DOWNLOAD" ? "View & Download" : "View Only"}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="text-destructive h-8 w-8"
                      onClick={() => handleRevoke(a.user, a.user_name)} title="Revoke access">
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {doc && (
        <Dialog open={!!previewUrl} onOpenChange={(open) => {
          if (!open) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
        }}>
          <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>Preview: {doc.title}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 bg-muted/30 overflow-hidden relative">
              <iframe
                src={previewUrl || ""}
                className="absolute inset-0 w-full h-full border-0"
                title={doc.title}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
