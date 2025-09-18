/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['cdn.bunnycdn.net', 'images.unsplash.com'],
  },
}

module.exports = nextConfig
