import Spinner from '@/components/home/Spinner';
import Page from '@/components/layout/Page';
import { Form, Response, User } from '@/types';
import {
  getFormFromSupabase,
  getResponsesFromSupabase,
  getUserFromSupabase,
} from '@/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Database } from '../../../types/supabase';
import ResponsesTable from '../../components/home/modes/ResponsesTable';

export default function FormDetailPage() {
  const { isLoading: isSessionLoading, session, error } = useSessionContext();
  const supabase = createClientComponentClient<Database>();
  const [user, setUser] = useState<null | User>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { push } = useRouter();

  useEffect(() => {
    if (!isSessionLoading && !session) {
      push('/auth');
    }
    if (!isSessionLoading && session) {
      getUserFromSupabase(session, supabase, setUser);
    }
  }, [isLoading, session]);

  useEffect(() => {
    const getFormAndResponses = async () => {
      if (user === null) {
        return;
      }
      const formId = window.location.pathname.split('/')[2];
      const result = await getFormFromSupabase(formId, supabase);
      if (result === null || result instanceof Error) {
        return;
      }
      setForm(result as Form);
      const formResponses = await getResponsesFromSupabase(result.id, supabase);
      setResponses(formResponses as Response[]);
      setIsLoading(false);
    };
    if ((user !== null && form === null) || responses === null) {
      getFormAndResponses();
    }
  }, [isSessionLoading, user, form, responses]);

  if (isLoading || isSessionLoading || form === null || responses === null) {
    return <Spinner />;
  }

  const badgeColor = form.is_open
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';
  const camelCaseTitle =
    form.name.charAt(0).toUpperCase() + form.name.slice(1, form.name.length);
  return (
    <Page pageTitle="Responses" user={user}>
      <div className="flex min-w-0 gap-x-4 mb-6 text-xs p-4">
        <div className="min-w-0 flex-auto">
          <div className="flex gap-x-6 mb-2">
            <h1 className="text-lg font-bold leading-6 text-gray-900">
              {camelCaseTitle}
            </h1>
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${badgeColor} ring-1 ring-inset ring-gray-500/10 shadow-md`}
            >
              {form.is_open ? 'Open' : 'Closed'}
            </span>
          </div>
          <Link href={'/forms/fill/' + form.id}>
            <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              View live form
            </button>
          </Link>
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 mt-8">
              Description
            </h2>
            <div className="p-4 bg-gray-100 border border-gray-200 rounded">
              {form.description.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 mt-8">
              <span className="font-mono text-gray-400">
                {'[AI-generated]'}
              </span>{' '}
              Guidance
            </h2>
            <div className="p-4 bg-gray-100 border border-gray-200 rounded">
              {form.fields_guidance.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 mt-8">
              <span className="font-mono text-gray-400">
                {'[AI-generated]'}
              </span>{' '}
              Schema
            </h2>
            <div className="p-4 bg-gray-100 border border-gray-200 rounded overflow-x-auto whitespace-pre-wrap font-mono">
              {JSON.stringify(form.fields_schema, null, 2)}
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2 mt-8">
            Responses
          </h2>
        </div>
      </div>
      <ResponsesTable
        data={responses.map(
          (response) => response.fields as Array<Record<string, any>>
        )}
      />
    </Page>
  );
}
