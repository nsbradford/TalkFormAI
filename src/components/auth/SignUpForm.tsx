'use client';
import { Database } from '../../../types/supabase';
import React, { useState } from 'react';
import { AuthError } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Error from '../shared/Error';
import { useRouter } from 'next/router';

export default function SignUpForm() {
  const supabase = createClientComponentClient<Database>();
  const [error, setError] = useState<AuthError | null>(null);
  const [isMainButtonDisabled, setIsMainButtonDisabled] =
    useState<boolean>(false);
  const { push } = useRouter();

  const signUp = async (email: string, password: string) => {
    setIsMainButtonDisabled(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setIsMainButtonDisabled(false);
    if (error) {
      setError(error);
    } else {
      supabase.auth.signInWithPassword({ email, password });
      push('/home');
    }
  };

  async function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    await signUp(email, password);
  }

  return (
    <>
      {error && <Error error={error} session={null} />}
      <form
        className="space-y-6"
        action="#"
        method="POST"
        onSubmit={() => onFormSubmit}
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <button
            disabled={isMainButtonDisabled}
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign up
          </button>
        </div>
      </form>
    </>
  );
}
