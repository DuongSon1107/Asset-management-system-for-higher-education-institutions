/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['page.jsx', 'page.js', 'page.tsx', 'page.ts'],
  transpilePackages: ['@mui/x-charts']
}

module.exports = nextConfig
