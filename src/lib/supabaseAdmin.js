import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ADMIN_KEY, // NEVER use in frontend!
);
