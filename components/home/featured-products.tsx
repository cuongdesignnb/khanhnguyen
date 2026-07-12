import { featuredProducts as staticProducts } from '@/data/home'
import { SectionHeading } from '@/components/ui/section-heading'
import { ProductCard } from '@/components/ui/product-card'
import { PublicProductCard } from '@/types/public'
import { normalizeProductSpecs } from '@/lib/products/normalize-product-specs'

interface FeaturedProductsProps {
  products?: PublicProductCard[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  // If products is null/undefined/empty, map static data as fallback
  const displayProducts: PublicProductCard[] = products && products.length > 0
    ? products
    : staticProducts.map((p) => ({
        id: p.id,
        slug: p.id,
        badge: p.badge,
        category: p.category,
        categorySlug: '',
        name: p.name,
        model: p.name,
        image: p.image,
        specs: normalizeProductSpecs(p.specs, { model: p.name }),
        price: null,
        priceLabel: p.priceLabel,
      }))

  return (
    <section id="san-pham-noi-bat" className="py-14 lg:py-20" aria-label="Sản phẩm nổi bật">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="SẢN PHẨM NỔI BẬT"
          linkText="Xem tất cả"
          linkHref="/san-pham"
        />

        {/* Desktop: responsive grid */}
        <div className="hidden items-stretch gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {displayProducts.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hidden sm:hidden">
          {displayProducts.map((p) => (
            <div key={p.id} className="min-w-[270px] snap-start">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
