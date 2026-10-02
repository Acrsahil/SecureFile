import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Eye, FileText, KeyRound, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/medshare";
import { sharedWithMe } from "@/lib/mock-data";

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
  return (
    <>
      <PageHeader title="Shared With Me" subtitle="Documents other users have authorized you to access." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sharedWithMe.map((d) => (
          <div key={d.id} className="rounded-2xl border bg-card p-5 shadow-card">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-soft text-teal"><FileText className="h-5 w-5" /></span>
            <h3 className="mt-4 font-semibold">{d.name}</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><UserRound className="h-4 w-4" /> Shared by: <span className="text-foreground">{d.owner}</span></li>
              <li className="flex items-center gap-2"><KeyRound className="h-4 w-4" /> Access: <span className="text-foreground">{d.access}</span></li>
              <li className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Date: <span className="text-foreground">{d.date}</span></li>
            </ul>
            <Button asChild className="mt-5 w-full"><Link to="/documents/$id" params={{ id: d.id }}><Eye /> View Document</Link></Button>
          </div>
        ))}
      </div>
    </>
  );
}
