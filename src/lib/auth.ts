import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "./supabase/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a Supabase client for server-side operations
export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Get the current user session from Supabase
export async function auth() {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0],
      role: user.user_metadata?.role || "STUDENT",
    },
  };
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Sign out
export async function signOut() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
}
