'use client'

import Breadcrumb from '@/components/public/breadcrumb'
import ProductGallery from './product-gallery'
import ProductInfoPanel from './product-info-panel'
import ProductSpecTable from './product-spec-table'
import ProductQuoteForm from './product-quote-form'
import RelatedProducts from './related-products'
import { PublicProductDetail, PublicProductCard } from '@/types/public'
import { ShieldCheck, Calendar, Check } from 'lucide-react'

interface ProductDetailPageProps {
  product: PublicProductDetail
  relatedProducts: PublicProductCard[]
}

export default function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  return (
    <div className="bg-[color:var(--surface)] min-h-screen text-white pb-16">
      <Breadcrumb
        items={[
          { label: 'Sản phẩm', href: '/san-pham' },
          { label: product.categoryName, href: `/${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Main 2-column info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Gallery left column */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} name={product.name} />

            {/* Description & Advantages */}
            <div className="mt-8 space-y-6">
              {product.description && (
                <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 sm:p-6">
                  <h2 className="font-extrabold uppercase text-lg text-white mb-4 tracking-wide pb-2 border-b border-white/5">
                    MÔ TẢ CHI TIẾT
                  </h2>
                  <div className="text-sm text-[color:var(--silver)] leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                </div>
              )}

              {product.advantages && product.advantages.length > 0 && (
                <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 sm:p-6">
                  <h2 className="font-extrabold uppercase text-lg text-white mb-4 tracking-wide pb-2 border-b border-white/5">
                    ƯU ĐIỂM NỔI BẬT
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.advantages.map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[color:var(--silver)]">
                        <Check size={16} className="text-[color:var(--gold)] shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warrant policy / details */}
              <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 sm:p-6">
                <h2 className="font-extrabold uppercase text-lg text-white mb-4 tracking-wide pb-2 border-b border-white/5">
                  CHÍNH SÁCH BẢO HÀNH & HỖ TRỢ
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <ShieldCheck size={20} className="text-[color:var(--gold)] shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Chính sách bảo hành vượt trội</h4>
                      <p className="text-xs text-[color:var(--muted)] mt-1">
                        {product.warrantyPolicy || 'Bảo hành từ 6 đến 12 tháng hoặc 2000 giờ tùy loại xe nâng. Kỹ thuật viên hỗ trợ tận nơi nhanh chóng trong vòng 24 giờ.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Calendar size={20} className="text-[color:var(--gold)] shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white font-sans">Kiểm định kỹ thuật trước khi bàn giao</h4>
                      <p className="text-xs text-[color:var(--muted)] mt-1">
                        100% xe nâng Nhật bãi đều được vệ sinh, kiểm tra toàn bộ linh kiện thắng, bơm thủy lực, động cơ và kiểm tra xả sạc bình điện trước khi bàn giao cho khách hàng.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spec & Form right column */}
          <div className="lg:col-span-5 space-y-6">
            <ProductInfoPanel product={product} />

            {/* Technical Specifications */}
            <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-sm text-white tracking-wider mb-4 uppercase">
                THÔNG SỐ KỸ THUẬT CHI TIẾT
              </h3>
              <ProductSpecTable product={product} />
            </div>

            {/* Quick Quote Form */}
            <div className="bg-[color:var(--surface-2)] border border-[color:var(--line-gold)] rounded-xl p-5">
              <h3 className="font-extrabold text-sm text-[color:var(--gold)] tracking-wider mb-2 uppercase text-center">
                YÊU CẦU BÁO GIÁ NHANH
              </h3>
              <p className="text-xs text-[color:var(--muted)] mb-4 text-center">
                Để lại thông tin dưới đây, chúng tôi sẽ phản hồi bảng giá chi tiết trong vòng 15 phút.
              </p>
              <ProductQuoteForm productId={product.id} productName={product.name} />
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  )
}
