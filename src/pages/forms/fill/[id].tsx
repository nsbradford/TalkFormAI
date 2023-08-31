import { MessageUI } from '@/components/chat';
import { PROMPT_FILL } from '@/prompts';
import { ChatMessage, Form } from '@/types';
import {
  callLLM,
  getFormFromSupabase,
  submitResponseToSupabase,
} from '@/utils';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  SupabaseClient,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { Work_Sans } from 'next/font/google';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Database } from '../../../../types/supabase';


export const workSans = Work_Sans({
  weight: '400',
  subsets: ['latin'],
  // variable: '--font-inter',
});

// Makes it much easier to track renders/fetches by wrapping the component.
export default function CreateForm() {
  const router = useRouter();
  // If the page is still loading (especially during ISR or fallback scenarios), show a loading state
  const formId = router.query.id as string;
  return (
    <div className={`${workSans.className} flex flex-col items-center bg-gradient-to-br from-indigo-200 via-red-200 to-yellow-100 py-20 min-h-screen`}>
      {router.isFallback || typeof formId !== 'string' ? (
        <h1 className="text-3xl font-extrabold mb-6">Loading...</h1>
      ) : (
        <CreateFormInner formId={formId} />
      )}
    </div>
  );
}

export function CreateFormInner(props: { formId: string }) {
  const { formId } = props;
  const supabase = createClientComponentClient<Database>();
  const [form, setForm] = useState<Form | null>(null);
  useEffect(() => {
    if (!form) {
      getFormFromSupabase(formId, supabase).then((maybeForm) => {
        if (maybeForm instanceof Error) {
          console.error(maybeForm.message);
          // TODO set error and render it
        } else {
          setForm(maybeForm);
        }
      });
    }
  }, []); // The empty array ensures this effect runs only once on mount
  return form ? (
    <InnerChat form={form} supabase={supabase} />
  ) : (
    <h1 className="text-3xl font-extrabold mb-6">Loading...</h1>
  );
}
export function InnerChat(props: {
  form: Form;
  supabase: SupabaseClient<Database>;
}) {
  const { form } = props;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // Initialize the ref
  const [submission, setSubmission] = useState<object | null>(null);
  const [error, setError] = useState<Error | null>(null);
  // new Error('Postgres error: blah al;sdjf a;aldkfja ;sdfja; sdf;ajk sd;fljka ;dsfjk')

  const handleSubmit = async (userMessage?: string) => {
    const messagesToSend =
      userMessage && userMessage.trim()
        ? [
            ...messages,
            {
              role: 'user' as const,
              content: `{ "user_message": "${userMessage.trim()}" }`, // extra JSON to keep model behaving
            },
          ]
        : messages;
    setMessages(messagesToSend);
    setInputValue('');
    setIsWaiting(true);
    const assistantResponse = await callLLM(PROMPT_FILL(form), messagesToSend);
    setMessages((prev) => [...prev, assistantResponse]);
    if (assistantResponse.content) {
      try {
        console.log(`LLM response`, assistantResponse);
        const parsed = JSON.parse(assistantResponse.content);
        if (!('action' in parsed && typeof parsed.action === 'string')) {
          console.error(
            'LLM did not return an action',
            assistantResponse.content
          );
        } else {
          console.log(`LLM returned valid JSON with action`, parsed.action);
        }
        if ('submission' in parsed && typeof parsed.submission === 'object') {
          console.log(
            'Agent wants to exit, submitting',
            assistantResponse.content
          );
          submitResponseToSupabase(
            form.id,
            parsed.submission,
            props.supabase
          ).then((maybeError) => {
            setIsDone(true);
            setSubmission(parsed.submission);
            if (maybeError instanceof Error) {
              setError(maybeError);
            }
          });
        } else {
          console.log('Agent wants to continue', assistantResponse.content);
        }
      } catch (e) {
        console.error('Failed to parse LLM output', assistantResponse.content);
      }
      setIsWaiting(false);
    }
  };
  // const handleCancel = () => {
  //   setIsWaiting(false);
  // };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isWaiting) {
      handleSubmit(inputValue);
    }
  };
  useEffect(() => {
    if (!isWaiting && inputRef.current) {
      // Ensure the input gets focus when isWaiting transitions to false
      inputRef.current.focus();
    }
  }, [isWaiting]); // Track changes to the isWaiting state

  useEffect(() => {
    if (messages.length === 0) {
      handleSubmit();
    }
  }, []); // The empty array ensures this effect runs only once on mount

  return (
    <>
      <h1 className="text-3xl font-extrabold mb-6">{form.name}</h1>
      <div className="w-4/5 lg:w-1/2 2xl:w-2/5 bg-white shadow-md p-6 rounded-lg">
        {messages.map((message, index) => (
          <MessageUI
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-400 focus:border-red-500 focus:outline-none rounded-lg disabled:bg-gray-100 focus:ring-rose-300"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isWaiting || isDone}
            onKeyPress={handleKeyPress}
            ref={inputRef}
          />
          <button
            className="ml-2 py-2 px-4 bg-rose-400 hover:bg-rose-300 text-white rounded-lg disabled:bg-gray-300"
            onClick={() => handleSubmit(inputValue)}
            disabled={isWaiting || isDone}
          >
            <FontAwesomeIcon icon={faArrowRight} className='fa-fw' />
          </button>
        </div>
      </div>

      {error && ErrorBox(error)}
      {submission && SubmissionBox(submission)}
    </>
  );
}

{
  /* {isWaiting && (
            <button
              className="ml-2 py-2 px-4 bg-red-500 text-white rounded-lg"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )} */
}

function ErrorBox(error: Error): React.ReactNode {
  return (
    <div className="w-4/5 md:w-1/2 lg:w-1/3 bg-red-300 shadow-md p-6 rounded-lg mt-4">
      <h1 className="text-xl font-extrabold mb-6">Error</h1>
      <p className="font-mono text-sm whitespace-pre-wrap">{error.message}</p>
    </div>
  );
}

function SubmissionBox(submission: object): React.ReactNode {
  return (
    <div className="w-4/5 md:w-1/2 lg:w-1/3 bg-white shadow-md p-6 rounded-lg mt-4">
      <h1 className="text-xl font-extrabold mb-6">Submission</h1>
      <p className="font-mono text-sm whitespace-pre-wrap">
        {JSON.stringify(submission, null, 2)}
      </p>
      {/* <div className="mt-4 flex">
          <button
            className="ml-2 py-2 px-4 bg-green-500 text-white rounded-lg"
            onClick={() => router.push('/')}
          >
            Home
          </button>
        </div> */}
    </div>
  );
}
