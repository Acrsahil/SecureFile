import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Activity, FolderLock, LayoutDashboard, LogOut, Menu, Share2, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/medshare";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { authAPI, clearTokens, getStoredUser, type User as UserType } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_dash")({ component: DashLayout });

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/files", label: "My Files", icon: FolderLock },
  { to: "/shared", label: "Shared With Me", icon: Share2 },
  { to: "/upload", label: "Upload File", icon: Upload },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/profile", label: "Profile", icon: User },
];

function DashLayout() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(getStoredUser());
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Even if API call fails, clear tokens locally
    }
    clearTokens();
    setUser(null);
    toast.success("Logged out successfully");
    navigate({ to: "/login" });
  };

  const roleLabel = (r: string) => {
    switch (r) {
      case "ADMIN": return "Admin";
      case "DOCTOR": return "Doctor";
      case "NURSE": return "Nurse";
      default: return "Patient";
    }
  };

  // Determine nav items dynamically based on role
  const dynamicNav = [...nav];
  if (user && ["ADMIN", "DOCTOR", "NURSE"].includes(user.role)) {
    // Insert after "Shared With Me"
    dynamicNav.splice(3, 0, { to: "/patients", label: "My Patients", icon: User });
  }

  const item = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent";

  if (!user) return null; // Render nothing while redirecting

  return (
    <div className="flex min-h-screen bg-muted">
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar p-4 transition-transform md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <Logo className="mb-8 px-2" />
        <nav className="flex flex-1 flex-col gap-1">
          {dynamicNav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={item} activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className={cn(item, "text-destructive hover:bg-destructive/10 w-full text-left")}>
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-foreground/20 md:hidden" onClick={() => setOpen(false)} />}
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-8">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-auto flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full text-left">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{roleLabel(user.role)}</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-primary-foreground">
                  {user.initials}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.full_name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer w-full flex items-center font-medium">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 animate-in fade-in duration-300 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
