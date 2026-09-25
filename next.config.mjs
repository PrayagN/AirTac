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

  // Permanent (308) redirects for unindexed / removed blog posts back to /blog
  async redirects() {
    return [
      {
        source: '/blog/the-science-of-play-in-remote-workplaces',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/making-virtual-meetings-accessible-for-everyone',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/brief-history-of-gesture-technology',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/building-psychological-safety-in-remote-teams',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/how-remote-teams-use-gesture-games-to-boost-morale',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/top-5-icebreakers-for-zoom-and-google-meet-in-2026',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/neuroscience-of-micro-breaks-how-5-minute-games-restore-focus',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/rebuilding-company-culture-in-async-and-distributed-teams',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/the-evolution-of-pencil-and-paper-games-from-grid-puzzles-to-ai',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
