import React from 'react';

export function ErrorBox(
  error: Error
): React.ReactNode {
  return (
    <div className="w-4/5 md:w-1/2 lg:w-1/3 bg-red-300 shadow-md p-6 rounded-lg mt-4">
    <h1 className="text-xl font-extrabold mb-6">Error</h1>
    <p className="font-mono text-sm whitespace-pre-wrap">{error.message}</p>
    </div>
  );
}
