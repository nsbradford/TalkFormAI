import { User } from "@supabase/auth-helpers-nextjs";
import { NavBar } from "../home/NavBar";

 
interface PageProps {
  user: User | null;
  pageTitle: string
  children: React.ReactNode
}


export default function Page(props: PageProps) {
  return (
    <>
      <div className="min-h-full">
        <NavBar getAvatar={() => <></>} userNavigation={[]} props={{}} />

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {props.pageTitle}
            </h1>
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