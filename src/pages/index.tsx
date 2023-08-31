import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Work_Sans } from 'next/font/google';import Link from 'next/link';

// export const workSans = Work_Sans({
//   weight: '400',
//   subsets: ['latin'],
//   // variable: '--font-inter',
// });
// const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <div className={`flex justify-center items-center mt-20`}>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-extrabold pb-8 md:text-7xl bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">
            Forms, reimagined.
          </h1>
          <h2 className="text-xl font-extrabold mb-8 md:text-2xl">
            Chat to build. Chat to fill. Zero configuration.{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-fuchsia-500 bg-clip-text text-transparent">
              It just works.
            </span>
          </h2>
          <div className="space-x-4">
            <Link
              href="https://github.com/nsbradford/talkformai" // Replace with your repo URL
              className="inline-block bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-gray-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} className="fa-fw text-white-400" /> View on GitHub
            </Link>
            <Link
              href="/home"
              className="inline-block bg-gradient-to-r from-yellow-400 via-pink-400 to-fuchsia-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:from-yellow-300 hover:via-pink-300 hover:to-fuchsia-400"
            >
              Create a form ›
            </Link>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// https://github.com/tailwindtoolbox/Landing-Page
function Footer() {
  return (
    <div className="mx-auto px-8 bg-gray-100 mt-20">
      <div className="w-full flex flex-col md:flex-row py-6">
        <div className="flex-1 mb-6 text-black">
          {/* <a className="text-pink-600 no-underline hover:no-underline font-bold text-2xl lg:text-4xl" href="#">
                
                TalkForm AI
          </a> */}
          <Link
            href="/"
            className="font-extrabold text-2xl lg:text-4xl my-8 inline-block bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent hover:no-underline"
          >
            TalkForm AI
          </Link>
        </div>
        <div className="flex-1">
          <p className="uppercase text-gray-500 md:mb-6">contact us</p>
          <ul className="list-reset mb-6">
            <li className="mt-2 inline-block mr-2 md:block md:mr-0">
              <a
                href="https://github.com/nsbradford/talkformai"
                className="no-underline hover:underline text-gray-800 hover:text-rose-500"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
