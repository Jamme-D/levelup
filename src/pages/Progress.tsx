import React from "react";
import { Link } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { useEntries } from "@/hooks/useEntries";

const Progress: React.FC = () => {
  const { user } = useSession();
  const { entries, loading, error } = useEntries(user?.id);

  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Your Progress</h1>
      {entries.length === 0 ? (
        <p className="text-muted-foreground">No entries yet. Start with today’s prompt.</p>
      ) : (
        <ul className="divide-y rounded-2xl border">
          {entries.map((e) => (
            <li key={e.id} className="flex items-center justify-between p-3">
              <div className="min-w-0">
                <p className="font-medium">Day {e.day_number}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {new Date(e.created_at).toLocaleDateString()}
                </p>
              </div>
              <Link to={`/journal/${e.day_number}`} className="rounded-lg border px-3 py-1 hover:bg-muted/50">
                Read
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Progress;
