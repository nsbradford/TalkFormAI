import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'


export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  return <SessionContextProvider
    supabaseClient={supabaseClient}
    initialSession={pageProps.initialSession}
  >
    <Component {...pageProps} />
  </SessionContextProvider>
}
