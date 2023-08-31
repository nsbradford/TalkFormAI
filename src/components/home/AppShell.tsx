import { useEffect} from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../../types/supabase';
import DashboardMode from './modes/DashboardMode';
import { Form, User, Response } from '@/types';
import NewFormMode from './modes/NewFormMode';
import SettingsMode from './modes/SettingsMode';
import ErrorMode from './modes/ErrorMode';
import FormDetailMode from './modes/FormDetailMode';
import { getFormsFromSupabase, getResponsesFromSupabase } from '@/utils';
import { useState } from 'react';
import { Text, createStyles, Navbar, Group, Code, getStylesRef, rem, Paper } from '@mantine/core';
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
} from '@tabler/icons-react';


type AppShellProps = {
  user: User;
};

type AppMode = {
  displayName: string;
  internalName: string;
};

const dashboardAppModeInternalName = 'dashboard';
const newFormAppModeInternalName = 'new_form';
const formDetailAppModeInternalName = 'form_detail';
const settingsAppModeInternalName = 'settings';

 
const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  },
}));

const data = [
  { link: '', label: 'Notifications', icon: IconBellRinging },
  { link: '', label: 'Billing', icon: IconReceipt2 },
  { link: '', label: 'Security', icon: IconFingerprint },
  { link: '', label: 'SSH Keys', icon: IconKey },
  { link: '', label: 'Databases', icon: IconDatabaseImport },
  { link: '', label: 'Authentication', icon: Icon2fa },
  { link: '', label: 'Other Settings', icon: IconSettings },
];



export default function AppShell(props: AppShellProps) {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('Billing');
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
          onFormDetailClick={() => setMode(formDetailAppMode)}
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
    } else if (mode.internalName === formDetailAppModeInternalName && activeForm) {
      return (
        <FormDetailMode
          user={props.user}
          form={activeForm}
          responses={formIdToResponses?.[activeForm?.id || ''] || []}
        />
      )
    } else if (mode.internalName === settingsAppModeInternalName) {
      return <SettingsMode user={props.user} />;
    } else {
      return (
        <ErrorMode
          user={props.user}
          errorMessage={`No mode with internal name ${mode.internalName}`}
        />
      );
    }
  };


  const links = data.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <Group h={'100vh'}>
      <Navbar width={{ sm: 300 }} p="md">
        <Navbar.Section grow>
          <Group className={classes.header} position="apart">
            {getAvatar(20)}
            <Text color={'dimmed'}>
              {props.user.email}
            </Text>
          </Group>
          {links}
        </Navbar.Section>

        <Navbar.Section className={classes.footer}>
          <a href="#" className={classes.link} onClick={(event) => {
            supabase.auth.signOut();
            event.preventDefault()
          }}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </a>
        </Navbar.Section>
      </Navbar>
      <Paper h={'100vh'} w={'100vh'} style={{overflow: 'scroll'}}>
        {getCenterModeComponent()}
      </Paper>
    </Group>
  );
}