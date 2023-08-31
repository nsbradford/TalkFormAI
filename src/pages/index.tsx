import { Inter } from 'next/font/google';
import Link from 'next/link';

// const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold md:text-7xl my-8 inline-block bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent ">
          TalkForm AI
        </h1>
        <h2 className="text-xl font-extrabold md:text-2xl my-8 inline-block ">
          Create and fill forms with chat.{' '}
          <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-fuchsia-500 bg-clip-text text-transparent">
            It just works.
          </span>
        </h2>
        <Link
          href="/home"
          className="inline-block bg-gradient-to-r from-yellow-400 via-pink-400 to-fuchsia-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:from-yellow-300 hover:via-pink-300 hover:to-fuchsia-400"
        >
          Create a form ›
        </Link>
      </div>
    </div>
  );
}
