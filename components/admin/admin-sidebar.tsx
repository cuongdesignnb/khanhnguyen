'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'motion/react'
import { adminMenuItems } from '@/data/admin'
import {
  X,
  Home,
  Package,
  Folder,
  ShieldCheck,
  Wrench,
  Newspaper,
  Image as ImageIcon,
  Phone,
  ClipboardList,
  ShoppingCart,
  Settings,
  MessageSquare,
  Sparkles,
  History,
  Bot,
  Menu,
} from 'lucide-react'

const sidebarIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Package,
  Folder,
  ShieldCheck,
  Wrench,
  Newspaper,
  Image: ImageIcon,
  Phone,
  ClipboardList,
  ShoppingCart,
  Settings,
  MessageSquare,
  Sparkles,
  History,
  Bot,
  Menu,
}

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

function SidebarContent({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[color:var(--gold)] flex items-center justify-center">
            <span className="font-black text-black text-lg">K</span>
          </div>
          <div>
            <div className="text-lg font-bold text-[color:var(--gold)] leading-tight">KHANH NGUYÊN</div>
            <div className="text-[10px] tracking-[0.3em] text-[color:var(--muted)] uppercase">Forklift</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hidden">
        {adminMenuItems.map((item) => {
          const Icon = sidebarIcons[item.icon]
          const isActive =
            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={clsx(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200',
                isActive
                  ? 'bg-[color:var(--gold)]/10 text-[color:var(--gold)] border border-[color:var(--gold)]/20'
                  : 'text-[color:var(--muted)] hover:text-white hover:bg-white/5 border border-transparent',
              )}
            >
              {Icon && (
                <Icon className={clsx('w-[18px] h-[18px]', isActive ? 'text-[color:var(--gold)]' : '')} />
              )}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Brand Panel */}
      <div className="px-4 pb-4 mt-auto">
        <div className="relative rounded-2xl overflow-hidden h-44">
          <Image
            src="/images/seed/hero/forklift-warehouse.jpg"
            alt="Khanh Nguyen Forklift"
            fill
            className="object-cover opacity-30"
            sizes="280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-sm font-bold text-[color:var(--gold)]">KHANH NGUYÊN</div>
            <div className="text-[10px] text-white/70 tracking-wider mt-1">NÂNG TẦM HIỆU SUẤT</div>
            <div className="text-[10px] text-white/70 tracking-wider">XỨNG TẦM ĐỐI TÁC</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[280px] bg-[color:var(--bg)] border-r border-white/10 z-40 flex-col">
        <SidebarContent onClose={onClose} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            {/* Aside */}
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-[color:var(--bg)] border-r border-white/10 z-50 flex flex-col lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-[color:var(--muted)] hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
