import Script from 'next/script';

export const GoogleAnalytics = ({
  GA_TRACKING_ID,
}: {
  GA_TRACKING_ID: string | undefined;
}) => {
  if (!GA_TRACKING_ID) {
    throw new Error('GA_TRACKING_ID is not defined');
  } else {
    console.log('Google Analytics is setup.');
  }
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
        window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
