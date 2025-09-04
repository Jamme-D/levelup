import React from "react";
import { Link, Outlet } from "react-router-dom";

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold">365 Days</Link>
          <div className="flex items-center gap-2 text-sm">
            <Link to="/auth" className="px-3 py-1 rounded-lg border hover:bg-muted/40">Sign in</Link>
            <Link to="/auth?mode=signup" className="px-3 py-1 rounded-lg bg-foreground text-background">
              Get started
            </Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-10">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} 365 Days to Level Up
      </footer>
    </div>
  );
};

export default PublicLayout;
