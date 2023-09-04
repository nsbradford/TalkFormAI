import {
  ChatHistory,
  FloatingTextBox,
  SampleResponseTable,
} from '@/components/landing/samples';
import Page from '@/components/layout/Page';
import { workSans, workSansHeavy } from '@/components/misc';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Page pageTitle="Announcing: TalkForm AI" disableWarning={true}>
        <div className="bg-white text-gray-700 flex items-center justify-center p-4">
          <div className={`${workSans.className} prose prose-lg text-gray-800`}>
            <p>
              Forms are ready to be reinvented.{' '}
              <Link className="text-indigo-500 hover:text-indigo-300" href="/">
                TalkForm AI
              </Link>
              {` is here to give you forms that are easy, fast, and as powerful as your imagination. And it's completely`}{' '}
              <Link
                className="text-indigo-500 hover:text-indigo-300"
                href="https://github.com/nsbradford/talkformai"
              >
                open source
              </Link>
              !
            </p>
            <p>
              Creating a TalkForm is as simple as asking for what you want, and
              letting the AI infer the field types:
            </p>
            <FloatingTextBox
              text={`Waitlist for my startup: name, email address, company, job title,
      and what technologies they currently use for marketing research.
      If they're a software engineer, ask for their GitHub.`}
            />

            <p>To fill the form, users just need to type in their responses:</p>
            <ChatHistory
              messages={[
                'Thanks, Jane! Now, what is your company and job title?',
                `I'm a ML Engineer at Tech Co`,
              ]}
            />

            <p>
              All your form responses remain structured according to the
              inferred schema for easy analysis:
            </p>
            <SampleResponseTable />

            <p className="">
              And you get unlimited power to do custom/complicated logic, all
              with minimal effort! Here are some examples:
            </p>

            <h2 className="mt-20 text-2xl">Data cleaning/extraction</h2>
            <p>
              TalkForm understand the semantics of what you&rsquo;re asking for,
              so it&rsquo;s easy to make sure you&rsquo;re always getting the
              right data:
            </p>
            <ChatHistory
              messages={[
                `What is your GitHub username?`,
                `it's https://github.com/nsbradford`,
                `Great, I see your GitHub username is 'nsbradford'.`,
              ]}
            />

            <h2 className="mt-20 text-2xl">Custom validations</h2>
            <p>
              Some concepts are impossible to specify with existing forms, but
              easy in natural language:
            </p>
            <ChatHistory
              messages={[
                `What's your favorite action movie?`,
                `Tom Cruise`,
                `Sorry, I think you may be thinking of your favorite action movie star. Please enter a movie title.`,
                `edg of tomorrow`,
                `Nice choice! The science fiction action film "Edge of Tomorrow" (2014), also known as "Live Die Repeat" or "All You Need Is Kill", is an underrated gem.`,
              ]}
            />

            <h2 className="mt-20 text-2xl">Asking follow-up questions</h2>
            <p>
              Sometimes you might want to dig deeper into a particular area:
            </p>
            <ChatHistory
              messages={[
                'What kind of frontend web technologies do you use?',
                `react, css`,
                `Very cool! Are there any particular React libraries or frameworks you use?`,
              ]}
            />

            <h2 className="mt-20 text-2xl">Conditional logic</h2>
            <p>Having fields depend on other fields has never been simpler:</p>
            <FloatingTextBox
              text={`Intake form. Ask for name, address, date of birth. If they're Gen Z, ask for their favorite TikTok. They'll love that.`}
            />

            <h2 className="mt-20 text-2xl">What are you waiting for?</h2>

            <p>
              You can sign up now for free, or view the code on{' '}
              <a
                className="text-indigo-500 hover:text-indigo-300"
                href="https://github.com/nsbradford/talkformai"
              >
                GitHub
              </a>
              ! If you have any questions or want to get in touch, we&rsquo;d
              love to hear from you -{' '}
              <Link
                className="text-indigo-500 hover:text-indigo-300"
                href="/contact"
              >
                contact us here
              </Link>
              !
            </p>
          </div>
        </div>
        <div className="my-20"></div>
      </Page>
    </>
  );
}
