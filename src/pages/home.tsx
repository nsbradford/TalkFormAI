import AppShell from '@/components/home/AppShell';
import ErrorMode from '@/components/home/ErrorMode';
import Spinner from '@/components/home/Spinner';
import { User } from '@/types';
import { getUserFromSupabase } from '@/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Database } from '../../types/supabase';

export default function AuthPage() {
  const { isLoading, session, error } = useSessionContext();
  const supabase = createClientComponentClient<Database>();
  const [user, setUser] = useState<null | User>(null);
  const { push } = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      push('/auth');
    }
    if (!isLoading && session) {
      getUserFromSupabase(session, supabase, setUser);
    }
  }, [isLoading, session]);

  if (isLoading) {
    return <Spinner />;
  } else if (user) {
    return <AppShell user={user} />;
  } else {
    return <ErrorMode session={session} error={error} />;
  }
}
