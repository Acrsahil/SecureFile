import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { Download, Eye, FileText, Lock, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/medshare";
import { allDocs } from "@/lib/mock-data";

export const Route = createFileRoute("/_dash/documents/$id")({
  loader: ({ params }) => {
    const doc = allDocs.find((d) => d.id === params.id);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.doc.name} — MedShare` },
          { name: "description", content: `Secure preview of ${loaderData.doc.name}.` },
          { property: "og:title", content: `${loaderData.doc.name} — MedShare` },
          { property: "og:description", content: "Authorized access document viewer." },
        ]
      : [{ title: "Not found — MedShare" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <p className="font-semibold">Document not found</p>
      <Link to="/files" className="text-sm text-primary">Back to My Files</Link>
    </div>
  ),
  component: Viewer,
});

function Viewer() {
  const { doc } = Route.useLoaderData();
  const router = useRouter();
  const canDownload = doc.access === "View & Download";
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-3xl border bg-card p-4 shadow-card">
        <div className="grid aspect-[3/4] max-h-[75vh] w-full place-items-center rounded-2xl bg-muted">
          <div className="text-center">
            <FileText className="mx-auto h-16 w-16 text-primary" />
            <p className="mt-3 font-display font-semibold">{doc.name}.{doc.type.toLowerCase()}</p>
            <p className="text-sm text-muted-foreground">Document preview</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-3xl border bg-card p-6 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-bold">{doc.name}</h1>
            <StatusBadge status={doc.status} />
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            {[["Uploaded by", doc.owner], ["Date", doc.date], ["File", `${doc.type} · ${doc.size}`], ["Access permission", doc.access]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium text-right">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-teal-soft p-4 text-teal">
            <ShieldCheck className="h-6 w-6 shrink-0" />
            <div><p className="font-semibold">Authorized Access</p><p className="text-xs">You have permission to open this file.</p></div>
          </div>
          <div className="mt-5 grid gap-2">
            <Button onClick={() => toast("Opening secure viewer…")}><Eye /> View</Button>
            <Button variant="outline" disabled={!canDownload} onClick={() => toast.success("Download started")}>
              {canDownload ? <Download /> : <Lock />} Download
            </Button>
            <Button variant="ghost" onClick={() => router.history.back()}><X /> Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
