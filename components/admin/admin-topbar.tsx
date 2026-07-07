'use client'

import { Menu, Search, Bell, ChevronDown } from 'lucide-react'

interface AdminTopbarProps {
  onMenuToggle: () => void
}

export default function AdminTopbar({ onMenuToggle }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-black/70 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-[color:var(--muted)] hover:text-white transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="hidden sm:flex items-center bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2 gap-2 flex-1 max-w-sm mx-4">
        <Search className="w-4 h-4 text-[color:var(--muted)]" />
        <input
          type="text"
          placeholder="Tìm kiếm nhanh..."
          className="bg-transparent text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none flex-1"
        />
        <span className="flex items-center gap-1 text-[10px] text-[color:var(--muted)] bg-[color:var(--surface-3)] px-2 py-0.5 rounded-md">
          ⌘ K
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-white/5 text-[color:var(--muted)] hover:text-white transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[color:var(--danger)] text-white text-[10px] rounded-full flex items-center justify-center font-medium">
            5
          </span>
        </button>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[color:var(--gold)]/20 border border-[color:var(--gold)]/30 flex items-center justify-center">
            <span className="text-[color:var(--gold)] text-sm font-bold">A</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-white leading-tight">Admin</div>
            <div className="text-[10px] text-[color:var(--muted)]">Quản trị viên</div>
          </div>
          <ChevronDown className="w-4 h-4 text-[color:var(--muted)] hidden sm:block" />
        </div>
      </div>
    </header>
  )
}
