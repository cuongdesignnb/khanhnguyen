'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AdminSidebar from './admin-sidebar'
import AdminTopbar from './admin-topbar'
import { authClient } from '@/lib/auth-client'
import { AdminToastContainer } from './admin-toast'

interface AdminShellProps {
  children: React.ReactNode
}

export default function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    // Only enforce redirect in production mode, as development mode allows offline mock UI
    const isDev = process.env.NODE_ENV === 'development'
    if (!isPending && !session && !isDev && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [session, isPending, pathname, router])

  // Login page renders without shell chrome
  if (pathname === '/admin/login') {
    return (
      <>
        {children}
        <AdminToastContainer />
      </>
    )
  }

  // Render a loading spinner during session check (except in development)
  const isDev = process.env.NODE_ENV === 'development'
  if (isPending && !session && !isDev) {
    return (
      <div className="min-h-screen bg-[color:var(--bg)] flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-[color:var(--gold)]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[color:var(--bg)]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen">
        <AdminTopbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="px-4 sm:px-6 lg:px-8 py-4 border-t border-white/10 flex items-center justify-between text-xs text-[color:var(--muted)]">
          <span>© 2025 Khanh Nguyên Forklift. All rights reserved.</span>
          <span>Phiên bản 1.0.0</span>
        </footer>
      </div>
      <AdminToastContainer />
    </div>
  )
}
