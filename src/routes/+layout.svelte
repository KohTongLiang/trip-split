<script lang="ts">
  import { onMount } from 'svelte'
  import { invalidate } from '$app/navigation'
  import { supabase } from '$lib/supabase'
  import { authStore } from '$lib/stores/authStore'

  export let data;

  $: ({ session, user } = data)

  onMount(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
      authStore.setUser(_session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  })
</script>

<slot />
