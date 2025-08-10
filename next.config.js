/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
