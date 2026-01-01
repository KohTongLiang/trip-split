import { writable } from "svelte/store";
import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const createAuthStore = () => {
    const { subscribe, set, update } = writable<AuthState>({
        user: null,
        loading: true,
        error: null,
    });

    return {
        subscribe,
        loading: () => update((s) => ({ ...s, loading: true })),
        loaded: () => update((s) => ({ ...s, loading: false })),
        setUser: (user: User | null) => update((s) => ({ ...s, user, loading: false })),
        setError: (error: string) => update((s) => ({ ...s, error, loading: false })),
    };
};

export const authStore = createAuthStore();

// Initialize listener
if (typeof window !== "undefined") {
    supabase.auth.onAuthStateChange(async (event, session) => {
        const user = session?.user ?? null;
        authStore.setUser(user);
    });
}

export const login = async (email: string, password: string) => {
    authStore.loading();
    try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    } catch (error: any) {
        authStore.setError(error.message);
    }
};

export const signUp = async (email: string, password: string) => {
    authStore.loading();
    try {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
    } catch (error: any) {
        authStore.setError(error.message);
    }
};

export const logout = async () => {
    authStore.loading();
    try {
        await supabase.auth.signOut();
    } catch (error: any) {
        authStore.setError(error.message);
    }
};
