import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng nhập | Khanh Nguyên Forklift',
  description: 'Đăng nhập khu vực quản trị Khanh Nguyên Forklift',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
