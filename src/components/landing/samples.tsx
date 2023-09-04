import { MessageUI } from '../chat';
import { sunsetGradient } from '../misc';


export function ChatHistory(props: { messages: string[] }) {
  const messages = props.messages.map((message, index) => {
    return (
      <MessageUI
        key={index}
        role={index % 2 === 0 ? 'assistant' : 'user'}
        content={message}
      />
    );
  });
  return (
    <FloatingGradientBackground>
      <div className="bg-white p-4 rounded-lg shadow-xl text-xs text-gray-400 text-left">
        {messages}
      </div>
    </FloatingGradientBackground>
  );
}


export function SampleResponseTable() {
  return (
    <FloatingGradientBackground>
      <table className="text-xs min-w-full bg-white rounded-lg shadow-xl text-sm text-gray-400 border-collapse text-left my-0">
        <thead>
          <tr className="border-b">
            <th className="p-1 pl-2 sm:p-2">Name</th>
            <th className="p-1 pl-2 sm:p-2">Email</th>
            <th className="p-1 pl-2 sm:p-2">Company</th>
            <th className="p-1 pl-2 sm:p-2">Title</th>
            <th className="p-1 pl-2 sm:p-2">Tech</th>
            <th className="p-1 hidden sm:table-cell">GitHub</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-1 pl-2 sm:p-2 border-b">Jane Doe</td>
            <td className="p-1 pl-2 sm:p-2 border-b">jd@ex.co</td>
            <td className="p-1 pl-2 sm:p-2 border-b">Tech Co.</td>
            <td className="p-1 pl-2 sm:p-2 border-b">ML Engineer</td>
            <td className="p-1 pl-2 sm:p-2 border-b">React, Node, Python</td>
            <td className="p-1 pl-2 sm:p-2 border-b hidden sm:table-cell">
              jd-70B
            </td>
          </tr>
          <tr>
            <td className="p-1 pl-2 sm:p-2 border-b">Bill Smith</td>
            <td className="p-1 pl-2 sm:p-2 border-b">bsx@ex.co</td>
            <td className="p-1 pl-2 sm:p-2 border-b">Biz Corp.</td>
            <td className="p-1 pl-2 sm:p-2 border-b">Marketing Manager</td>
            <td className="p-1 pl-2 sm:p-2 border-b">Google Analytics</td>
            <td className="p-1 border-b hidden sm:table-cell">-</td>
          </tr>
        </tbody>
      </table>
    </FloatingGradientBackground>
  );
}

export function FloatingGradientBackground(props: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${sunsetGradient} p-3 md:p-6 rounded-xl shadow-xl`}>
      {props.children}
    </div>
  );
}

export function FloatingTextBox(props: { text: string }) {
  return (
    <FloatingGradientBackground>
      <div className="bg-white p-4 rounded-lg shadow-xl text-xs text-gray-400 text-left">
        {props.text}
      </div>
    </FloatingGradientBackground>
  );
}
