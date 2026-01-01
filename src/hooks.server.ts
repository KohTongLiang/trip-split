import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { env } from '$env/dynamic/public'

const supabaseHandle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    env.PUBLIC_SUPABASE_URL,
    env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: '/' })
          })
        },
      },
    }
  )

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT from the database, `supabase.auth.getUser()` always
   * retrieves the user object from Supabase Auth.
   *
   * This is the recommended way to get the user's data.
   */
  event.locals.getUser = async () => {
    const {
      data: { user },
    } = await event.locals.supabase.auth.getUser()
    return user
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-parse-helsinki'
    },
  })
}

export const handle = sequence(supabaseHandle)
