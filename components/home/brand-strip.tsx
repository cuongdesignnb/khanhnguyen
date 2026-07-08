import { brandNames as staticBrandNames } from '@/data/home'
import { SectionHeading } from '@/components/ui/section-heading'
import { PublicBrand } from '@/types/public'

interface BrandStripProps {
  brands?: PublicBrand[]
}

export default function BrandStrip({ brands }: BrandStripProps) {
  const displayBrands: PublicBrand[] = brands && brands.length > 0
    ? brands
    : staticBrandNames.map((name) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
      }))

  return (
    <section className="py-10 lg:py-14" aria-label="Thương hiệu nổi bật">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading title="THƯƠNG HIỆU NỔI BẬT" />

        {/* Desktop: flex-wrap centered */}
        <div className="hidden sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
          {displayBrands.map((brand) => (
            <a
              href={`/san-pham?brand=${brand.slug}`}
              key={brand.id}
              className="cursor-pointer whitespace-nowrap rounded-lg border border-white/10 bg-[color:var(--surface-2)] px-6 py-3 text-sm font-bold text-[color:var(--silver)] transition-all hover:border-[color:var(--line-gold)] hover:text-[color:var(--gold)] sm:text-base block"
            >
              {brand.name}
            </a>
          ))}
        </div>

        {/* Mobile: horizontal scroll with snap */}
        <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hidden sm:hidden">
          {displayBrands.map((brand) => (
            <a
              href={`/san-pham?brand=${brand.slug}`}
              key={brand.id}
              className="min-w-fit snap-start cursor-pointer whitespace-nowrap rounded-lg border border-white/10 bg-[color:var(--surface-2)] px-6 py-3 text-sm font-bold text-[color:var(--silver)] transition-all hover:border-[color:var(--line-gold)] hover:text-[color:var(--gold)] block"
            >
              {brand.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
