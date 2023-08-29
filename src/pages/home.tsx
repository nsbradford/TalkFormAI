import React from 'react'
import { useEffect } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router';
import HomeContainer from '@/components/home/HomeContainer';
import Spinner from '@/components/home/Spinner';
import ErrorMode from '@/components/home/ErrorMode';


export default function AuthPage() {
  const { isLoading, session, error } = useSessionContext();
  const { push } = useRouter();

  
  useEffect(() => {
    if (!isLoading && !session) {
      push('/auth');
    }
  }, [isLoading, session]);
 
  if (isLoading) {
    return (<Spinner/>);
  } else if (session) {
    return (<HomeContainer
      session={session}
    />)
  } else {
    return (<ErrorMode
      session={session}
      error={error}
    />)
  }
  
}
