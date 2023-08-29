import React, { useState } from 'react';

const Message = ({ role, content }) => {
  return (
    <div className={`my-2 p-3 rounded-lg ${role === "assistant" ? "bg-blue-400 text-white" : "bg-gray-300 text-black"}`}>
      {content}
    </div>
  );
};

export default function CreateForm() {
  const [messages, setMessages] = useState([
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
        role: "user",
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

  // Simulating the async function to get the assistant response
  const getAssistantResponse = async (messages) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for 2 seconds for demo
    return {
      role: "assistant",
      content: "Here's a simulated response from the assistant!"
    };
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-extrabold mb-6">Create a Form</h1>
      <div className="w-4/5 md:w-1/2 lg:w-1/3 bg-white shadow-md p-6 rounded-lg">
        {messages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} />
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
