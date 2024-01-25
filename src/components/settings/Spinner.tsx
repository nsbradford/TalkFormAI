import React from 'react';

export const SpinnerFullPage = () => (
  <div className="flex justify-center items-center min-h-screen">
    {Spinner()}
  </div>
);

export function Spinner() {
  return (
    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
  );
}
