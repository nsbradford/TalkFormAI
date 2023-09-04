import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { TalkFormLogo } from '../talkform';
import { getUserFromSupabase } from '@/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Database } from '../../../types/supabase';
import { User } from '@/types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function NavBar2() {
  const { push } = useRouter();
  const { isLoading: isSessionLoading, session, error } = useSessionContext();
  const supabase = createClientComponentClient<Database>();
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    if (!isSessionLoading && session) {
      getUserFromSupabase(session, supabase, setUser);
    }
  }, [isSessionLoading, session]);

  const userNavigation = user
    ? [
        {
          name: 'Home',
          href: '/home',
          onClick: () => {},
        },
        {
          name: 'Settings',
          href: '/settings',
          onClick: () => {},
        },
        {
          // TODO some weirdness here
          name: 'Sign out',
          href: '#',
          onClick: () => {
            supabase.auth.signOut();
            push('/auth');
          },
        },
      ]
    : [
        {
          // TODO refactor auth
          name: 'Sign up',
          href: '#',
          onClick: () => {
            push('/auth#');
          },
        },
      ];

  const navigation = [
    {
      name: 'About',
      href: '/about',
      current: false,
    },
    {
      name: 'Contact',
      href: '/contact',
      current: false,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/nsbradford/talkformai',
      current: false,
    },
  ];

  return (
    <Disclosure as="nav" className="bg-black bg-opacity-5">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:justify-start">
                <div className="flex-shrink-0 items-center flex">
                  <TalkFormLogo />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        // item.current
                        //   ? 'bg-gray-900 text-gray-700'
                        //   :
                        'font-extrabold text-gray-700 hover:bg-gray-200 hover:text-gray-700',
                        'rounded-md px-3 py-2 text-sm font-bold'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-black bg-opacity-5 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <div className={`h-12 w-12 rounded-full bg-gray-500`}>
                        <div className="flex h-full w-full items-center justify-center text-gray-700">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fa-fw text-white"
                          />
                        </div>
                      </div>
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
                            // issue for signout page if you use Link
                            <a
                              href={item.href}
                              onClick={item.onClick ? item.onClick : () => {}}
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
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-gray-700'
                      : 'text-gray-700 hover:bg-gray-200 hover:text-gray-700',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
