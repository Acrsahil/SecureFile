import { createFileRoute } from "@tanstack/react-router";
import { Ban, Eye, Share2, Upload } from "lucide-react";
import { PageHeader } from "@/components/medshare";
import { activity } from "@/lib/mock-data";

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

const icons = {
  upload: { icon: Upload, tone: "bg-accent text-accent-foreground" },
  share: { icon: Share2, tone: "bg-teal-soft text-teal" },
  access: { icon: Eye, tone: "bg-success-soft text-success" },
  revoke: { icon: Ban, tone: "bg-destructive/10 text-destructive" },
};

function ActivityPage() {
  return (
    <>
      <PageHeader title="Activity" subtitle="Every upload, share and access is logged." />
      <ol className="relative max-w-2xl space-y-4 rounded-3xl border bg-card p-6 shadow-card">
        {activity.map((a, i) => {
          const I = icons[a.kind];
          return (
            <li key={i} className="relative flex gap-4">
              {i < activity.length - 1 && <span className="absolute left-5 top-11 h-[calc(100%-1.5rem)] w-px bg-border" />}
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${I.tone}`}><I.icon className="h-4 w-4" /></span>
              <div className="pb-4">
                <p className="text-sm font-medium">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
