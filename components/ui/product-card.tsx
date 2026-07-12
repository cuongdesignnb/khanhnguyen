'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { ArrowRight, SlidersHorizontal } from 'lucide-react'
import { PublicProductCard } from '@/types/public'
import { selectProductSpecs, type NormalizedProductSpec } from '@/lib/products/normalize-product-specs'
import { useProductCardConfig } from '@/components/products/product-card-config-provider'
import WishlistButton from '../sales/wishlist-button'
import CompareButton from '../sales/compare-button'
import AddToCartButton from '../sales/add-to-cart-button'

interface ProductCardProps {
  product: PublicProductCard
  variant?: 'default' | 'compact' | 'horizontal'
  visibleSpecsLimit?: number
  hoverSpecsLimit?: number
  enableHoverSpecs?: boolean
  className?: string
}

const PLACEHOLDER_IMAGE = '/images/product-placeholder.svg'

const badgeColorMap: Record<string, string> = {
  'Mới': 'bg-[color:var(--gold)] text-[color:var(--bg)]',
  'Bán chạy': 'bg-[color:var(--danger)] text-white',
  'Giảm giá': 'bg-[color:var(--success)] text-[color:var(--bg)]',
}

function ProductCardQuickSpecs({ specs }: { specs: NormalizedProductSpec[] }) {
  return (
    <ul className="min-h-[66px] space-y-1.5" aria-label="Thông số nổi bật">
      {specs.map((spec) => (
        <li key={spec.key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-xs">
          <span className="truncate text-[color:var(--muted)]">{spec.label}</span>
          <span className="max-w-[130px] truncate text-right font-semibold text-[color:var(--silver)]">{spec.value}</span>
        </li>
      ))}
    </ul>
  )
}

function ProductCardHoverSpecs({ product, specs }: { product: PublicProductCard; specs: NormalizedProductSpec[] }) {
  return (
    <div className="product-card-hover-panel absolute inset-x-0 bottom-0 z-20 translate-y-full bg-black/90 px-4 pb-4 pt-3 opacity-0 backdrop-blur-md transition duration-300 pointer-events-none">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[color:var(--gold)]">
        <SlidersHorizontal size={14} aria-hidden="true" />
        Thông số nhanh
      </div>
      <dl className="space-y-1.5">
        {specs.map((spec) => (
          <div key={spec.key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-[11px]">
            <dt className="truncate text-neutral-400">{spec.label}</dt>
            <dd className="max-w-[145px] truncate text-right font-semibold text-white">{spec.value}</dd>
          </div>
        ))}
      </dl>
      <Link
        href={`/san-pham/${product.slug}`}
        className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[color:var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
      >
        Xem chi tiết <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  )
}

function ProductCardImage({
  product,
  hoverSpecs,
  showWishlist,
  showCompare,
  enableHoverSpecs,
  imageRatio,
}: {
  product: PublicProductCard
  hoverSpecs: NormalizedProductSpec[]
  showWishlist: boolean
  showCompare: boolean
  enableHoverSpecs: boolean
  imageRatio: '4:3' | '1:1' | '16:9'
}) {
  const initialImage = typeof product.image === 'string' && product.image.trim() ? product.image : PLACEHOLDER_IMAGE
  const [imageSrc, setImageSrc] = useState(initialImage)
  const ratioClass = imageRatio === '1:1' ? 'aspect-square' : imageRatio === '16:9' ? 'aspect-video' : 'aspect-[4/3]'

  return (
    <div className={clsx('relative overflow-hidden rounded-t-xl bg-neutral-900', ratioClass)}>
      <Link href={`/san-pham/${product.slug}`} aria-label={`Xem chi tiết ${product.name}`} className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={`Hình ảnh sản phẩm ${product.name}`}
          fill
          sizes="(max-width: 639px) 280px, (max-width: 1023px) 50vw, (max-width: 1535px) 33vw, 280px"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
          unoptimized={/^https?:\/\//i.test(imageSrc)}
          onError={() => imageSrc !== PLACEHOLDER_IMAGE && setImageSrc(PLACEHOLDER_IMAGE)}
        />
      </Link>

      {product.badge && (
        <span className={clsx('absolute left-3 top-3 z-30 max-w-[55%] truncate rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide', badgeColorMap[product.badge] || 'bg-[color:var(--gold)] text-black')}>
          {product.badge}
        </span>
      )}

      {(showWishlist || showCompare) && (
        <div className="absolute right-3 top-3 z-30 flex flex-col gap-2">
          {showWishlist && <WishlistButton productId={product.id} productName={product.name} />}
          {showCompare && <CompareButton productId={product.id} productName={product.name} />}
        </div>
      )}

      {enableHoverSpecs && hoverSpecs.length > 0 && <ProductCardHoverSpecs product={product} specs={hoverSpecs} />}
    </div>
  )
}

export function ProductCard({
  product,
  variant = 'default',
  visibleSpecsLimit,
  hoverSpecsLimit,
  enableHoverSpecs,
  className,
}: ProductCardProps) {
  const config = useProductCardConfig()
  const normalizedSpecs = product.specs as NormalizedProductSpec[]
  const visibleLimit = config.cardQuickSpecsEnabled
    ? Math.min(3, Math.max(0, visibleSpecsLimit ?? config.cardVisibleSpecsLimit))
    : 0
  const hoverLimit = Math.min(6, Math.max(3, hoverSpecsLimit ?? config.cardHoverSpecsLimit))
  const priority = config.cardPrioritySpecs?.length ? config.cardPrioritySpecs : undefined
  const visibleSpecs = selectProductSpecs(normalizedSpecs, visibleLimit, priority)
  const hoverSpecs = selectProductSpecs(normalizedSpecs, hoverLimit, priority)
  const showHover = (enableHoverSpecs ?? config.cardHoverSpecsEnabled) && hoverSpecs.length > 0

  return (
    <article className={clsx('group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[color:var(--surface-2)] transition-colors duration-300 hover:border-[color:var(--line-gold)] focus-within:border-[color:var(--line-gold)]', variant === 'compact' && 'text-sm', className)}>
      <ProductCardImage
        product={product}
        hoverSpecs={hoverSpecs}
        showWishlist={config.showWishlist}
        showCompare={config.showCompare}
        enableHoverSpecs={showHover}
        imageRatio={config.cardImageRatio}
      />

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <p className="truncate text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">{product.category}</p>
        <h3 className="min-h-[44px] text-base font-bold leading-snug text-[color:var(--text)] line-clamp-2">
          <Link href={`/san-pham/${product.slug}`} className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]">
            {product.name}
          </Link>
        </h3>

        {visibleLimit > 0 && <ProductCardQuickSpecs specs={visibleSpecs} />}

        <div className="mt-auto space-y-3 pt-1">
          {config.showPrice && <p className="truncate text-lg font-bold text-[color:var(--gold)]">{product.priceLabel}</p>}
          <div className="flex flex-col gap-2">
            {config.showQuoteButton && (
              <AddToCartButton productId={product.id} productName={product.name} variant="solid" className="w-full py-2 text-[10px] font-bold uppercase tracking-wider sm:text-xs" label="Thêm báo giá" />
            )}
            <Link href={`/san-pham/${product.slug}`} className="flex w-full items-center justify-center rounded-lg border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/5 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-[color:var(--gold)] transition-colors duration-200 hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)] sm:text-xs">
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
