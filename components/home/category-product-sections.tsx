import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/ui/product-card'
import { PublicProductCategorySection } from '@/types/public'

interface CategoryProductSectionsProps {
  sections?: PublicProductCategorySection[]
}

const MAX_PRODUCTS_PER_SECTION = 8

export default function CategoryProductSections({ sections = [] }: CategoryProductSectionsProps) {
  const visibleSections = sections
    .map((section) => ({
      ...section,
      products: section.products.slice(0, MAX_PRODUCTS_PER_SECTION),
    }))
    .filter((section) => section.products.length > 0)

  if (visibleSections.length === 0) return null

  return (
    <div className="space-y-14 py-14 lg:space-y-20 lg:py-20">
      {visibleSections.map((section) => (
        <section key={section.category.id} aria-label={section.category.name}>
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--gold)]">
                  Danh mục sản phẩm
                </p>
                <h2 className="mt-2 text-xl font-extrabold uppercase tracking-tight text-[color:var(--text)] sm:text-2xl lg:text-3xl">
                  {section.category.name}
                </h2>
                <div className="mt-3 h-1 w-12 rounded-full bg-[color:var(--gold)]" />
                {section.category.description && (
                  <p className="mt-4 text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    {section.category.description}
                  </p>
                )}
              </div>

              <Link
                href={`/${section.category.slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--gold)] transition-colors hover:text-[color:var(--gold-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
              >
                Xem tất cả
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
              {section.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
