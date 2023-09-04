import { MessageUI } from '@/components/chat';
import NavBar from '@/components/home/NavBar';
import { workSans } from '@/components/misc';
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
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Database } from '../../../../types/supabase';

// Makes it much easier to track renders/fetches by wrapping the component.
export default function CreateForm() {
  const router = useRouter();
  // If the page is still loading (especially during ISR or fallback scenarios), show a loading state
  const formId = router.query.id as string;
  return (
    <>
      <div
        className={`bg-gradient-to-br from-indigo-200 via-red-200 to-yellow-100 min-h-screen`}
      >
        <NavBar />
        <div
          className={`${workSans.className} flex flex-col items-center  min-h-screen py-20 px-4`}
        >
          {router.isFallback || typeof formId !== 'string' ? (
            <h1 className="text-3xl font-extrabold mb-6">Loading...</h1>
          ) : (
            <CreateFormInner formId={formId} />
          )}
        </div>
      </div>
    </>
  );
}

export function CreateFormInner(props: { formId: string }) {
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
  }, []); // The empty array ensures this effect runs only once on mount
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
export function InnerChat(props: {
  form: Form;
  supabase: SupabaseClient<Database>;
}) {
  const { form } = props;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [submission, setSubmission] = useState<object | null>(null);
  const [error, setError] = useState<Error | null>(null);

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
    if (assistantResponse instanceof Error) {
      setError(assistantResponse);
      return;
    }
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
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-center px-8 text-2xl lg:text-3xl font-extrabold mb-6">
          {form.name}
        </h1>
      </div>
      <div className="lg:w-1/2 2xl:w-2/5 bg-white shadow-md p-3 md:p-6 rounded-lg text-sm md:text-base">
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
            {isWaiting ? (
              <MiniSpinner />
            ) : (
              <FontAwesomeIcon icon={faArrowRight} className="fa-fw" />
            )}
          </button>
        </div>
      </div>

      {error && ErrorBox(error)}
      {submission && SubmissionBox(submission)}
    </>
  );
}

function MiniSpinner() {
  return (
    <div
      className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
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
    <div
      id="submissionBox"
      className="w-4/5 md:w-1/2 lg:w-1/3 bg-white shadow-md p-6 rounded-lg mt-4"
    >
      <h1 className="text-xl font-extrabold mb-6">Submission</h1>
      <p className="font-mono text-sm whitespace-pre-wrap">
        {JSON.stringify(submission, null, 2)}
      </p>
    </div>
  );
}
