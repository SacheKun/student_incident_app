// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// export const supabase = createClient(supabaseUrl, supabaseKey, {
//     auth: {
//         persistSession: true, // keeps user logged in
//         autoRefreshToken: true, // refresh token automatically
//         detectSessionInUrl: true, // for magic links / OAuth
//     },
// });

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, // NEVER use secret key in frontend
);
