import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "@/hooks/useSession";
import type { Entry, Prompt } from "@/types";

const JournalEditor: React.FC = () => {
  const { user } = useSession();
  const navigate = useNavigate();
  const { day } = useParams<{ day: string }>();
  const dayNumber = Math.max(1, Math.min(365, Number(day ?? 1)));

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: p } = await supabase
        .from("prompts").select("*").eq("day_number", dayNumber).single();
      if (!cancelled && p) setPrompt(p as Prompt);

      if (!user) return;
      const { data: e } = await supabase
        .from("entries").select("*")
        .eq("user_id", user.id)
        .eq("day_number", dayNumber)
        .maybeSingle();

      if (!cancelled && e) {
        setEntry(e as Entry);
        setContent((e as Entry).content);
      }
    })();
    return () => { cancelled = true; };
  }, [user, dayNumber]);

  async function save() {
    if (!user) return;
    setSaving(true); setMsg(null);
    const payload = { user_id: user.id, day_number: dayNumber, content };
    const { data, error } = await supabase
      .from("entries").upsert(payload, { onConflict: "user_id,day_number" })
      .select().single();

    setSaving(false);
    if (error) setMsg(error.message);
    else {
      setEntry(data as Entry);
      setMsg("Saved ✓");
      // navigate("/progress")
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Day {dayNumber}</h1>
          {prompt?.title ? <p className="text-muted-foreground">{prompt.title}</p> : null}
        </div>
        <button onClick={() => navigate(-1)} className="rounded-xl border px-3 py-2">Back</button>
      </div>

      <article className="card p-4">
        <p className="text-muted-foreground">{prompt?.body ?? "…"}</p>
      </article>

      <label className="block text-sm font-medium">
        Your reflection
        <textarea
          className="mt-1 w-full rounded-2xl border bg-background p-3"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write freely…"
        />
      </label>

      <div className="flex items-center gap-2">
        <button
          onClick={save}
          disabled={saving || !content.trim()}
          className="rounded-xl bg-foreground px-4 py-2 text-background disabled:opacity-60"
        >
          {saving ? "Saving…" : entry ? "Update" : "Save"}
        </button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>
    </section>
  );
};

export default JournalEditor;
