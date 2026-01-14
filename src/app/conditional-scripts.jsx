"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function ConditionalScripts() {
  const pathname = usePathname();
  const shouldIncludeScript = pathname.includes('en-ko') || pathname.includes('ko');

  if (!shouldIncludeScript) return null;

  return (
    <>
      <Script src="//wcs.naver.net/wcslog.js" strategy="afterInteractive" />
      <Script id="naver-inline-script" strategy="afterInteractive">
        {`
          if (!window.wcs_add) window.wcs_add = {};
          window.wcs_add["wa"] = "9aab9f779f6710";
          if (window.wcs) {
            window.wcs_do();
          }
        `}
      </Script>
    </>
  );
}
