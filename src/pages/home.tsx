import React, { useState } from 'react'
import { useEffect } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router';
import HomeContainer from '@/components/home/HomeContainer';
import Spinner from '@/components/home/Spinner';
import ErrorMode from '@/components/home/ErrorMode';
import { Database } from '../../types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type User =  Database['public']['Tables']['users']['Row'] 

export default function AuthPage() {
  const { isLoading, session, error } = useSessionContext();
  const supabase = createClientComponentClient<Database>()
  const [user, setUser] = useState<null | User>(null);
  const { push } = useRouter();

  
  useEffect(() => {
    const getUserFromSupabase = async () => {
      if (!session) {
        return;
      }
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', session?.user.id)
        .maybeSingle();
      if (error) {
        console.error(error);
        return;
      } else if (data === null) {
        console.error('No user found');
        return;
      } else {
        setUser(data);
      }
    }
    if (!isLoading && !session) {
      push('/auth');
    }
    if (!isLoading && session) {
      getUserFromSupabase();
    }
  }, [isLoading, session]);
 
  if (isLoading) {
    return (<Spinner/>);
  } else if (user) {
    return (<HomeContainer
      user={user}
    />)
  } else {
    return (<ErrorMode
      session={session}
      error={error}
    />)
  }
  
}
