import { featuredProducts } from '@/data/home';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProductCard } from '@/components/ui/product-card';

export default function FeaturedProducts() {
  return (
    <section id="san-pham-noi-bat" className="py-14 lg:py-20" aria-label="Sản phẩm nổi bật">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="SẢN PHẨM NỔI BẬT"
          linkText="Xem tất cả"
          linkHref="/san-pham"
        />

        {/* Desktop: responsive grid */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {featuredProducts.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hidden sm:hidden">
          {featuredProducts.map((p) => (
            <div key={p.id} className="min-w-[260px] snap-start">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
