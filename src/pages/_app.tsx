import type { AppProps } from 'next/app';
import { MantineProvider, ButtonStylesParams } from '@mantine/core';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <MantineProvider 
        theme={{
          components: {
            // Per-component styles go here
          },
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </SessionContextProvider>
  );
}
