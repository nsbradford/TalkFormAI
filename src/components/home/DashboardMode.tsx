import Spinner from '@/components/home/Spinner';
import { Form, Response, User } from '@/types';
import { getFormsFromSupabase, getResponsesFromSupabase } from '@/utils';
import { LinkIcon } from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Database } from '../../../types/supabase';

export default function DashboardMode(props: { user: User | null }) {
  const { user } = props;
  const { isLoading: isSessionLoading, session, error } = useSessionContext();
  const supabase = createClientComponentClient<Database>();
  const [allForms, setAllForms] = useState<Form[] | null>(null);
  const [formIdToResponses, setFormIdToResponses] = useState<Record<
    string,
    Response[]
  > | null>(null);

  useEffect(() => {
    const getFormsAndResponses = async () => {
      if (user === null) {
        return;
      }
      const forms = await getFormsFromSupabase(user.id, supabase);
      if (forms === undefined) {
        return;
      } else if (forms.length === 0) {
        setAllForms(forms);
        setFormIdToResponses({} as Record<string, Response[]>);
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

        <Link href={'/forms/new'}>
          <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            New form
          </button>
        </Link>
      </div>
    );
  } else {
    return (
      <div className="px-4">
        <Link href={'/forms/new'}>
          <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
            New form
          </button>
        </Link>
        <ul role="list" className="divide-y divide-gray-200 space-y-4">
          {allForms.map((f) => {
            const responsesForThisForm = formIdToResponses[f.id] || [];
            const badgeColor = f.is_open
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800';
            const camelCaseTitle =
              f.name.charAt(0).toUpperCase() + f.name.slice(1, f.name.length);

            return (
              <li
                key={f.id}
                className="flex flex-wrap justify-between gap-4 py-5"
              >
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {camelCaseTitle}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${badgeColor} ring-1 ring-inset ring-gray-500/10`}
                    >
                      {f.is_open ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-gray-500">
                    {f.description
                      ? f.description.slice(0, 128) + '...'
                      : f.raw_instructions.slice(0, 128) + '...'}
                  </p>
                </div>
                <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                  <div className="flex gap-2">
                    <Link href={'/forms/' + f.id}>
                      <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
                        View responses
                      </button>
                    </Link>
                    {f.is_open ? (
                      <Link href={'/forms/fill/' + f.id}>
                        <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
                          <LinkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </Link>
                    ) : null}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-gray-500 sm:mt-0">
                    {responsesForThisForm.length === 0
                      ? 'No responses yet'
                      : responsesForThisForm.length + ' responses'}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
