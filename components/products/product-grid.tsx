'use client'

import { ProductCard } from '@/components/ui/product-card'
import { PublicProductCard } from '@/types/public'

interface ProductGridProps {
  products: PublicProductCard[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((p) => (
        <ProductCard product={p} key={p.id} />
      ))}
    </div>
  )
}
