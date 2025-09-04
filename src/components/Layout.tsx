import React, { useMemo } from "react";
import { Link, Outlet } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { useEntries } from "@/hooks/useEntries";
import { useTodayPrompt } from "@/hooks/useTodayPrompt";

function computeCurrentStreak(todayDay: number, completedDays: number[]): number {
  const set = new Set(completedDays);
  let s = 0;
  for (let d = todayDay; d >= 1; d--) {
    if (set.has(d)) s++;
    else break;
  }
  return s;
}

const Layout: React.FC = () => {
  const { user } = useSession();
  const { prompt, dayNumber } = useTodayPrompt(user?.id);
  const { entries } = useEntries(user?.id);
  const streak = useMemo(() => computeCurrentStreak(dayNumber, entries.map(e => e.day_number)), [dayNumber, entries]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold">365 Days</Link>
          <div className="flex items-center gap-2 text-sm">
            <div className="rounded-xl border px-3 py-1">
              Day <span className="font-semibold">{dayNumber}</span>
              {prompt?.title ? <span className="ml-2 text-muted-foreground">· {prompt.title}</span> : null}
            </div>
            <div className="rounded-xl border px-3 py-1">🔥 Streak: <span className="font-semibold">{streak}</span></div>
            <div className="ml-2 flex items-center gap-1">
              <Link to="/app" className="px-3 py-1 rounded-lg hover:bg-muted/50">Today</Link>
              <Link to="/app/progress" className="px-3 py-1 rounded-lg hover:bg-muted/50">Progress</Link>
              {user ? (
                <Link to="/auth?mode=signout" className="px-3 py-1 rounded-lg border hover:bg-muted/40">Sign out</Link>
                ) : (
                 <Link to="/auth" className="px-3 py-1 rounded-lg border hover:bg-muted/40">Sign in</Link>
                )}
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
