import './globals.css';
import React from 'react';
import Script from 'next/script';
import ScrollToTop from '@/components/layout/scroll-to-top';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="naver-site-verification" content="2540df77f2ef2a1c66585eb9179306a30d3fe102" />
        <link rel="icon" href="https://tym.world/favicon.ico" />
        <link rel="shortcut icon" href="https://tym.world/favicon.ico" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="stylesheet" href="https://use.typekit.net/afj7ukt.css" />
        <Script
          type="text/javascript"
          src="//wcs.naver.net/wcslog.js"
          strategy="beforeInteractive"
        />
        <Script type="text/javascript" id="wcs-inline-script" strategy="beforeInteractive">
          {`if(!wcs_add) var wcs_add = {};
        wcs_add["wa"] = "9aab9f779f6710";
        if(window.wcs) {
        wcs_do();
        }`}
        </Script>
        <link rel="stylesheet" href="https://use.typekit.net/afj7ukt.css" />
      </head>
      <body suppressHydrationWarning>
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
