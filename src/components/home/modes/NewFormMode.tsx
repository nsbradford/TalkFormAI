import { useState } from 'react';
import { Database } from '../../../../types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Form, User } from '@/types';
import { v4 } from 'uuid';

type NewFormModeProps = {
  user: User;
  onCancelClick: () => void;
  onSuccessfulSubmit: () => void;
};

export default function NewFormMode(props: NewFormModeProps) {
  const supabase = createClientComponentClient<Database>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    event.preventDefault();
    const target = event.target as typeof event.target & {
      title: { value: string };
      questions: { value: string };
    };
    const title = target.title.value;
    const questions = target.questions.value;
    await supabase.from('forms').insert([
      {
        desired_fields_schema: questions,
        id: v4(),
        is_open: true,
        name: title,
        user_id: props.user.id,
      },
    ]);
    setIsLoading(false);
    props.onSuccessfulSubmit();
  }

  return (
    <form method="POST" onSubmit={onFormSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>

              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    id="title"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Birthday party invitation"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="questions"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Questions
              </label>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Describe what information survey participants should provide.
              </p>
              <div className="mt-2">
                <textarea
                  id="questions"
                  name="questions"
                  rows={5}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                  placeholder="Attendance, food allergies, # of additional guests, activity ideas, etc."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={props.onCancelClick}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
