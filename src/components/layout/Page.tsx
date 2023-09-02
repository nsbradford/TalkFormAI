import { User } from '@/types';
import { NavBar } from '../home/NavBar';
import Link from 'next/link';

interface PageProps {
  user: User | null;
  pageTitle: string;
  children: React.ReactNode;
}

export default function Page(props: PageProps) {
  return (
    <>
      <div className="min-h-full">
        <NavBar getAvatar={() => <></>} userNavigation={[]} user={props.user} />

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {props.pageTitle}
            </h1>
            <div
              className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-3 mt-4"
              role="alert"
            >
              <p className="text-xs">
                <span className="font-bold">Warning</span>: This product is in
                early stages of development. Do not use for
                sensitive/confidential info. For details, see{' '}
                <Link
                  className="underline hover:"
                  href="https://github.com/nsbradford/TalkFormAI/blob/main/LICENSE"
                  target="_blank"
                >
                  terms
                </Link>
                .
              </p>
            </div>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <main>{props.children}</main>
          </div>
        </main>
      </div>
    </>
  );
}
