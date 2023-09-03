import { ChatMessage } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faUser } from '@fortawesome/free-solid-svg-icons';

export function MessageUI(message: ChatMessage) {
  const content = parseMessageJson(message);
  return (
    <div
      className={`mb-2 p-3 rounded-lg ${
        message.role === 'assistant' ? 'bg-gray-100' : 'bg-white'
      }`}
    >
      <div className="flex items-start">
        <div className="mr-4 ">
          {message.role === 'assistant' ? (
            <FontAwesomeIcon icon={faRobot} className="fa-fw text-rose-400" />
          ) : (
            <FontAwesomeIcon icon={faUser} className="fa-fw text-gray-400" />
          )}
        </div>
        <div>
          <span className="break-words">{content}</span>
        </div>
      </div>
    </div>
  );
}

function parseMessageJson(message: ChatMessage) {
  let content;
  if (!message.content) {
    content = '';
  } else {
    // gross hacks but oh well
    try {
      const parsed = JSON.parse(message.content);
      if (typeof parsed === 'string') {
        content = parsed;
      } else if ('text' in parsed && typeof parsed.text === 'string') {
        content = parsed.text;
      } else if (
        'user_message' in parsed &&
        typeof parsed.user_message === 'string'
      ) {
        content = parsed.user_message;
      } else if ('action' in parsed && parsed.action === 'exit') {
        content = 'Your response was successfully submitted.';
      } else {
        content = message.content;
      }
    } catch (e) {
      content = message.content;
    }
  }
  return content;
}
