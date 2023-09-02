import { User } from '@/types';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { TalkFormLogo } from '../talkform';
import { getUserFromSupabase } from '@/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Database } from '../../../types/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// const contact = <a href="mailto:nsbradford@gmail.com,seanhunterbrooks@gmail.com">Contact</a>;

export function NavBar() {
  // TODO later refactor all the user hydration code
  const { push } = useRouter();
  const { isLoading: isSessionLoading, session, error } = useSessionContext();
  const supabase = createClientComponentClient<Database>();
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    if (!isSessionLoading && session) {
      getUserFromSupabase(session, supabase, setUser);
    }
  }, [isSessionLoading, session]);

  const userNavigation = user ? [
    {
      name: 'Home',
      href: '/home',
      onClick: () => { },
    },
    {
      name: 'Settings',
      href: '/settings',
      onClick: () => { },
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
  ] : [
      {
      // TODO refactor auth
      name: 'Sign up',
      href: '#',
      onClick: () => {
        push('/auth#');
      },
    },
  ];

  const getAvatar = (size: number) => {
    return (
      <div className={`h-${size} w-${size} rounded-full bg-gray-500`}>
        <div className="flex h-full w-full items-center justify-center text-white">
          <FontAwesomeIcon icon={faUser} className="fa-fw text-white" />
        </div>
      </div>
    );
  };

  const navbarItems = [
    { name: <span className='font-extrabold text-gray-400 hover:text-black'>About</span>, href: '/about' },
    { name: <FontAwesomeIcon icon={faGithub} className="fa-fw text-3xl text-gray-400 hover:text-black" />, href: 'https://github.com/nsbradford/talkformai' },
  ];

  return (
    <Disclosure as="nav" className="bg-black bg-opacity-5">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
            <div className="flex justify-between w-full">
  <TalkFormLogo />

  <div className="flex items-center">
    {navbarItems.map((item, i) => (
      <a key={i} href={item.href} className="ml-4 text-white hover:underline">
        {item.name}
      </a>
    ))}
  </div>
</div>
              <div className="hidden md:flex items-center md:ml-6">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      {getAvatar(12)}
                    </Menu.Button>
                  </div>
                  <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a href={item.href} onClick={item.onClick ? item.onClick : () => {}} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open main menu</span>
                  {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>
    
          {user && (
            <Disclosure.Panel className="md:hidden border-t border-gray-700 pb-3 pt-4 px-5">
              <div className="flex items-center">
                {getAvatar(12)}
                <div className="ml-3 text-sm font-medium leading-none text-gray-400">{user.email}</div>
              </div>
              <div className="mt-3 space-y-1">
                {userNavigation.map((item) => (
                  <Disclosure.Button key={item.name} as="a" href={item.href} className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
    
  );
}
