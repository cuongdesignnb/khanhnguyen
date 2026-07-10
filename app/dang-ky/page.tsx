import PublicPageShell from '@/components/public/public-page-shell'
import RegisterForm from './register-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản | Khanh Nguyên Forklift',
  description: 'Tạo tài khoản mới tại Khanh Nguyên Forklift để quản lý yêu cầu báo giá và đơn hàng.',
}

export default function RegisterPage() {
  return (
    <PublicPageShell>
      <RegisterForm />
    </PublicPageShell>
  )
}
