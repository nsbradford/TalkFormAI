import React, { useState } from 'react';
import { ChatMessage, LLMRequest, LLMResponse } from '../../types';



const MessageUI = (message: ChatMessage) => {
  return (
    <div className={`my-2 p-3 rounded-lg ${message.role === "assistant" ? "bg-blue-400 text-white" : "bg-gray-300 text-black"}`}>
      {message.content}
    </div>
  );
};

export default function CreateForm() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "What kind of form can I help you with?"
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);

  const handleSubmit = async () => {
    if (inputValue.trim()) {
      const userMessage = {
        role: "user" as const,
        content: inputValue.trim()
      };

      setMessages([...messages, userMessage]);
      setInputValue('');

      setIsWaiting(true);

      const assistantResponse = await getAssistantResponse([...messages, userMessage]);
      setMessages(prev => [...prev, assistantResponse]);

      setIsWaiting(false);
    }
  };

  const handleCancel = () => {
    setIsWaiting(false);
  };

  const getAssistantResponse = async (messages: ChatMessage[]) => {
    const data: LLMRequest = {
      completion_create: {
        model: "gpt-3.5-turbo",
        messages,
      },
    }
    const response = await fetch("/api/llm", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json: LLMResponse = await response.json();
    const text = json.completion.choices[0].message
    return text;
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
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
          />
          <button
            className="ml-2 py-2 px-4 bg-green-500 text-white rounded-lg"
            onClick={handleSubmit}
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
