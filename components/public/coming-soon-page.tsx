'use client'

import PageHero from '@/components/public/page-hero'
import Breadcrumb from '@/components/public/breadcrumb'
import { Hammer, Phone, MessageSquare, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ComingSoonPageProps {
  title: string
  subtitle?: string
}

export default function ComingSoonPage({ title, subtitle }: ComingSoonPageProps) {
  return (
    <div className="bg-[color:var(--surface)] min-h-screen text-white pb-16">
      <PageHero title={title} subtitle={subtitle || 'Hệ thống đang được nâng cấp hoàn thiện'} />
      <Breadcrumb items={[{ label: title }]} />

      <div className="max-w-md mx-auto px-4 text-center mt-12 sm:mt-16">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)] mb-6 animate-pulse">
          <Hammer size={32} />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white mb-3">TÍNH NĂNG ĐANG ĐƯỢC HOÀN THIỆN</h2>
        <p className="text-sm text-[color:var(--muted)] mb-8 leading-relaxed">
          Trang <strong>{title}</strong> hiện đang được đội ngũ kỹ thuật nâng cấp dữ liệu. Để biết thêm chi tiết hoặc cần hỗ trợ nhanh, quý khách vui lòng liên hệ trực tiếp với chúng tôi.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="tel:0903385225"
            className="flex items-center justify-center gap-2 w-full bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black font-bold py-3 rounded-lg transition"
          >
            <Phone size={16} />
            <span>Gọi tư vấn ngay: 0903 385 225</span>
          </a>

          <a
            href="https://zalo.me/0903385225"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-[color:var(--gold)] text-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-black font-bold py-3 rounded-lg transition"
          >
            <MessageSquare size={16} />
            <span>Liên hệ qua Zalo</span>
          </a>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg transition text-sm mt-2"
          >
            <ArrowLeft size={16} />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
