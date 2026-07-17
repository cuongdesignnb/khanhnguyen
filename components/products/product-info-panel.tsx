'use client'

import { PublicProductDetail } from '@/types/public'
import { getProductCategoryHref } from '@/lib/products/category-url'
import { Phone, MessageSquare, FileText } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import WishlistButton from '../sales/wishlist-button'
import CompareButton from '../sales/compare-button'

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

  const quickSpecs = [
    { label: 'Tải trọng', value: product.capacity, icon: '🏋️' },
    { label: 'Chiều cao nâng', value: product.liftHeight, icon: '↕️' },
    { label: 'Năm SX', value: product.manufactureYear, icon: '📅' },
    { label: 'Nhiên liệu', value: product.fuelType, icon: '⚡' },
    { label: 'Càng nâng', value: product.forkLength, icon: '🥢' },
    { label: 'Tình trạng', value: product.condition, icon: '🔧' },
    { label: 'Xuất xứ', value: product.origin, icon: '🌏' },
  ].filter(spec => spec.value)

  return (
    <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Category + Brand + Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={getProductCategoryHref(product.categorySlug)}
          className="text-xs font-bold uppercase tracking-wider text-[color:var(--gold)] bg-[color:var(--gold)]/10 border border-[color:var(--gold)]/30 px-3 py-1 rounded"
        >
          {product.categoryName}
        </Link>
        {product.brandName && (
          <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--silver)] border border-white/10 px-3 py-1 rounded bg-white/5">
            {product.brandName}
          </span>
        )}
        {product.badge && (
          <span className="text-xs font-bold uppercase tracking-wider text-black bg-[color:var(--gold-strong)] px-3 py-1 rounded">
            {product.badge}
          </span>
        )}
        {product.isBestSeller && (
          <span className="text-xs font-bold uppercase tracking-wider text-white bg-red-600 px-3 py-1 rounded">
            Bán chạy
          </span>
        )}
        <span className={clsx('text-xs font-bold px-3 py-1 rounded border uppercase tracking-wider', stock.color)}>
          {stock.label}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight uppercase tracking-tight">
        {product.name}
      </h1>

      {/* Model & SKU */}
      <div className="flex gap-6 text-xs text-[color:var(--muted)]">
        {product.model && (
          <div className="flex items-center gap-1.5">
            <span>Model:</span>
            <span className="text-white font-semibold">{product.model}</span>
          </div>
        )}
        {product.sku && (
          <div className="flex items-center gap-1.5">
            <span>Mã SKU:</span>
            <span className="text-white font-semibold">{product.sku}</span>
          </div>
        )}
      </div>

      {/* Price section */}
      <div className="pt-4 border-t border-white/5">
        <span className="text-xs text-[color:var(--muted)] font-medium">Giá bán hoặc thuê dự kiến:</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl sm:text-4xl font-black text-[color:var(--gold)]">
            {product.priceLabel}
          </span>
          <span className="text-xs text-[color:var(--muted)]">(Đã bao gồm VAT)</span>
        </div>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-sm text-[color:var(--silver)] leading-relaxed bg-black/35 p-4 rounded-xl border border-white/5">
          {product.shortDescription}
        </p>
      )}

      {/* Quick Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {quickSpecs.map((spec, idx) => (
          <div
            key={idx}
            className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-[10px] text-[color:var(--muted)] uppercase font-semibold">
              <span className="text-xs">{spec.icon}</span>
              <span>{spec.label}</span>
            </div>
            <span className="text-sm font-bold text-white mt-1 truncate">
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* Primary CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5">
        <a
          href="#quote-form"
          className="flex items-center justify-center gap-2 bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black font-extrabold py-2.5 px-3 rounded-lg transition-all duration-300 text-[11px] sm:text-xs sm:col-span-1 shadow-lg shadow-[color:var(--gold)]/10 uppercase tracking-wider"
        >
          <FileText size={14} />
          <span>NHẬN BÁO GIÁ</span>
        </a>

        <a
          href="tel:0903385225"
          className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 bg-white/5 text-white font-extrabold py-2.5 px-3 rounded-lg transition-colors text-[11px] sm:text-xs uppercase tracking-wider"
        >
          <Phone size={14} className="text-[color:var(--gold)]" />
          <span>GỌI HOTLINE</span>
        </a>

        <a
          href="https://zalo.me/0903385225"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 bg-white/5 text-white font-extrabold py-2.5 px-3 rounded-lg transition-colors text-[11px] sm:text-xs uppercase tracking-wider"
        >
          <MessageSquare size={14} className="text-sky-400" />
          <span>CHAT ZALO</span>
        </a>
      </div>

      {/* Sub-actions: Wishlist & Compare */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <WishlistButton
          productId={product.id}
          productName={product.name}
          showText
          className="py-2 bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-[11px] sm:text-xs font-bold rounded-lg transition-colors"
        />
        <CompareButton
          productId={product.id}
          productName={product.name}
          showText
          className="py-2 bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-[11px] sm:text-xs font-bold rounded-lg transition-colors"
        />
      </div>
    </div>
  )
}
