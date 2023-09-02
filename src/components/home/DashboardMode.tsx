import Spinner from '@/components/home/Spinner';
import { Form, User, Response } from '@/types';
import { getFormsFromSupabase, getResponsesFromSupabase, getUserFromSupabase } from '@/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Database } from '../../../types/supabase';
import Link from 'next/link';
import { LinkIcon } from '@heroicons/react/24/outline';



export default function DashboardMode() {
  const { push } = useRouter();
  const { isLoading: isSessionLoading, session, error } = useSessionContext();
  const supabase = createClientComponentClient<Database>();
  const [user, setUser] = useState<null | User>(null);
  const [allForms, setAllForms] = useState<Form[] | null>(null);
  const [formIdToResponses, setFormIdToResponses] = useState<Record<
    string,
    Response[]
  > | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isSessionLoading && !session) {
      push('/auth');
    }
    if (!isSessionLoading && session) {
      getUserFromSupabase(session, supabase, setUser);
    }
  }, [isLoading, session]);

  useEffect(() => {
    const getFormsAndResponses = async () => {
      if (user === null) {
        return;
      }
      const forms = await getFormsFromSupabase(user.id, supabase);
      if (forms === undefined) {
        setIsLoading(false);
        return;
      } else if (forms.length === 0) {
        setAllForms(forms);
        setFormIdToResponses({} as Record<string, Response[]>);
        setIsLoading(false);
        return;
      }
      setAllForms(forms);
      const allResposes = {} as Record<string, Response[]>;
      for (const form of forms) {
        const formResponses = await getResponsesFromSupabase(form.id, supabase);
        if (formResponses === undefined) {
          continue;
        }
        allResposes[form.id] = formResponses as Response[];
      }
      setFormIdToResponses(allResposes);
      setIsLoading(false);
    };
    if (user !== null && allForms === null && formIdToResponses === null) {
      getFormsAndResponses();
    }
  }, [isSessionLoading, user, allForms, formIdToResponses]);



  if (user === null || allForms === null || formIdToResponses === null) {
    return <Spinner />;
  } else if (allForms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-semibold text-gray-900">
          You have no forms
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Create a form to get started
        </p>
        
        <Link href={"/forms/new"}>
          <button
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            New form
          </button>
        </Link>
        
      </div>
    );
  } else {
    return (
      <>
        <Link href={"/forms/new"}>
          <button
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            New form
          </button>
        </Link>
        <ul role="list" className="divide-y divide-gray-100">
          {allForms.map((f) => {
            const responsesForThisForm = formIdToResponses[f.id] || [];
            const badgeColor = f.is_open
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800';
            const camelCaseTitle =
              f.name.charAt(0).toUpperCase() + f.name.slice(1, f.name.length);
            return (
              <li key={f.id} className="flex justify-between gap-x-6 py-5">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <div className="flex gap-x-6 ">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {camelCaseTitle}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${badgeColor} ring-1 ring-inset ring-gray-500/10`}
                      >
                        {f.is_open ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {f.description
                        ? f.description.slice(0, 128) + '...'
                        : f.raw_instructions.slice(0, 128) + '...'}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <div className="flex gap-x-2 ">
                    <Link href={"/forms/" + f.id}>
                      <button
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        View responses
                      </button>
                    </Link>
                    {f.is_open ? (
                      <Link href={"/forms/fill/" + f.id}>
                        <button
                          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          <LinkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </Link>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {responsesForThisForm.length === 0
                      ? 'No responses yet'
                      : responsesForThisForm.length + ' responses'}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
}
