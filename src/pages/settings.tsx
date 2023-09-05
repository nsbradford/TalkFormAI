import { User } from '@/types';
import { getUserFromSupabase } from '@/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Database } from '../../types/supabase';
import SpinnerFullPage from '@/components/home/Spinner';
import Page from '@/components/layout/Page';

export default function SettingsMode() {
  // TODO later refactor all the user hydration code
  const { push } = useRouter();
  const { isLoading: isSessionLoading, session, error } = useSessionContext();
  const supabase = createClientComponentClient<Database>();
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    if (!isSessionLoading && !session) {
      push('/auth');
    }
    if (!isSessionLoading && session) {
      getUserFromSupabase(session, supabase, setUser);
    }
  }, [isSessionLoading, session]);

  return (
    <Page pageTitle="Settings" user={null}>
      {user ? (
        <>
          <h1>Email: {user.email}</h1>
          <h1>User ID: {user.id}</h1>
        </>
      ) : (
        <SpinnerFullPage />
      )}
    </Page>
  );
}
