import { Form, User } from '@/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { Database } from '../../../types/supabase';
import { useRouter } from 'next/router';
import { getUserFromSupabase } from '@/utils';
import { Button } from '@mantine/core';



export default function CreateFormComponent() {
  const [desiredFields, setDesiredFields] = useState('');
  const { isLoading, session, error } = useSessionContext();
  const supabase = createClientComponentClient<Database>();
  const [user, setUser] = useState<null | User>(null);
  const { push } = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      push('/auth');
    }
    if (!isLoading && session) {
      getUserFromSupabase(session, supabase, setUser);
    }
  }, [isLoading, session]);

  const handleCreateForm = async () => {
    console.log(`Creating form with desired fields: ${desiredFields}`);
    if (!user) {
      console.error('User is not set.');
      return;
    }

    const form: Form = {
      id: v4(),
      user_id: user.id,
      name: 'Untitled Form',
      description: null,
      desired_fields_schema: desiredFields,
      is_open: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('forms').insert(form);

    if (error) {
      console.error(`Error creating form`, { form, error });
    } else {
      console.log('Successfully created form', form);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl mb-4">Create Form</h1>
      {user ? (
        <>
          <input
            type="text"
            className="border p-2 mb-2"
            placeholder="Desired Fields"
            value={desiredFields}
            onChange={(e) => setDesiredFields(e.target.value)}
          />
          {/* <h1 className="text-xl mb-4">[this page is deprecated]</h1> */}
          <Button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={handleCreateForm}
          >
            Create Form
          </Button>
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}
