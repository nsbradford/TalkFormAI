import NavBar2 from '@/components/home/NavBar2';
import {
  ChatHistory,
  FloatingTextBox,
  SampleResponseTable
} from '@/components/landing/samples';
import {
  titleGradient,
  titleGradientHover,
  workSans,
  workSansHeavy
} from '@/components/misc';
import { TalkFormLogo } from '@/components/talkform';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <NavBar2 />
      <div className={`flex justify-center items-center mt-20`}>
        <div className="flex flex-col items-center justify-center">
          <h1
            className={`text-4xl font-extrabold pb-8 md:text-7xl ${titleGradient} bg-clip-text text-transparent text-center`}
          >
            Forms, reimagined.
          </h1>
          <h2
            className={`${workSansHeavy.className} text-xl font-extrabold mb-8 md:text-2xl px-12 text-center`}
          >
            Chat to create. Chat to fill. Zero config.{' '}
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
          className={`inline-block ${titleGradient} text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out ${titleGradientHover}`}
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
  return (
    <div className="flex flex-wrap mt-8 sm:mt-20">
      <div className="w-full sm:w-1/2 p-6">
        <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
          {props.heading}
        </h3>
        <p className="text-gray-600 pr-4">{props.content}</p>
      </div>
      <div className="w-full sm:w-1/2 p-2">{props.children}</div>
    </div>
  );
}
function SpecificsTextOnRight(props: {
  heading: string;
  content: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap flex-col-reverse sm:flex-row mt-8 sm:mt-20">
      <div className="w-full sm:w-1/2 p-2">{props.children}</div>
      <div className="w-full sm:w-1/2 p-6">
        <div className="align-middle">
          <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
            {props.heading}
          </h3>
          <p className="text-gray-600 pr-4">{props.content}</p>
        </div>
      </div>
    </div>
  );
}

function Specifics() {
  return (
    <section className={`${workSans.className} bg-white`}>
      <div className="container max-w-5xl mx-auto mt-8">
        <h2 className="w-full my-2 text-3xl sm:text-4xl font-bold leading-tight text-center text-gray-800">
          Faster, easier, more powerful.
        </h2>
        <SpecificsTextOnLeft
          heading="Chat to create."
          content="No more tedious form builders. The field types are inferred automatically by our AI."
        >
          <FloatingTextBox
            text={`Waitlist for my startup: name, email address, company, job title,
      and what technologies they currently use for marketing research.
      If they're a software engineer, ask for their GitHub.`}
          />
        </SpecificsTextOnLeft>
        <SpecificsTextOnRight
          heading="Chat to fill."
          content="Our AI automatically validates, cleans, structures, and fills the fields."
        >
          <ChatHistory
            messages={[
              'Thanks, Jane! Now, what is your company and job title?',
              `I'm a ML Engineer at Tech Co`,
              `Very cool! What's your GitHub?`,
              'https://github.com/jd-70B',
              `Thanks, I see your username is 'jd-70B'. Now, what technologies do you use when doing marketing research?`,
            ]}
          />
        </SpecificsTextOnRight>
        <SpecificsTextOnLeft
          heading="Keep your data structured."
          content="All your form responses remain structured according to the inferred schema for easy analysis."
        >
          <SampleResponseTable />
        </SpecificsTextOnLeft>
        <SpecificsTextOnRight
          heading="Unlimited power."
          content="Custom validations. Complicated conditional logic. If you can think it, we can do it."
        >
          <FloatingTextBox
            text={`VC coffee chat: name, email, startup name, stage, one-sentence pitch. If the pitch mentions crypto, politely end the convo. Translate their pitch to Spanish and French as well. If they're past seed, ask for valuation and $ raised at each stage. If they're an AI company, ask about their moat, and if you suspect they're a thin wrapper around OpenAI, add a secret flag.`}
          />
        </SpecificsTextOnRight>
        <hr className="border-gray-300 mx-auto w-3/4 mt-14" />
        <h2 className="w-full my-2 text-4xl font-bold leading-tight text-center text-gray-800 mt-12">
          Get started for free
        </h2>
      </div>
    </section>
  );
}
