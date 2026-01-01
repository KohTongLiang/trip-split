import { createBrowserClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '$env/static/public'

const supabaseUrl = PUBLIC_SUPABASE_URL
const supabaseAnonKey = PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

// This client is for use in the browser only
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Factory for server-side or request-specific instances
export const createSupabaseClient = (customFetch?: typeof globalThis.fetch) => {
    // If we're on the server and have a customFetch (from SvelteKit load), 
    // we should ideally use the one from locals, but for actions/load 
    // where we don't have locals, this is a fallback.
    // Note: with @supabase/ssr, we prefer createServerClient in hooks.
    return createBrowserClient(supabaseUrl, supabaseAnonKey, {
        global: {
            fetch: customFetch
        }
    })
}
