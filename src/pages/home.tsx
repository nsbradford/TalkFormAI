import Page from '@/components/layout/Page';
import DashboardMode from '@/components/home/DashboardMode';
import { getUserFromSupabase } from '@/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Database } from '../../types/supabase';
import { User } from '@/types';

export default function HomePage() {
  const { push } = useRouter();
  const { isLoading: isSessionLoading, session, error } = useSessionContext();
  const supabase = createClientComponentClient<Database>();
  const [user, setUser] = useState<null | User>(null);
  const [openForms, setOpenForms] = useState(0);
  const [closedForms, setClosedForms] = useState(0);

  useEffect(() => {
    if (!isSessionLoading && !session) {
      push('/auth');
    }
    if (!isSessionLoading && session) {
      getUserFromSupabase(session, supabase, setUser);
      getFormCounts();
    }
  }, [isSessionLoading, session]);

  async function getFormCounts() {
    let { data: forms, error } = await supabase
      .from('forms')
      .select('*');
    if (error) console.log('Error: ', error);
    else {
      let openCount = forms.filter(form => form.is_open).length;
      let closedCount = forms.length - openCount;
      setOpenForms(openCount);
      setClosedForms(closedCount);
    }
  }

  return (
    <Page pageTitle="Home" user={user}>
      <DashboardMode user={user} />
      <div>
        <span>Open Forms: {openForms}</span>
        <span>Closed Forms: {closedForms}</span>
      </div>
    </Page>
  );
}