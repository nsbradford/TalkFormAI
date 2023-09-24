import { Work_Sans } from 'next/font/google';

export const workSans = Work_Sans({
  weight: '400',
  subsets: ['latin'],
  // variable: '--font-inter',
});

export const workSansHeavy = Work_Sans({
  weight: '800',
  subsets: ['latin'],
  // variable: '--font-inter',
});

export const sunsetGradient =
  'bg-gradient-to-br from-indigo-200 via-red-200 to-yellow-100';
export const titleGradient = 'bg-gradient-to-r from-purple-600 to-blue-400';
export const titleGradientHover = 'hover:from-purple-500 hover:to-blue-300';
// const pinkGradient = 'from-yellow-400 via-pink-400 to-fuchsia-500';
// hover:from-yellow-300 hover:via-pink-300 hover:to-fuchsia-400

import ReactTooltip from 'react-tooltip';

export const Tooltip = ({ message, children }) => (
  <div>
    <ReactTooltip id='tooltip' place='top' effect='solid'>
      {message}
    </ReactTooltip>
    <div data-tip data-for='tooltip'>
      {children}
    </div>
  </div>
);