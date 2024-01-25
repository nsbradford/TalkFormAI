import { MessageUI } from '@/components/chat';
import { PROMPT_FILL } from '@/prompts';
import { ChatMessage, Form } from '@/models';
import {
  callLLM,
  submitResponseToSupabase
} from '@/utils';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useRef, useState } from 'react';
import { Database } from '../../types/supabase';
import { SubmissionBox } from './SubmissionBox';
import { ErrorBox } from './ErrorBox';
import { MiniSpinner } from './MiniSpinner';

/**
 * Main form-filling chat UI
 * @param props 
 * @returns 
 */
export function InnerChat(props: { form: Form; supabase: SupabaseClient<Database>;}) {
  const { form } = props;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [submission, setSubmission] = useState<object | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isWaiting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isWaiting]);

  useEffect(() => {
    if (messages.length === 0) {
      handleSubmit();
    }
  }, []);


  const handleSubmit = async (userMessage?: string) => {
    const messagesToSend = userMessage && userMessage.trim()
      ? [
        ...messages,
        {
          role: 'user' as const,
          content: `{ "user_message": "${userMessage.trim()}" }`,
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
            content={message.content} />
        ))}
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-400 focus:border-red-500 focus:outline-none rounded-lg disabled:bg-gray-100 focus:ring-rose-300"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isWaiting || isDone}
            onKeyPress={handleKeyPress}
            ref={inputRef} />
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
