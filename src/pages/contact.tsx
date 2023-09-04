import Team from '@/components/landing/Team';
import Page from '@/components/layout/Page';

const teamMembers = [
  {
    name: 'Nick Bradford',
    image: 'https://avatars.githubusercontent.com/u/6633811',
    subtitle: 'Building LLM agents',
    website: 'nsbradford.com',
    socials: {
      twitter: 'https://twitter.com/n_s_bradford',
      linkedIn: 'https://linkedin.com/in/nsbradford',
      github: 'https://github.com/nsbradford',
    },
  },
  {
    name: 'Hunter Brooks',
    subtitle: 'Building virtual teammates for developers',
    website: 'bitbuilder.ai',
    image: 'https://avatars.githubusercontent.com/u/24214708',
    socials: {
      twitter: 'https://twitter.com/HunterFromNYC',
      linkedIn: 'https://linkedin.com/in/seanhunterbrooks',
      github: 'https://github.com/hbrooks',
    },
  },
];

export default function contact() {
  return (
    <>
      <Page pageTitle="Contact the team" disableWarning={true}>
        <p className="text-center">
          Feel free to{' '}
          <a
            href="mailto:nsbradford@gmail.com,hunter@bitbuilder.ai"
            className="text-indigo-500 hover:text-indigo-300"
          >
            email us
          </a>
          , or reach out:
        </p>
        <Team members={teamMembers} />
      </Page>
    </>
  );
}
