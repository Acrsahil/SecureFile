import { createFileRoute } from "@tanstack/react-router";
import { PublicFooter, PublicNav } from "@/components/public-nav";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MedShare" },
      { name: "description", content: "MedShare is a final-year college project for secure medical file sharing." },
      { property: "og:title", content: "About — MedShare" },
      { property: "og:description", content: "The story behind the MedShare secure medical file sharing prototype." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <section className="mx-auto max-w-3xl px-4 py-20">
        <h1 className="text-4xl font-bold">About MedShare</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          MedShare is a final-year college project that explores how patients and healthcare professionals can exchange
          prescriptions, lab reports, X-rays and medical records safely.
        </p>
        <p className="mt-4 text-muted-foreground">
          Every file is private by default. Owners grant access to specific people, choose whether they can only view or
          also download, and can revoke access at any time. A full activity history shows who opened what.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">This prototype uses sample data for demonstration purposes.</p>
      </section>
      <PublicFooter />
    </div>
  );
}
