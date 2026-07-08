import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://khanhnguyenforklift.vn'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin', '/tai-khoan', '/gio-hang'],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
  }
}
