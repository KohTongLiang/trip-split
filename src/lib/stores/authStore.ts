import { writable } from "svelte/store";
import { auth } from "../firebase";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, type User } from "firebase/auth";

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
    onAuthStateChanged(auth, async (user) => {
        authStore.setUser(user);
        if (user) {
            // Get ID token and set it as a cookie for server-side auth
            const token = await user.getIdToken();
            // Use Lax and remove Secure for localhost dev if needed, typically Secure works on localhost but let's be safe
            document.cookie = `token=${token}; path=/; max-age=3600; samesite=lax`;
        } else {
            // Clear cookie
            document.cookie = `token=; path=/; max-age=0; samesite=lax`;
        }
    });
}

export const loginWithGoogle = async () => {
    authStore.loading();
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    } catch (error: any) {
        authStore.setError(error.message);
    }
};

export const logout = async () => {
    authStore.loading();
    try {
        await signOut(auth);
    } catch (error: any) {
        authStore.setError(error.message);
    }
};
