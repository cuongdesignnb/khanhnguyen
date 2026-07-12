'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { ProductCard } from '@/components/ui/product-card'
import { PublicProductCard } from '@/types/public'

interface FeaturedProductsProps {
  products?: PublicProductCard[]
}

const MAX_FEATURED_PRODUCTS = 8

export default function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const displayProducts = products.slice(0, MAX_FEATURED_PRODUCTS)
  const [canGoPrev, setCanGoPrev] = useState(false)
  const [canGoNext, setCanGoNext] = useState(displayProducts.length > 4)

  const updateControls = () => {
    const slider = sliderRef.current
    if (!slider) return

    const maxScrollLeft = slider.scrollWidth - slider.clientWidth
    setCanGoPrev(slider.scrollLeft > 8)
    setCanGoNext(slider.scrollLeft < maxScrollLeft - 8)
  }

  useEffect(() => {
    updateControls()

    window.addEventListener('resize', updateControls)
    return () => window.removeEventListener('resize', updateControls)
  }, [displayProducts.length])

  if (displayProducts.length === 0) return null

  const scrollSlider = (direction: 'prev' | 'next') => {
    const slider = sliderRef.current
    if (!slider) return

    slider.scrollBy({
      left: direction === 'next' ? slider.clientWidth : -slider.clientWidth,
      behavior: 'smooth',
    })
  }

  return (
    <section id="san-pham-noi-bat" className="py-14 lg:py-20" aria-label="Sản phẩm nổi bật">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <SectionHeading
            title="SẢN PHẨM NỔI BẬT"
            linkText="Xem tất cả"
            linkHref="/san-pham"
            className="mb-6 flex-1 lg:mb-8"
          />

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              aria-label="Xem nhóm sản phẩm nổi bật trước"
              disabled={!canGoPrev}
              onClick={() => scrollSlider('prev')}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-[color:var(--surface-2)] text-[color:var(--gold)] transition hover:border-[color:var(--gold)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Xem nhóm sản phẩm nổi bật tiếp theo"
              disabled={!canGoNext}
              onClick={() => scrollSlider('next')}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-[color:var(--surface-2)] text-[color:var(--gold)] transition hover:border-[color:var(--gold)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            ref={sliderRef}
            data-home-featured-slider
            onScroll={updateControls}
            className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hidden sm:gap-5"
          >
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="min-w-[270px] shrink-0 snap-start basis-[85%] sm:min-w-0 sm:basis-[calc((100%_-_1.25rem)/2)] xl:basis-[calc((100%_-_3.75rem)/4)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
