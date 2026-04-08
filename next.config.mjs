/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'cdn.simpleicons.org' },
    ],
  },
  // Reduce memory usage during dev
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "img-src 'self' https://cdn.simpleicons.org data: blob:;"
          }
        ]
      }
    ]
  }
};

export default nextConfig;
