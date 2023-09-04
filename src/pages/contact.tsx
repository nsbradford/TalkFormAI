import NavBar2 from '@/components/home/NavBar2';
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
        <Team members={teamMembers} />
      </Page>
    </>
  );
}
