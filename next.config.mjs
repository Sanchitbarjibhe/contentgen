/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    inlineCss: true,
  },
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.hooktos.com" }],
        destination: "https://hooktos.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
