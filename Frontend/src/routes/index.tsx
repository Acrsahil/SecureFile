import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Lock, UserCheck, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicFooter, PublicNav } from "@/components/public-nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedShare — Secure Medical File Sharing" },
      { name: "description", content: "Share prescriptions, lab reports and X-rays securely with authorized healthcare professionals." },
      { property: "og:title", content: "MedShare — Secure Medical File Sharing" },
      { property: "og:description", content: "Share medical documents securely with authorized healthcare professionals." },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Lock, title: "Secure Sharing", text: "Every document is encrypted and shared only through explicit, revocable permissions." },
  { icon: UserCheck, title: "Authorized Access", text: "Choose exactly who can view or download — doctors, staff, or hospitals." },
  { icon: FileText, title: "Medical Document Management", text: "Keep prescriptions, lab reports, X-rays and records organised in one place." },
];

function Index() {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
              <ShieldCheck className="h-3.5 w-3.5" /> End-to-end protected
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              Secure Medical <span className="text-brand">File Sharing</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Share medical documents securely with authorized healthcare professionals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-glow"><Link to="/register">Get Started <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/login">Login</Link></Button>
            </div>
          </div>
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <div className="rounded-3xl border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between">
                <p className="font-display font-semibold">Recent documents</p>
                <Lock className="h-4 w-4 text-teal" />
              </div>
              {["MRI Report", "Blood Test Report", "Prescription"].map((d, i) => (
                <div key={d} className="mt-4 flex items-center gap-3 rounded-2xl bg-muted p-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground"><FileText className="h-5 w-5" /></span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{d}</p>
                    <p className="text-xs text-muted-foreground">Shared with Dr. Anil Sharma</p>
                  </div>
                  <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">{i === 2 ? "Private" : "Shared"}</span>
                </div>
              ))}
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-teal-soft p-3 text-sm text-teal">
                <Stethoscope className="h-4 w-4" /> Dr. Sharma accessed MRI Report
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-1">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-primary-foreground"><f.icon className="h-6 w-6" /></span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
