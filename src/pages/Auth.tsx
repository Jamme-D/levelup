import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "@/hooks/useSession";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"signin" | "signup" | "signout">(
    (new URLSearchParams(window.location.search).get("mode") as any) ?? "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/";
  const { user } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your email to confirm, then sign in.");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate(from, { replace: true });
      } else {
        await supabase.auth.signOut();
        navigate("/auth?mode=signin", { replace: true });
      }
    } catch (err: any) {
      setMessage(err.message ?? "Auth error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold">
          {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Sign out"}
        </h1>

        {mode !== "signout" ? (
          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium">
              Email
              <input
                type="email"
                className="mt-1 w-full rounded-xl border bg-background px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                type="password"
                className="mt-1 w-full rounded-xl border bg-background px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </label>
            <div className="flex items-center gap-2">
              <button
                disabled={submitting}
                className="w-full rounded-xl bg-foreground px-3 py-2 text-background disabled:opacity-60"
                type="submit"
              >
                {mode === "signin" ? "Sign in" : "Create account"}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="w-full rounded-xl border px-3 py-2 disabled:opacity-60"
              >
                {mode === "signin" ? "Need an account?" : "Have an account?"}
              </button>
            </div>
            {message && <p className="text-sm text-red-600">{message}</p>}
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="mb-4 text-sm text-muted-foreground">
              You are {user ? `signed in as ${user.email}` : "not signed in"}.
            </p>
            <button
              disabled={submitting || !user}
              className="rounded-xl border px-3 py-2 disabled:opacity-60"
            >
              Sign out
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
