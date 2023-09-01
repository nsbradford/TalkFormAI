import Link from 'next/link';

export function TalkFormLogo() {
  return (
    <Link
      href="/"
      className="font-extrabold text-xl lg:text-3xl my-8 inline-block bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent hover:no-underline"
    >
      TalkForm AI
    </Link>
  );
}
