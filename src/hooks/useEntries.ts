import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Entry } from "@/types";

export function useEntries(userId?: string) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!userId) return;
    setLoading(true); setError(null);
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", userId)
      .order("day_number", { ascending: true });
    if (error) setError(error.message);
    else setEntries((data ?? []) as Entry[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  return { entries, loading, error, refetch: fetchEntries };
}
