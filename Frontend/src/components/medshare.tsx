import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
type Status = "Shared" | "Private" | "Pending" | "Revoked";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 font-display text-lg font-bold", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-glow">
        <ShieldCheck className="h-5 w-5" />
      </span>
      Secure Medi<span className="text-brand">Share</span>
    </Link>
  );
}

const statusStyles: Record<Status, string> = {
  Shared: "bg-success-soft text-success",
  Private: "bg-secondary text-secondary-foreground",
  Pending: "bg-warning-soft text-warning",
  Revoked: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", statusStyles[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function SecureNote({ children = "Only authorized users can access this document." }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-teal-soft px-4 py-3 text-sm font-medium text-teal">
      <ShieldCheck className="h-4 w-4 shrink-0" />
      {children}
    </div>
  );
}
