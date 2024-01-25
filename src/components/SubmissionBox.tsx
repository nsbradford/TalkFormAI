import React from 'react';

export function SubmissionBox(submission: object): React.ReactNode {
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
