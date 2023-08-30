import { Fragment, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../../types/supabase';
import DashboardMode from './modes/DashboardMode';
import { User } from '@/types';
import NewFormMode from './modes/NewFormMode';
import SettingsMode from './modes/SettingsMode';
import ErrorMode from './modes/ErrorMode';


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type AppShellProps = {
  user: User;
};

type AppMode = {
  displayName: string;
  internalName: string;
}

const dashboardAppModeInternalName = 'dashboard';
const newFormAppModeInternalName = 'new_form';
const settingsAppModeInternalName = 'settings';


export default function AppShell(props: AppShellProps) {
  const dashboardAppMode = {
    displayName: 'Dashboard',
    internalName: dashboardAppModeInternalName,
  }
  const newFormAppMode = {
    displayName: 'New Form',
    internalName: newFormAppModeInternalName,
  }
  const settingsAppMode = {
    displayName: 'Settings',
    internalName: settingsAppModeInternalName,
  }

  const { push } = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [mode, setMode] = useState<AppMode>(dashboardAppMode);

  const userNavigation = [
    { name: 'Settings', href: '#', onClick: () => setMode(settingsAppMode)},
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
      return (<DashboardMode
        user={props.user}
        onNewFormClick={() => setMode(newFormAppMode)}
      />);
    } else if (mode.internalName === newFormAppModeInternalName) {
      return <NewFormMode user={props.user}/>;
    } else if (mode.internalName === settingsAppModeInternalName) {
      return <SettingsMode user={props.user}/>;
    } else {
      return <ErrorMode
        user={props.user}
        errorMessage={`No mode with internal name ${mode.internalName}`}
      />
    }
  };

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            {getAvatar(8)}
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    onClick={
                                      item.onClick ? item.onClick : () => {}
                                    }
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">{getAvatar(10)}</div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {props.user.email}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {props.user.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {mode.displayName}
            </h1>
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
