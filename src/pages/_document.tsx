import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <GoogleAnalytics
          GA_TRACKING_ID={process.env.NEXT_PUBLIC_GA_TRACKING_ID}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
