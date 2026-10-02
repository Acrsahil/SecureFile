import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Ban, Download, Eye, Share2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/medshare";
import { activityAPI, type ActivityLog } from "@/lib/api";

export const Route = createFileRoute("/_dash/activity")({
  head: () => ({
    meta: [
      { title: "Activity — MedShare" },
      { name: "description", content: "Timeline of uploads, shares and document access." },
      { property: "og:title", content: "Activity — MedShare" },
      { property: "og:description", content: "Your MedShare activity history." },
    ],
  }),
  component: ActivityPage,
});

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

function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityAPI.list()
      .then((res) => { if (res.data) setLogs(res.data); })
      .catch(() => toast.error("Failed to load activity"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Activity" subtitle="Every upload, share and access is logged." />
      <ol className="relative max-w-2xl space-y-4 rounded-3xl border bg-card p-6 shadow-card">
        {loading && [1, 2, 3].map((i) => (
          <li key={i} className="flex gap-4 animate-pulse">
            <span className="h-10 w-10 rounded-full bg-muted shrink-0" />
            <div className="flex-1 pb-4 space-y-2">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-2 bg-muted rounded w-1/4" />
            </div>
          </li>
        ))}
        {!loading && logs.length === 0 && (
          <li className="text-center text-muted-foreground py-6">No activity yet.</li>
        )}
        {logs.map((a, i) => {
          const I = getIcon(a.action);
          return (
            <li key={a.id} className="relative flex gap-4">
              {i < logs.length - 1 && <span className="absolute left-5 top-11 h-[calc(100%-1.5rem)] w-px bg-border" />}
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${I.tone}`}>
                <I.icon className="h-4 w-4" />
              </span>
              <div className="pb-4">
                <p className="text-sm font-medium">{a.description || `${a.user_name} — ${a.action}`}</p>
                <p className="text-xs text-muted-foreground">{timeAgo(a.timestamp)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
