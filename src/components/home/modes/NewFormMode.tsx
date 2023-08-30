import { useState } from 'react';
import { Database } from '../../../../types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Form, User } from '@/types';

type NewFormModeProps = {
    user: User;
}



export default function NewFormMode(props: NewFormModeProps) {
    const supabase = createClientComponentClient<Database>();
    const [form, setForm] = useState<Form | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    return (
        <ul role="list" className="divide-y divide-gray-100">
            <p>
                new form page
            </p>
        </ul>
    ); 
}
