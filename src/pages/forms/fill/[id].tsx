import { MessageUI } from '@/components/chat';
import { PROMPT_FILL } from '@/prompts';
import { ChatMessage, Form } from '@/types';
import { callLLM, getFormFromSupabase, submitResponseToSupabase } from '@/utils';
import { SupabaseClient, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Database } from '../../../../types/supabase';

// Makes it much easier to track renders/fetches by wrapping the component.
export default function CreateForm() {
  const router = useRouter();
  // If the page is still loading (especially during ISR or fallback scenarios), show a loading state
  if (router.isFallback) {
    return <div>Loading...</div>;
  } else {
    const formId = router.query.id as string;
    if (typeof formId !== 'string') {
      // console.error(`Invalid form id: '${formId}'`);
      return <div>Loading...</div>;
    }
    return <CreateFormInner formId={formId} />;
  }
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
  return form ? <InnerChat form={form} supabase={supabase} /> : <div>Loading...</div>;
}
export function InnerChat(props: { form: Form, supabase: SupabaseClient<Database> }) {
  const { form } = props;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // Initialize the ref

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
          console.error('Invalid response from LLM', assistantResponse.content);
        } else {
          console.log(`LLM returned valid JSON with action`, parsed.action);
        }
        if ('form' in parsed && typeof parsed.form === 'object') {
          console.log('Agent wants to exit, submitting', assistantResponse.content);
          submitResponseToSupabase(form.id, parsed.form, props.supabase).then((maybeError) => {
            // if (maybeError instanceof Error) {
            //   // TODO set error and render it
            // } else {
            //   router.push(`/forms/${form.id}/submitted`);
            // }
          });
        } else {
          console.log('Agent wants to continue', assistantResponse.content);
        }
      } catch (e) {
        console.error('Invalid response from LLM', assistantResponse.content);
      }
      setIsWaiting(false);
    };
  };
  const handleCancel = () => {
    setIsWaiting(false);
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
    <div className="flex flex-col items-center bg-gray-100 py-20">
      <h1 className="text-4xl font-extrabold mb-6">Fill a form</h1>
      {form && <h1 className="text-4xl font-extrabold mb-6">Name: {form.name}</h1>}
      <div className="w-4/5 md:w-1/2 lg:w-1/3 bg-white shadow-md p-6 rounded-lg">
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
            className="flex-grow p-2 border rounded-lg"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isWaiting}
            onKeyPress={handleKeyPress}
            ref={inputRef}
          />
          <button
            className="ml-2 py-2 px-4 bg-green-500 text-white rounded-lg"
            onClick={() => handleSubmit(inputValue)}
            disabled={isWaiting}
          >
            Submit
          </button>
          {isWaiting && (
            <button
              className="ml-2 py-2 px-4 bg-red-500 text-white rounded-lg"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
