'use client'

import { ProductCard } from '@/components/ui/product-card'
import { PublicProductCard } from '@/types/public'

interface ProductGridProps {
  products: PublicProductCard[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard product={p} key={p.id} />
      ))}
    </div>
  )
}
