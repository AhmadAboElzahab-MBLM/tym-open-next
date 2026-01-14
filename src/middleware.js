// // src/middleware.js

// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   const { pathname } = request.nextUrl;

//   // Explicit handling for favicon
//   if (pathname === '/favicon.ico') {
//     return NextResponse.next();
//   }

//   // Exclude certain paths from the middleware
//   if (
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/api') ||
//     pathname.startsWith('/static') ||
//     pathname.startsWith('/public') ||
//     pathname.startsWith('/robots.txt') ||
//     pathname.startsWith('/images')
//   ) {
//     return NextResponse.next();
//   }

//   // Check for region preference in cookies
//   const regionCookie = request.cookies.get('regionPreference');

//   // Define the list of regions
//   const regions = ['en-us', 'ko', 'en'];

//   // Split the pathname and get the first segment
//   const pathnameParts = pathname.split('/').filter(Boolean);
//   const firstPart = pathnameParts[0] || '';

//   // Check if the first part of the pathname is a region
//   const isOnRegionalPath = regions.includes(firstPart);

//   if (regionCookie || isOnRegionalPath) {
//     // User has a region preference or is already on a regional path
//     return NextResponse.next();
//   }
//   // Get country code from header or default
//   let country = request.headers.get('cf-ipcountry') || request.headers.get('x-country-code');

//   if (!country) {
//     const isDev = process.env.NODE_ENV === 'development';
//     if (isDev) {
//       country = 'KR';
//     } else {
//       country = ''; // Default country code in production if header is missing
//     }
//   }

//   let region = '';

//   // Map country code to region
//   if (country === 'US' || country === 'CA') {
//     region = 'en-us';
//   } else if (country === 'KR') {
//     region = 'ko';
//   } else {
//     region = 'en-us';
//   }

//   // Build the redirect URL
//   const url = request.nextUrl.clone();
//   url.pathname = `/${region}${pathname}`;
//   url.search = request.nextUrl.search;
//   url.hash = request.nextUrl.hash;

//   return NextResponse.redirect(url);
// }

// export const config = {
//   matcher: '/',
// };
