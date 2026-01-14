/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  async redirects() {
    return [
      {
        source:
          '/:path((?!en|en-us|ko|en-ko|[a-z]{2}-[a-z]{2}|dealers|search|location|get-ip|sitemap|robots|favicon|download|location-icon|api|$).*)',
        destination: '/en-us/:path*',
        permanent: false,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.umbraco.io',
      },
      {
        protocol: 'https',
        hostname: 'dev-tym-new.euwest01.umbraco.io',
      },
      {
        protocol: 'https',
        hostname: 'stage-tym-new.euwest01.umbraco.io',
      },
      {
        protocol: 'https',
        hostname: 'tym-new.euwest01.umbraco.io',
      },
      {
        protocol: 'https',
        hostname: 'tym-next.pages.dev',
      },
      {
        protocol: 'https',
        hostname: '8804541.fs1.hubspotusercontent-na1.net',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  staticPageGenerationTimeout: 10000,
  reactStrictMode: false,
  webpack: (config) => {
    config.plugins = config.plugins || [];

    config.optimization.providedExports = true;

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
module.exports = nextConfig;
