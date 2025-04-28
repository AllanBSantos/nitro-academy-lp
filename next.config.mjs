import createNextIntlPlugin from 'next-intl/plugin';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const strapiHostname = new URL(strapiUrl).hostname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    domains: [
      'localhost',
      'localhost:1337',
      strapiHostname,
      'nitroacademy.com.br'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: new URL(strapiUrl).protocol.replace(':', ''),
        hostname: strapiHostname,
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'nitroacademy.com.br',
        pathname: '/**',
      }
    ],
  },
  trailingSlash: true,

  webpack: (config) => {
    config.module.rules.push({
      test: /strapi\/.*/,
      use: "null-loader",
    });

    return config;
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
