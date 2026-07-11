import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { SalesProvider } from '@/components/sales/sales-provider'
import FloatingCartIndicator from '@/components/sales/floating-cart-indicator'
import TrackingScripts from '@/components/layout/tracking-scripts'
import { buildBaseMetadata } from '@/lib/seo/metadata'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-be-vietnam',
  display: 'swap',
  preload: true,
})

export async function generateMetadata(): Promise<Metadata> {
  return buildBaseMetadata()
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

