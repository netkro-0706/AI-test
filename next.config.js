/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yts.mx",
      },
    ],
  },
}

module.exports = nextConfig
