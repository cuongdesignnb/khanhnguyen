import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-be-vietnam',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Khanh Nguyen | Chuyên mua bán xe nâng, xe cẩu',
  description:
    'Xe nâng Nhật bãi, xe cẩu, phụ tùng và dịch vụ thiết bị nâng hạ. Uy tín – Chất lượng – Giá tốt nhất.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body>{children}</body>
    </html>
  )
}
