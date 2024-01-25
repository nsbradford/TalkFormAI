import { InnerChat } from '@/components/InnerChat';
import { Form } from '@/models';
import { getFormFromSupabase } from '@/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import { Database } from '../../types/supabase';
import { ErrorBox } from './ErrorBox';
import { InnerChat } from '@/components/InnerChat';


export function CreateFormInner(props: { formId: string; }) {
  const { formId } = props;
  const supabase = createClientComponentClient<Database>();
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    if (!form) {
      getFormFromSupabase(formId, supabase).then((maybeForm) => {
        if (maybeForm instanceof Error) {
          console.error(maybeForm.message);
          setError(maybeForm);
        } else {
          setForm(maybeForm);
        }
      });
    }
  }, []);
  return form ? (
    <InnerChat form={form} supabase={supabase} />
  ) : (
    <>
      {error ? (
        ErrorBox(error)
      ) : (
        <h1 className="text-3xl font-extrabold mb-6">Loading...</h1>
      )}
    </>
  );
}
