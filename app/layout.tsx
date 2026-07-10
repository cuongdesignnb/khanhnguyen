import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { SalesProvider } from '@/components/sales/sales-provider'
import FloatingCartIndicator from '@/components/sales/floating-cart-indicator'
import TrackingScripts from '@/components/layout/tracking-scripts'
import { defaultSettings } from '@/data/default-settings'
import { getSettingsByGroup } from '@/lib/settings'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-be-vietnam',
  display: 'swap',
  preload: true,
})

export async function generateMetadata(): Promise<Metadata> {
  const [seo, tracking] = await Promise.all([
    getSettingsByGroup('seo.default', defaultSettings.seoDefault),
    getSettingsByGroup('integrations.tracking', defaultSettings.integrationsTracking),
  ])
  return {
    title: { default: seo.defaultTitle, template: seo.titleTemplate },
    description: seo.defaultDescription,
    keywords: seo.defaultKeywords,
    metadataBase: seo.canonicalUrl ? new URL(seo.canonicalUrl) : undefined,
    openGraph: { title: seo.ogTitle || seo.defaultTitle, description: seo.ogDescription || seo.defaultDescription },
    twitter: { card: seo.twitterCard as 'summary' | 'summary_large_image' },
    robots: { index: seo.robotsIndex, follow: seo.robotsFollow },
    verification: { google: tracking.googleSearchConsoleCode || undefined },
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body>
        <SalesProvider>
          {children}
          <FloatingCartIndicator />
          <TrackingScripts />
        </SalesProvider>
      </body>
    </html>
  )
}

