'use client'

import { PublicProductDetail } from '@/types/public'
import { Phone, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

interface ProductInfoPanelProps {
  product: PublicProductDetail
}

const stockStatusMap = {
  IN_STOCK: { label: 'Còn hàng', color: 'text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/30' },
  OUT_OF_STOCK: { label: 'Hết hàng', color: 'text-[color:var(--danger)] bg-[color:var(--danger)]/10 border-[color:var(--danger)]/30' },
  CONTACT: { label: 'Liên hệ', color: 'text-[color:var(--gold)] bg-[color:var(--gold)]/10 border-[color:var(--gold)]/30' },
  SOLD: { label: 'Đã bán', color: 'text-[color:var(--muted)] bg-white/5 border-white/10' },
}

export default function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const stock = stockStatusMap[product.stockStatus] || stockStatusMap.CONTACT

  return (
    <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 sm:p-6 space-y-5">
      {/* Category + Brand */}
      <div className="flex items-center gap-3">
        <Link
          href={`/${product.categorySlug}`}
          className="text-xs font-semibold uppercase tracking-wider text-[color:var(--gold)] hover:underline"
        >
          {product.categoryName}
        </Link>
        {product.brandName && (
          <>
            <span className="text-white/20">|</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--silver)]">
              {product.brandName}
            </span>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight uppercase">
        {product.name}
      </h1>

      {/* Model & SKU */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        {product.model && (
          <div className="flex flex-col">
            <span className="text-[color:var(--muted)] font-medium">Model:</span>
            <span className="text-white font-bold mt-0.5">{product.model}</span>
          </div>
        )}
        {product.sku && (
          <div className="flex flex-col">
            <span className="text-[color:var(--muted)] font-medium">Mã SKU:</span>
            <span className="text-white font-bold mt-0.5">{product.sku}</span>
          </div>
        )}
      </div>

      {/* Price & Stock Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-xs text-[color:var(--muted)] font-medium">Giá sản phẩm:</span>
          <span className="text-2xl sm:text-3xl font-black text-[color:var(--gold)] mt-0.5">
            {product.priceLabel}
          </span>
        </div>

        <span className={clsx('text-xs font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider', stock.color)}>
          {stock.label}
        </span>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-sm text-[color:var(--silver)] leading-relaxed pt-2 border-t border-white/5">
          {product.shortDescription}
        </p>
      )}

      {/* Quick Action CTA Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
        <a
          href="tel:0903385225"
          className="flex items-center justify-center gap-2 w-full bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black font-bold py-3 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
        >
          <Phone size={16} />
          <span>GỌI HOTLINE: 0903 385 225</span>
        </a>

        <a
          href="https://zalo.me/0903385225"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full border border-[color:var(--gold)] text-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-black font-bold py-3 rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
        >
          <MessageSquare size={16} />
          <span>CHAT QUA ZALO</span>
        </a>
      </div>
    </div>
  )
}
