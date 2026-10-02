import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, FileText, Share2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/medshare";
import { documentsAPI, type Document } from "@/lib/api";

export const Route = createFileRoute("/_dash/files")({
  head: () => ({
    meta: [
      { title: "My Files — MedShare" },
      { name: "description", content: "Manage your uploaded medical documents." },
      { property: "og:title", content: "My Files — MedShare" },
      { property: "og:description", content: "Your uploaded medical documents." },
    ],
  }),
  component: Files,
});

function Files() {
  const [files, setFiles] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    documentsAPI.list()
      .then((res) => { if (res.data) setFiles(res.data); })
      .catch(() => toast.error("Failed to load files"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (doc: Document) => {
    if (!confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    try {
      await documentsAPI.delete(doc.id);
      setFiles((f) => f.filter((x) => x.id !== doc.id));
      toast.success(`"${doc.title}" deleted`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <>
      <PageHeader title="My Files" subtitle="Documents you've uploaded.">
        <Button asChild><Link to="/upload"><Upload /> Upload</Link></Button>
      </PageHeader>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="rounded-2xl border bg-card p-5 shadow-card animate-pulse h-48" />)}
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center shadow-card">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-semibold">No documents yet</p>
          <p className="text-sm text-muted-foreground mt-1">Upload your first medical document to get started.</p>
          <Button asChild className="mt-4"><Link to="/upload">Upload a Document</Link></Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {files.map((f) => (
            <div key={f.id} className="rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <FileText className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-teal-soft px-2 py-0.5 text-xs font-medium text-teal">
                  {f.document_type}
                </span>
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <dl className="mt-2 grid grid-cols-2 gap-y-1 text-xs text-muted-foreground">
                <dt>Type</dt><dd className="text-foreground">{f.file_extension} · {f.file_size}</dd>
                <dt>Uploaded</dt><dd className="text-foreground">{new Date(f.created_at).toLocaleDateString()}</dd>
              </dl>
              <div className="mt-4 flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link to="/documents/$id" params={{ id: String(f.id) }}><Eye /> View</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link to="/documents/$id" params={{ id: String(f.id) }}><Share2 /> Share</Link>
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive" aria-label="Delete"
                  onClick={() => handleDelete(f)}>
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
