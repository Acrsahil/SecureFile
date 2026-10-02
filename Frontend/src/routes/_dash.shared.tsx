import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Eye, FileText, KeyRound, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/medshare";
import { sharingAPI, type SharedDoc } from "@/lib/api";

export const Route = createFileRoute("/_dash/shared")({
  head: () => ({
    meta: [
      { title: "Shared With Me — MedShare" },
      { name: "description", content: "Medical documents others have shared with you." },
      { property: "og:title", content: "Shared With Me — MedShare" },
      { property: "og:description", content: "Documents shared with you on MedShare." },
    ],
  }),
  component: Shared,
});

function Shared() {
  const [docs, setDocs] = useState<SharedDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sharingAPI.sharedWithMe()
      .then((res) => { if (res.data) setDocs(res.data); })
      .catch(() => toast.error("Failed to load shared documents"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Shared With Me" subtitle="Documents other users have authorized you to access." />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="rounded-2xl border bg-card p-5 shadow-card animate-pulse h-52" />)}
        </div>
      ) : docs.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center shadow-card">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-semibold">No shared documents</p>
          <p className="text-sm text-muted-foreground mt-1">Documents shared with you will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {docs.map((d) => (
            <div key={d.id} className="rounded-2xl border bg-card p-5 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-soft text-teal">
                <FileText className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{d.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" /> Shared by: <span className="text-foreground">{d.shared_by}</span>
                </li>
                <li className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" /> Access: <span className="text-foreground">{d.permission === "DOWNLOAD" ? "View & Download" : "View Only"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Date: <span className="text-foreground">{new Date(d.created_at).toLocaleDateString()}</span>
                </li>
              </ul>
              <Button asChild className="mt-5 w-full">
                <Link to="/documents/$id" params={{ id: String(d.document_id) }}><Eye /> View Document</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
