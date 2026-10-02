import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "./medshare";

export function PublicNav() {
  const link = "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className={link} activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>Home</Link>
          <Link to="/features" className={link} activeProps={{ className: "text-foreground" }}>Features</Link>
          <Link to="/about" className={link} activeProps={{ className: "text-foreground" }}>About</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
          <Button asChild size="sm"><Link to="/register">Register</Link></Button>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t py-8 text-center text-sm text-muted-foreground">
      © 2026 MedShare — Final-year project prototype. Mock data only.
    </footer>
  );
}
