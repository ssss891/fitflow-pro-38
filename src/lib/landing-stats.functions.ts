import { createServerFn } from "@tanstack/react-start";

// Vraća samo ukupne brojeve (bez ličnih podataka) za početnu stranu
export const getLandingStats = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const count = async (table: "profiles" | "workouts") => {
    const { count } = await supabaseAdmin.from(table).select("id", { count: "exact", head: true });
    return count ?? 0;
  };

  const [users, workouts, durations] = await Promise.all([
    count("profiles"),
    count("workouts"),
    // Trajanja svih treninga — iz njih se računa prosek unosa u minutima
    supabaseAdmin.from("workouts").select("duration_minutes"),
  ]);

  const minutes = (durations.data ?? [])
    .map((row) => row.duration_minutes)
    .filter((v): v is number => Number.isFinite(v) && v > 0);

  const avgMinutes = minutes.length
    ? Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length)
    : 0;

  return { users, workouts, avgMinutes };
});
