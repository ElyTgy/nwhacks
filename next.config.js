/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.scdn.co'],
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