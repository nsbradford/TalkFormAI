import { NavBar } from '@/components/home/NavBar';
import { TalkFormLogo } from '@/components/talkform';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Work_Sans } from 'next/font/google';
import Link from 'next/link';

export const workSans = Work_Sans({
  weight: '400',
  subsets: ['latin'],
  // variable: '--font-inter',
});

const sunsetGradient =
  'bg-gradient-to-br from-indigo-200 via-red-200 to-yellow-100';
const titleGradient = 'bg-gradient-to-r from-purple-600 to-blue-400';
const pinkGradient = 'from-yellow-400 via-pink-400 to-fuchsia-500';

export default function Home() {
  return (
    <>
      <NavBar getAvatar={() => <></>} userNavigation={[]} props={{}} />
      <div className={`flex justify-center items-center mt-20`}>
        <div className="flex flex-col items-center justify-center">
          <h1
            className={`text-4xl font-extrabold pb-8 md:text-7xl ${titleGradient} bg-clip-text text-transparent`}
          >
            Forms, reimagined.
          </h1>
          <h2 className="text-xl font-extrabold mb-8 md:text-2xl">
            Chat to create. Chat to fill. Zero configuration.{' '}
            <span className={`${titleGradient} bg-clip-text text-transparent`}>
              It just works.
            </span>
          </h2>
          <GetStartedButtons />
          <hr className="border-gray-300 mx-auto w-3/4 mt-20 mb-8" />
          <Specifics />
          <GetStartedButtons />
        </div>
      </div>
      <Footer />
    </>
  );
}

function GetStartedButtons() {
  return (
    <>
      <div className="space-x-4">
        <Link
          href="https://github.com/nsbradford/talkformai" // Replace with your repo URL
          className="inline-block bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-gray-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} className="fa-fw text-white-400" />{' '}
          View on GitHub
        </Link>
        <Link
          href="/home"
          className={`inline-block ${titleGradient} text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:from-yellow-300 hover:via-pink-300 hover:to-fuchsia-400`}
        >
          Create a form ›
        </Link>
      </div>
    </>
  );
}

// https://github.com/tailwindtoolbox/Landing-Page
function Footer() {
  return (
    <div className="mx-auto px-8 bg-gray-100 mt-20">
      <div className="w-full flex flex-col md:flex-row py-6">
        <div className="flex-1 mb-6 text-black">
          <TalkFormLogo />
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

function SpecificsTextOnLeft(props: {
  heading: string;
  content: string;
  children: React.ReactNode;
}) {
  const text =
    "Waitlist form: name, email address, company, job title, and what technologies they currently use for marketing research. If they're any kind of software engineer, ask for their GitHub.";
  return (
    // <div className="flex flex-wrap">
    <div className="flex flex-wrap">
      <div className="w-full sm:w-1/2 p-6">
        <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
          {props.heading}
        </h3>
        <p className="text-gray-600 mb-8 pr-4">{props.content}</p>
      </div>
      <div className="w-full sm:w-1/2">{props.children}</div>
    </div>
  );
}
function SpecificsTextOnRight(props: { heading: string; content: string }) {
  return (
    <div className="flex flex-wrap flex-col-reverse sm:flex-row">
      <div className="w-full sm:w-1/2 p-6 mt-6"></div>
      <div className="w-full sm:w-1/2 p-6 mt-6">
        <div className="align-middle">
          <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
            {props.heading}
          </h3>
          <p className="text-gray-600 mb-8">
            {props.content}
            <br />
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}

function Specifics() {
  return (
    <section className={`${workSans.className} bg-white`}>
      <div className="container max-w-5xl mx-auto m-8">
        <h2 className="w-full my-2 text-4xl font-bold leading-tight text-center text-gray-800">
          Faster, easier, more powerful.
        </h2>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
        </div>
        <SpecificsTextOnLeft
          heading="Chat to create."
          content="No more tedious form builders. The field types are inferred automatically by our AI."
        >
          <div className={` ${sunsetGradient}  p-6 rounded-xl shadow-xl`}>
            <div className="bg-white p-4 rounded-lg shadow-xl text-sm text-gray-400">
              Waitlist for my startup: name, email address, company, job title,
              and what technologies they currently use for marketing research.
              If they&rsquo;re any kind of software engineer, ask for their
              GitHub.
            </div>
          </div>
        </SpecificsTextOnLeft>
        <SpecificsTextOnRight
          heading="Chat to fill."
          content="Our AI automatically validates, cleans, structures, and fills the fields."
        />
        <SpecificsTextOnLeft
          heading="Power you've never seen."
          content="Custom validations. Complicated conditional logic. If you can think it, we can do it."
        >{ }</SpecificsTextOnLeft>
        <SpecificsTextOnRight
          heading="Keep your data structured."
          content="All your form responses remain structured according to the inferred schema for easy analysis."
        />
        <hr className="border-gray-300 mx-auto w-3/4 mt-14" />
        <h2 className="w-full my-2 text-4xl font-bold leading-tight text-center text-gray-800 mt-12">
          Get started for free
        </h2>
      </div>
    </section>
  );
}
