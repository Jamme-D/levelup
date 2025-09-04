import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold leading-tight">Get out of survivor mode—one day at a time.</h1>
        <p className="text-lg text-muted-foreground">
          365 Days to Level Up gives you a short daily prompt and a place to reflect. Build momentum with tiny,
          consistent actions. Your data stays private to your account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-4">
          <h2 className="font-semibold">Daily Prompt</h2>
          <p className="text-sm text-muted-foreground">A focused question to nudge clarity and action.</p>
        </div>
        <div className="rounded-2xl border p-4">
          <h2 className="font-semibold">Journal</h2>
          <p className="text-sm text-muted-foreground">Write a quick reflection. Track progress over time.</p>
        </div>
        <div className="rounded-2xl border p-4">
          <h2 className="font-semibold">Streaks</h2>
          <p className="text-sm text-muted-foreground">Keep a gentle streak to reinforce habit-building.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link to="/auth?mode=signup" className="rounded-xl bg-foreground px-5 py-2.5 text-background">
          Start free
        </Link>
        <Link to="/auth" className="rounded-xl border px-5 py-2.5">Sign in</Link>
        <Link to="/app" className="text-sm text-muted-foreground underline underline-offset-4">
          Or jump to today’s prompt →
        </Link>
      </div>

      <div className="rounded-2xl border p-4">
        <h3 className="mb-2 font-semibold">How it works</h3>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Sign up and get Day 1’s prompt.</li>
          <li>Write a quick reflection (2–5 minutes).</li>
          <li>Come back tomorrow. Tiny steps add up.</li>
        </ol>
      </div>
    </section>
  );
};

export default Home;
