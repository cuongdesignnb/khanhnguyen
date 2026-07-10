import PublicPageShell from '@/components/public/public-page-shell'
import LoginForm from './login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng nhập khách hàng | Khanh Nguyên Forklift',
  description: 'Đăng nhập vào tài khoản của bạn tại Khanh Nguyên Forklift để quản lý báo giá và đơn hàng.',
}

export default function LoginPage() {
  return (
    <PublicPageShell>
      <LoginForm />
    </PublicPageShell>
  )
}
