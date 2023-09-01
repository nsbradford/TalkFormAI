'use client';
import React, { useEffect, useState } from 'react';
import SignUpForm from '../components/auth/SignUpForm';
import SignInForm from '@/components/auth/SignInForm';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { TalkFormLogo } from '@/components/talkform';
import { NavBar } from '@/components/home/NavBar';

export default function AuthPage() {
  const [mode, setMode] = useState<'sign_in' | 'sign_up'>('sign_up');
  const { isLoading, session } = useSessionContext();
  const { push } = useRouter();

  useEffect(() => {
    console.log('Checking if session is loading and if there is a session');
    if (!isLoading && session) {
      push('/home');
    } else {
      console.log('Session is not loading and there is no session');
    }
  }, [isLoading, session]);

  function switchMode() {
    if (mode === 'sign_in') {
      setMode('sign_up');
    } else {
      setMode('sign_in');
    }
  }

  return (
    <>
      <NavBar getAvatar={() => <></>} userNavigation={[]} props={{}} />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {mode == 'sign_in'
              ? 'Sign in to your account'
              : 'Create an account'}
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {mode === 'sign_in' ? <SignInForm /> : <SignUpForm />}
          <p className="mt-10 text-center text-sm text-gray-500">
            {mode == 'sign_in'
              ? "Don't have an account?"
              : 'Already have an account?'}{' '}
            <a
              onClick={switchMode}
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              {mode === 'sign_in' ? 'Sign up' : 'Sign in'}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
