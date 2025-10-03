/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  transpilePackages: ['@radix-ui/react-progress', 'lucide-react'],
};

module.exports = nextConfig;
