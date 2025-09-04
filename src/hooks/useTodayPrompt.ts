import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Profile, Prompt } from "@/types";

function diffDaysInclusive(startISO: string, now = new Date()): number {
  const s = new Date(startISO + "T00:00:00");
  const a = Date.UTC(s.getFullYear(), s.getMonth(), s.getDate());
  const b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const d = Math.floor((b - a) / (1000 * 60 * 60 * 24));
  return Math.max(0, d) + 1; // Day 1 = start_date
}

export function useTodayPrompt(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [dayNumber, setDayNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const computedDay = useMemo(() => {
    if (!profile) return 1;
    return Math.min(365, Math.max(1, diffDaysInclusive(profile.start_date)));
  }, [profile]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      setLoading(true); setError(null);

      const { data: prof, error: pErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (pErr) {
        const todayISO = new Date().toISOString().slice(0, 10);
        const fallback: Profile = {
          id: userId, email: "", display_name: null,
          start_date: todayISO, created_at: todayISO, updated_at: todayISO
        };
        if (!cancelled) setProfile(fallback);
      } else if (!cancelled) {
        setProfile(prof as Profile);
      }

      const dn = pErr ? 1 : Math.min(365, Math.max(1, diffDaysInclusive((prof as Profile).start_date)));
      if (!cancelled) setDayNumber(dn);

      const { data: pr, error: prErr } = await supabase
        .from("prompts")
        .select("*")
        .eq("day_number", dn)
        .single();

      if (prErr) { if (!cancelled) setError(prErr.message); }
      else if (!cancelled) setPrompt(pr as Prompt);

      if (!cancelled) setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [userId]);

  return { profile, prompt, dayNumber, loading, error };
}
