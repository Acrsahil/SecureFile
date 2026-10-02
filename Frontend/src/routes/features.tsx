import { createFileRoute } from "@tanstack/react-router";
import { Activity, Eye, FileText, Lock, Share2, UserCheck } from "lucide-react";
import { PublicFooter, PublicNav } from "@/components/public-nav";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — MedShare" },
      { name: "description", content: "Secure uploads, permission-based sharing, access control and activity history for medical documents." },
      { property: "og:title", content: "Features — MedShare" },
      { property: "og:description", content: "Everything MedShare offers for secure medical document sharing." },
    ],
  }),
  component: Features,
});

const list = [
  { icon: Lock, title: "Encrypted storage", text: "Documents are stored securely and never public." },
  { icon: Share2, title: "Permission-based sharing", text: "Share with specific users only." },
  { icon: Eye, title: "View or download", text: "Choose View Only or View & Download access." },
  { icon: UserCheck, title: "Role-based accounts", text: "Patients, doctors and hospital staff." },
  { icon: FileText, title: "Document viewer", text: "Preview reports right inside the app." },
  { icon: Activity, title: "Activity history", text: "See who accessed what, and when." },
];

function Features() {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h1 className="text-4xl font-bold">Features</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">Built around one idea: only authorized users can access shared medical documents.</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-card">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
