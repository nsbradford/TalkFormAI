import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, LLMRequest, LLMResponse } from '@/types';
import { FAKE_SCHEMA, PROMPT_FILL } from '@/prompts';
import { MessageUI } from '@/components/chat';
import { callLLM } from '@/utils';


export default function CreateForm() {
  const schema = FAKE_SCHEMA; // TODO hydrate from route after page loads
  const systemPrompt = PROMPT_FILL(schema);
  const [messages, setMessages] = useState<ChatMessage[]>([
    // {
    //   role: "assistant",
    //   content: "What kind of form can I help you with?"
    // }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // Initialize the ref

  const handleSubmit = async (userMessage?: string) => {
    const messagesToSend = userMessage && userMessage.trim() ? [...messages, {
      role: "user" as const,
      content: userMessage.trim()
    }] : messages;
    setMessages(messagesToSend);
    setInputValue('');
    setIsWaiting(true);
    const assistantResponse = await callLLM(systemPrompt, messagesToSend);
    setMessages(prev => [...prev, assistantResponse]);
    setIsWaiting(false);
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
      <div className="w-4/5 md:w-1/2 lg:w-1/3 bg-white shadow-md p-6 rounded-lg">
        {messages.map((message, index) => (
          <MessageUI key={index} role={message.role} content={message.content} />
        ))}
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded-lg"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
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
