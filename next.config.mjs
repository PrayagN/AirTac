/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable gzip/brotli compression on responses
  compress: true,

  images: {
    // Use modern formats for best compression
    formats: ['image/avif', 'image/webp'],
    // Minimum TTL for cached optimized images (1 week)
    minimumCacheTTL: 604800,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },

  // Minimize JS bundle in production (default in Next.js 16, no flag needed)
};

export default nextConfig;
