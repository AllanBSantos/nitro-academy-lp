import createNextIntlPlugin from 'next-intl/plugin';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const strapiHostname = new URL(strapiUrl).hostname;
const zazuUrl = process.env.NEXT_PUBLIC_ZAZU_API_URL || 'http://localhost:3000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable caching for API routes
  experimental: {
    serverComponentsExternalPackages: [],
  },

  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${zazuUrl}/auth/:path*`,
      },
    ];
  },
  images: {
    unoptimized: false,
    domains: [
      'localhost',
      'localhost:1337',
      strapiHostname,
      'nitroacademy.com.br',
      'res.cloudinary.com',
      'images.converteai.net'
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
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dkzxwpuxf/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'images.converteai.net',
        pathname: '/**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
