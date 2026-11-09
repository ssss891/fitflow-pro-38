import { createServerFn } from "@tanstack/react-start";

// Vraća samo ukupne brojeve (bez ličnih podataka) za početnu stranu
export const getLandingStats = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const count = async (table: "profiles" | "workouts" | "workout_sets") => {
    const { count } = await supabaseAdmin.from(table).select("id", { count: "exact", head: true });
    return count ?? 0;
  };
  const [users, workouts, sets] = await Promise.all([
    count("profiles"),
    count("workouts"),
    count("workout_sets"),
  ]);
  return { users, workouts, sets };
});
