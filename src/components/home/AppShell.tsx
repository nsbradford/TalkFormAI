import { AppShellProps, Form, Response } from '@/types';
import { getFormsFromSupabase, getResponsesFromSupabase } from '@/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Database } from '../../../types/supabase';
import { NavBar } from './NavBar';
import DashboardMode from './modes/DashboardMode';
import ErrorMode from './modes/ErrorMode';
import FormDetailMode from './modes/FormDetailMode';
import NewFormMode from './modes/NewFormMode';
import SettingsMode from './modes/SettingsMode';

type AppMode = {
  displayName: string;
  internalName: string;
};

const dashboardAppModeInternalName = 'dashboard';
const newFormAppModeInternalName = 'new_form';
const formDetailAppModeInternalName = 'form_detail';
const settingsAppModeInternalName = 'settings';

export default function AppShell(props: AppShellProps) {
  const dashboardAppMode = {
    displayName: 'Dashboard',
    internalName: dashboardAppModeInternalName,
  };
  const newFormAppMode = {
    displayName: 'Create Form',
    internalName: newFormAppModeInternalName,
  };
  const formDetailAppMode = {
    displayName: 'Responses',
    internalName: formDetailAppModeInternalName,
  };
  const settingsAppMode = {
    displayName: 'Settings',
    internalName: settingsAppModeInternalName,
  };

  const { push } = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [mode, setMode] = useState<AppMode>(dashboardAppMode);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const [activeForm, setActiveForm] = useState<Form | null>(null);
  const [allForms, setAllForms] = useState<Form[] | null>(null);
  const [formIdToResponses, setFormIdToResponses] = useState<Record<
    string,
    Response[]
  > | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFormsAndResponses = async () => {
      const forms = await getFormsFromSupabase(props.user.id, supabase);
      if (forms === undefined) {
        setIsLoading(false);
        return;
      } else if (forms.length === 0) {
        setAllForms(forms);
        setFormIdToResponses({} as Record<string, Response[]>);
        setIsLoading(false);
        return;
      }
      setAllForms(forms);
      const allResposes = {} as Record<string, Response[]>;
      for (const form of forms) {
        const formResponses = await getResponsesFromSupabase(form.id, supabase);
        if (formResponses === undefined) {
          continue;
        }
        allResposes[form.id] = formResponses as Response[];
      }
      setFormIdToResponses(allResposes);
      setIsLoading(false);
    };
    if (
      shouldRefresh ||
      (isLoading && allForms === null && formIdToResponses === null)
    ) {
      getFormsAndResponses();
    }
  }, [isLoading, allForms, formIdToResponses]);

  const userNavigation = [
    { name: 'Settings', href: '#', onClick: () => setMode(settingsAppMode) },
    {
      name: 'Sign out',
      href: '#',
      onClick: () => {
        supabase.auth.signOut();
        push('/');
      },
    },
  ];

  const getAvatar = (size: number) => {
    if (props.user.avatar_url) {
      return (
        <img
          className={`h-${size} w-${size} rounded-full`}
          src={props.user.avatar_url}
          alt=""
        />
      );
    }
    return (
      <div className={`h-${size} w-${size} rounded-full bg-gray-500"`}>
        <div className="flex h-full w-full items-center justify-center text-white">
          {props.user.email[0]}
        </div>
      </div>
    );
  };

  const getCenterModeComponent = () => {
    if (mode.internalName === dashboardAppModeInternalName) {
      return (
        <DashboardMode
          user={props.user}
          forms={allForms || []}
          responses={formIdToResponses || {}}
          onNewFormClick={() => setMode(newFormAppMode)}
          onFormDetailClick={(formId) => {
            const selectedForm = allForms?.find((f) => f.id === formId);
            if (selectedForm === undefined) {
              return (
                <ErrorMode
                  user={props.user}
                  errorMessage={`No form found for ${formId}`}
                />
              );
            }
            setActiveForm(selectedForm);
            setMode(formDetailAppMode);
          }}
        />
      );
    } else if (mode.internalName === newFormAppModeInternalName) {
      return (
        <NewFormMode
          user={props.user}
          onCancelClick={() => setMode(dashboardAppMode)}
          onSuccessfulSubmit={() => {
            setShouldRefresh(true);
            setMode(dashboardAppMode);
          }}
        />
      );
    } else if (
      mode.internalName === formDetailAppModeInternalName &&
      activeForm
    ) {
      return (
        <FormDetailMode
          user={props.user}
          form={activeForm}
          responses={formIdToResponses?.[activeForm?.id || ''] || []}
        />
      );
    } else if (mode.internalName === settingsAppModeInternalName) {
      return <SettingsMode user={props.user} />;
    } else {
      return (
        <ErrorMode
          user={props.user}
          errorMessage={`No mode found for ${mode.internalName}`}
        />
      );
    }
  };

  return (
    <>
      <div className="min-h-full">
        <NavBar
          getAvatar={getAvatar}
          userNavigation={userNavigation}
          props={props}
        />

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {mode.displayName}
            </h1>
            <div
              className="bg-yellow-100 border-l-4 border-yellow-500 text-black mt-2 p-4 text-xs"
              role="alert"
            >
              <p>
                <span className="font-extrabold">Warning: </span>
                This product is in early development. Do not use it for
                sensitive or confidential information. For details, see{' '}
                <a
                  className="underline"
                  target="_blank"
                  href="https://github.com/nsbradford/TalkFormAI/blob/main/LICENSE"
                >
                  terms
                </a>
                .
              </p>
            </div>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {getCenterModeComponent()}
          </div>
        </main>
      </div>
    </>
  );
}
