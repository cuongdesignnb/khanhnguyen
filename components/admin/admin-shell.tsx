'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from './admin-sidebar'
import AdminTopbar from './admin-topbar'

interface AdminShellProps {
  children: React.ReactNode
}

export default function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Login page renders without shell chrome
  if (pathname === '/admin/login') {
    return <>{children}</>
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
    </div>
  )
}
