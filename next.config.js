/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This will allow all domains - you might want to restrict this to specific domains
      },
    ],
  },
  reactStrictMode: true,
  experimental: {
    ppr: false,
    taint: false,
    useDeploymentId: false,
    useDeploymentIdServerActions: false,
    strictNextHead: false,
    staticIndicator: false,
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  devIndicators: {
    buildActivityPosition: false,
    staticIndicator: false,
  },
}

module.exports = nextConfig