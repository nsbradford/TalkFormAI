interface TeamMember {
  name: string;
  image: string;
  subtitle?: string;
  website?: string;
  socials: {
    twitter?: string;
    linkedIn?: string;
    github?: string;
  };
}

export default TeamMember;
