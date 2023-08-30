import { ChatMessage } from '@/types';

export const MessageUI = (message: ChatMessage) => {
  return (
    <div
      className={`my-2 p-3 rounded-lg ${
        message.role === 'assistant'
          ? 'bg-blue-400 text-white'
          : 'bg-gray-300 text-black'
      }`}
    >
      {message.content}
    </div>
  );
};
