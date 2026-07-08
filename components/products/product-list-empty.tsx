'use client'

import { SearchX, Phone, MessageSquare } from 'lucide-react'

interface ProductListEmptyProps {
  onClear: () => void
}

export default function ProductListEmpty({ onClear }: ProductListEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-white/5 bg-[color:var(--surface-2)] rounded-xl">
      <div className="flex items-center justify-center size-14 rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)] mb-4">
        <SearchX size={28} />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">Không tìm thấy sản phẩm</h3>
      <p className="text-sm text-[color:var(--muted)] max-w-md mb-6">
        Chúng tôi chưa tìm thấy xe nâng nào phù hợp với bộ lọc tìm kiếm của bạn. Hãy thử thay đổi bộ lọc hoặc liên hệ trực tiếp với chúng tôi để được tư vấn nhập khẩu.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onClear}
          className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-sm font-bold transition"
        >
          Xóa bộ lọc
        </button>

        <a
          href="tel:0903385225"
          className="flex items-center gap-2 px-5 py-2.5 bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black rounded-lg text-sm font-bold transition"
        >
          <Phone size={15} />
          <span>Gọi tư vấn</span>
        </a>

        <a
          href="https://zalo.me/0903385225"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 border border-[color:var(--gold)] text-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-black rounded-lg text-sm font-bold transition"
        >
          <MessageSquare size={15} />
          <span>Chat Zalo</span>
        </a>
      </div>
    </div>
  )
}
