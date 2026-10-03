import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, FileText, Inbox, Share2, Activity, Eye, Download, Upload, Ban } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/medshare";
import { dashboardAPI, type DashboardData, type Document } from "@/lib/api";

export const Route = createFileRoute("/_dash/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — MedShare" },
      { name: "description", content: "Overview of your medical documents and sharing activity." },
      { property: "og:title", content: "Dashboard — MedShare" },
      { property: "og:description", content: "Your MedShare overview." },
    ],
  }),
  component: Dashboard,
});

function statusLabel(doc: Document) {
  // If I own it and someone has access → Shared
  // Otherwise → Private
  return doc.is_owner ? "My Document" : "Shared";
}

function getIcon(action: string) {
  if (action === "UPLOAD") return { icon: Upload, tone: "bg-accent text-accent-foreground" };
  if (action === "SHARE") return { icon: Share2, tone: "bg-teal-soft text-teal" };
  if (action === "VIEW") return { icon: Eye, tone: "bg-success-soft text-success" };
  if (action === "DOWNLOAD") return { icon: Download, tone: "bg-success-soft text-success" };
  if (action === "ACCESS_REVOKED") return { icon: Ban, tone: "bg-destructive/10 text-destructive" };
  return { icon: Eye, tone: "bg-accent text-accent-foreground" };
}

function timeAgo(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.get()
      .then((res) => { if (res.data) setData(res.data); })
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const stats = data
    ? [
      { label: "Total Files", value: data.stats.total_documents, icon: FileText, tone: "bg-accent text-accent-foreground" },
      { label: "Shared Files", value: data.stats.shared_documents, icon: Share2, tone: "bg-teal-soft text-teal" },
      { label: "Files Received", value: data.stats.received_documents, icon: Inbox, tone: "bg-success-soft text-success" },
      { label: "Pending Requests", value: data.stats.pending_requests, icon: Clock, tone: "bg-warning-soft text-warning" },
    ]
    : [];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Welcome back, here's what's happening with your documents." />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border bg-card p-5 shadow-card animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-card">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${s.tone}`}><s.icon className="h-5 w-5" /></span>
              <p className="mt-4 text-3xl font-bold font-display">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl border bg-card shadow-card">
        <div className="flex items-center justify-between p-5">
          <h2 className="font-semibold">Recent Documents</h2>
          <Link to="/files" className="text-sm font-medium text-primary hover:underline">View all</Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.recent_documents.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="pl-5 font-medium">
                  <Link to="/documents/$id" params={{ id: String(d.id) }} className="hover:text-primary">{d.title}</Link>
                </TableCell>
                <TableCell>{d.document_type}</TableCell>
                <TableCell>{d.file_size}</TableCell>
                <TableCell>{new Date(d.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {!loading && !data?.recent_documents.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">No documents yet. Upload your first one!</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8 rounded-2xl border bg-card shadow-card">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold">Recent Activity</h2>
          <Link to="/activity" className="text-sm font-medium text-primary hover:underline">View all</Link>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map((i) => <div key={i} className="h-10 bg-muted rounded-xl" />)}
            </div>
          ) : !data?.recent_activity.length ? (
            <p className="text-center text-muted-foreground py-6">No recent activity.</p>
          ) : (
            <ul className="space-y-4">
              {data.recent_activity.slice(0, 5).map((a) => {
                const I = getIcon(a.action);
                return (
                  <li key={a.id} className="flex gap-4 items-center">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${I.tone}`}>
                      <I.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{a.description || `${a.user_name} — ${a.action}`}</p>
                      <p className="text-xs text-muted-foreground">{timeAgo(a.timestamp)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
