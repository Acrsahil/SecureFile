import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, FileText, Inbox, Share2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, StatusBadge } from "@/components/medshare";
import { myFiles, sharedWithMe } from "@/lib/mock-data";

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

function Dashboard() {
  const stats = [
    { label: "Total Files", value: myFiles.length, icon: FileText, tone: "bg-accent text-accent-foreground" },
    { label: "Shared Files", value: myFiles.filter((f) => f.status === "Shared").length, icon: Share2, tone: "bg-teal-soft text-teal" },
    { label: "Files Received", value: sharedWithMe.length, icon: Inbox, tone: "bg-success-soft text-success" },
    { label: "Pending Requests", value: myFiles.filter((f) => f.status === "Pending").length, icon: Clock, tone: "bg-warning-soft text-warning" },
  ];
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Welcome back, here's what's happening with your documents." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-card">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${s.tone}`}><s.icon className="h-5 w-5" /></span>
            <p className="mt-4 text-3xl font-bold font-display">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border bg-card shadow-card">
        <div className="flex items-center justify-between p-5">
          <h2 className="font-semibold">Recent Documents</h2>
          <Link to="/files" className="text-sm font-medium text-primary hover:underline">View all</Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow><TableHead className="pl-5">Document</TableHead><TableHead>Type</TableHead><TableHead>Shared With</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {myFiles.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="pl-5 font-medium">
                  <Link to="/documents/$id" params={{ id: d.id }} className="hover:text-primary">{d.name}</Link>
                </TableCell>
                <TableCell>{d.type}</TableCell>
                <TableCell>{d.sharedWith}</TableCell>
                <TableCell>{d.date}</TableCell>
                <TableCell><StatusBadge status={d.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
