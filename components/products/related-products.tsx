'use client'

import { ProductCard } from '@/components/ui/product-card'
import { PublicProductCard } from '@/types/public'
import { SectionHeading } from '@/components/ui/section-heading'

interface RelatedProductsProps {
  products: PublicProductCard[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section aria-label="Sản phẩm tương tự">
      <SectionHeading title="SẢN PHẨM TƯƠNG TỰ" />
      
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
        {products.map((p) => (
          <ProductCard product={p} key={p.id} />
        ))}
      </div>
    </section>
  )
}
