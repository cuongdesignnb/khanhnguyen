import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import PublicPageShell from '@/components/public/public-page-shell'
import Breadcrumb from '@/components/public/breadcrumb'
import AccountSidebar from './account-sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tài khoản', robots: { index: false, follow: false, nocache: true } }

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/dang-nhap')
  }

  return (
    <PublicPageShell>
      <div className="bg-[color:var(--surface)] min-h-screen text-white">
        <Breadcrumb items={[{ label: 'Tài khoản', href: '/tai-khoan' }]} />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Sidebar navigation */}
            <aside className="lg:col-span-1">
              <AccountSidebar user={session.user} />
            </aside>

            {/* Dashboard content */}
            <main className="lg:col-span-3 bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-5 sm:p-8 min-h-[500px]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </PublicPageShell>
  )
}
