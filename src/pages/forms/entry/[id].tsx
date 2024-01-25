import NavBar from '@/components/settings/NavBar';
import { workSans } from '@/components/misc';
import { useRouter } from 'next/router';
import React from 'react';
import { CreateFormInner } from '../../../components/CreateFormInner';

// Makes it much easier to track renders/fetches by wrapping the component.
export default function CreateForm() {
  const router = useRouter();
  // If the page is still loading (especially during ISR or fallback scenarios), show a loading state
  const formId = router.query.id as string;
  return (
    <>
      <div
        className={`bg-gradient-to-br from-indigo-200 via-red-200 to-yellow-100 min-h-screen`}
      >
        <NavBar />
        <div
          className={`${workSans.className} flex flex-col items-center  min-h-screen py-20 px-4`}
        >
          {router.isFallback || typeof formId !== 'string' ? (
            <h1 className="text-3xl font-extrabold mb-6">Loading...</h1>
          ) : (
            <CreateFormInner formId={formId} />
          )}
        </div>
      </div>
    </>
  );
}


