<script lang="ts">
    import { login, signUp, authStore } from "../stores/authStore";

    let email = "";
    let password = "";
    let isSignUp = false;

    async function handleSubmit() {
        if (isSignUp) {
            await signUp(email, password);
        } else {
            await login(email, password);
        }
    }
</script>

<div class="bg-white p-6 rounded-xl shadow-md border border-slate-200">
    <h2 class="text-xl font-bold mb-4">{isSignUp ? 'Create Account' : 'Login'}</h2>
    
    {#if $authStore.error}
        <div class="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {$authStore.error}
        </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
                type="email"
                id="email"
                bind:value={email}
                required
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
            />
        </div>
        <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
                type="password"
                id="password"
                bind:value={password}
                required
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
            />
        </div>
        <button
            type="submit"
            disabled={$authStore.loading}
            class="w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700 transition disabled:opacity-50"
        >
            {#if $authStore.loading}
                Processing...
            {:else}
                {isSignUp ? 'Sign Up' : 'Login'}
            {/if}
        </button>
    </form>

    <div class="mt-4 text-center">
        <button
            class="text-sm text-sky-600 hover:underline"
            on:click={() => isSignUp = !isSignUp}
        >
            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </button>
    </div>
</div>
