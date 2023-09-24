import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function GitHubBadge() {
  return (
    <div className='flex justify-center items-center bg-white text-black rounded-full w-24 h-24 hover:bg-gray-200 hover:text-gray-700'>
      <FontAwesomeIcon icon={faGithub} className='fa-fw' />
      <p className='text-center'>View on GitHub</p>
    </div>
  );
}