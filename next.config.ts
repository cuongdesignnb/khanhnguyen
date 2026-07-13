import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // Proxy buffers request bodies before Route Handlers. Keep this above the
    // application upload limit (20 MB in production) so the handler can return
    // a clear validation error instead of receiving truncated multipart data.
    proxyClientMaxBodySize: '25mb',
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' }],
  },
};

export default nextConfig;
