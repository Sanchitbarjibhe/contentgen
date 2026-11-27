/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    inlineCss: true,
  },
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/blogs",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/ai-content-strategies-for-saas",
        destination: "/blog/ai-content-generation-blog-seo-optimization-guide",
        permanent: true,
      },
      {
        source: "/blog/how-to-hook-viewers-in-3-seconds",
        destination: "/blog/short-form-content-strategy",
        permanent: true,
      },
      {
        source: "/blog/how-to-use-ai-prompt-for-seo",
        destination: "/blog/how-to-use-ai-prompts-for-seo",
        permanent: true,
      },
      {
        source: "/blog/monetize-small-audience",
        destination: "/blog/monetize-a-small-audience",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
