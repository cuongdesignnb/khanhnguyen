'use client'

import { ProductCard } from '@/components/ui/product-card'
import { PublicProductCard } from '@/types/public'
import Link from 'next/link'

interface RelatedProductsProps {
  products: PublicProductCard[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null

  return (
    <section aria-label="Sản phẩm liên quan" className="space-y-6">
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
          SẢN PHẨM LIÊN QUAN
        </h2>
        <Link
          href="/san-pham"
          className="text-sm font-semibold text-[color:var(--gold)] hover:text-[color:var(--gold-strong)] transition-colors flex items-center gap-1"
        >
          <span>Xem tất cả sản phẩm</span>
          <span>&rarr;</span>
        </Link>
      </div>
      
      {/* Grid: desktop 4 columns, tablet 2, mobile 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard product={p} key={p.id} />
        ))}
      </div>
    </section>
  )
}
