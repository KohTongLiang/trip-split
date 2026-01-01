import { SupabaseClient, User } from '@supabase/supabase-js'

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            supabase: SupabaseClient
            getUser(): Promise<User | null>
        }
        interface PageData {
            session: { data: { session: any } } | any
            user: User | null
        }
        // interface PageState {}
        // interface Platform {}
    }
}

export { };
