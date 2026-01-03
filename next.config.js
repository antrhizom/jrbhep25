/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Vercel-optimierte Konfiguration
  swcMinify: true,
  
  // Bildoptimierung
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'padlet.com',
      // Weitere externe Domains hier hinzufügen
    ],
    formats: ['image/avif', 'image/webp']
  },
  
  // Environment-Variablen Validierung
  env: {
    NEXT_PUBLIC_APP_NAME: 'Jahresrückblick 2025',
    NEXT_PUBLIC_APP_VERSION: '1.0.0'
  },
  
  // Redirect für root zur Login-Seite (optional)
  async redirects() {
    return []
  },
  
  // Headers für Security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  
  // Webpack-Konfiguration (falls nötig)
  webpack: (config, { isServer }) => {
    // Weitere Webpack-Anpassungen hier
    return config
  }
}

module.exports = nextConfig
