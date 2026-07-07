import type { Metadata } from 'next'
import AdminShell from '@/components/admin/admin-shell'

export const metadata: Metadata = {
  title: 'Admin | Khanh Nguyên Forklift',
  description: 'Khu vực quản trị Khanh Nguyên Forklift',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
