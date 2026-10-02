import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, FileText, Share2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge } from "@/components/medshare";
import { myFiles } from "@/lib/mock-data";

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
  const [files, setFiles] = useState(myFiles);
  return (
    <>
      <PageHeader title="My Files" subtitle="Documents you've uploaded.">
        <Button asChild><Link to="/upload"><Upload /> Upload</Link></Button>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {files.map((f) => (
          <div key={f.id} className="rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground"><FileText className="h-5 w-5" /></span>
              <StatusBadge status={f.status} />
            </div>
            <h3 className="mt-4 font-semibold">{f.name}</h3>
            <dl className="mt-2 grid grid-cols-2 gap-y-1 text-xs text-muted-foreground">
              <dt>Type</dt><dd className="text-foreground">{f.type} · {f.size}</dd>
              <dt>Uploaded</dt><dd className="text-foreground">{f.date}</dd>
              <dt>Owner</dt><dd className="text-foreground">{f.owner}</dd>
            </dl>
            <div className="mt-4 flex gap-2">
              <Button asChild size="sm" variant="outline" className="flex-1"><Link to="/documents/$id" params={{ id: f.id }}><Eye /> View</Link></Button>
              <Button asChild size="sm" variant="outline" className="flex-1"><Link to="/upload"><Share2 /> Share</Link></Button>
              <Button size="sm" variant="ghost" className="text-destructive" aria-label="Delete"
                onClick={() => { setFiles((x) => x.filter((y) => y.id !== f.id)); toast.success(`${f.name} deleted`); }}>
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
