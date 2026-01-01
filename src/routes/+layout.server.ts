import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { supabase, getUser } }) => {
  return {
    session: await supabase.auth.getSession(),
    user: await getUser(),
  }
}
