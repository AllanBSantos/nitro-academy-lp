import createNextIntlPlugin from 'next-intl/plugin';
/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: "export",
  images: { unoptimized: true },
  trailingSlash: true
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);