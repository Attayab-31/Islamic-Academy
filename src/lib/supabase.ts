import { createClient } from "@supabase/supabase-js";

export function getSupabaseUrl() {
    return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim();
}

export function getSupabaseAnonKey() {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || process.env.SUPABASE_ANON_KEY?.trim();
}

export function getSupabaseServiceRoleKey() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
}

export function createSupabaseClient() {
    const supabaseUrl = getSupabaseUrl();
    const supabaseAnonKey = getSupabaseAnonKey();

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
}

export function createSupabaseAdminClient() {
    const supabaseUrl = getSupabaseUrl();
    const serviceRoleKey = getSupabaseServiceRoleKey();

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Supabase admin env vars are not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
}
