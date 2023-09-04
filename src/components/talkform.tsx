import Link from 'next/link';
import { titleGradient, titleGradientHover } from './misc';

export function TalkFormLogo() {
  return (
    <Link
      href="/"
      className={`font-extrabold text-2xl lg:text-3xl my-8 inline-block bg-gradient-to-r ${titleGradient} ${titleGradientHover} bg-clip-text text-transparent hover:no-underline`}
    >
      TalkForm AI
    </Link>
  );
}
