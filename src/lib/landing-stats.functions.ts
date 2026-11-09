import { createServerFn } from "@tanstack/react-start";

// Vraća samo ukupne brojeve (bez ličnih podataka) za početnu stranu
export const getLandingStats = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const count = async (table: "profiles" | "workouts" | "workout_sets") => {
    const { count } = await supabaseAdmin.from(table).select("id", { count: "exact", head: true });
    return count ?? 0;
  };
  // Broje se samo postojeći nalozi (neki stari profili su ostali bez naloga)
  const countUsers = async () => {
    const { data } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    return data?.users.length ?? 0;
  };
  const [users, workouts, sets] = await Promise.all([
    countUsers(),
    count("workouts"),
    count("workout_sets"),
  ]);
  return { users, workouts, sets };
});
