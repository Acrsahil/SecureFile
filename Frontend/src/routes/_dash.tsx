import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, FolderLock, LayoutDashboard, LogOut, Menu, Share2, Upload, User } from "lucide-react";
import { Logo } from "@/components/medshare";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_dash")({ component: DashLayout });

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/files", label: "My Files", icon: FolderLock },
  { to: "/shared", label: "Shared With Me", icon: Share2 },
  { to: "/upload", label: "Upload File", icon: Upload },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/profile", label: "Profile", icon: User },
] as const;

function DashLayout() {
  const [open, setOpen] = useState(false);
  const item = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent";
  return (
    <div className="flex min-h-screen bg-muted">
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar p-4 transition-transform md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <Logo className="mb-8 px-2" />
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={item} activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/login" className={cn(item, "text-destructive hover:bg-destructive/10")}><LogOut className="h-4 w-4" /> Logout</Link>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-foreground/20 md:hidden" onClick={() => setOpen(false)} />}
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-8">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.role}</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-primary-foreground">SA</span>
          </div>
        </header>
        <main className="flex-1 p-4 animate-in fade-in duration-300 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
