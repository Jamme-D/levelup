import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { useTodayPrompt } from "@/hooks/useTodayPrompt";

const Today: React.FC = () => {
  const { user } = useSession();
  const { prompt, dayNumber, loading, error } = useTodayPrompt(user?.id);
  const navigate = useNavigate();

  if (loading) return <div className="text-sm text-muted-foreground">Loading prompt…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!prompt) return <div className="text-sm text-muted-foreground">No prompt found.</div>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Today’s Prompt</h1>
      <article className="card p-4">
        {prompt.title ? <h2 className="mb-1 text-lg font-medium">{prompt.title}</h2> : null}
        <p className="text-muted-foreground">{prompt.body}</p>
      </article>
      <button
        onClick={() => navigate(`/journal/${dayNumber}`)}
        className="rounded-xl bg-foreground px-4 py-2 text-background"
      >
        Write Reflection
      </button>
    </section>
  );
};

export default Today;
