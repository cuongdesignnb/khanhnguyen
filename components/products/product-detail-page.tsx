'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Check, Truck, Headset, PhoneCall, Clock, Award, Star, MessageSquare } from 'lucide-react'
import ProductGallery from './product-gallery'
import ProductInfoPanel from './product-info-panel'
import ProductSpecTable from './product-spec-table'
import ProductQuoteForm from './product-quote-form'
import RelatedProducts from './related-products'
import ProductReviewsSection from './product-reviews-section'
import { PublicProductDetail, PublicProductCard } from '@/types/public'
import { getProductCategoryHref } from '@/lib/products/category-url'
import RichContent from '@/components/public/rich-content'
import { useSalesContext } from '@/components/sales/sales-provider'
import AddToCartButton from '../sales/add-to-cart-button'
import clsx from 'clsx'

interface ProductDetailPageProps {
  product: PublicProductDetail
  relatedProducts: PublicProductCard[]
}

export default function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  const { addRecentlyViewed } = useSalesContext()
  const [showMobileCta, setShowMobileCta] = useState(false)

  // Track recently viewed product
  useEffect(() => {
    if (product.id) {
      addRecentlyViewed(product.id)
    }
  }, [product.id, addRecentlyViewed])

  // Track scroll position to trigger sticky CTA on mobile
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky mobile CTA after scrolling down 450px
      setShowMobileCta(window.scrollY > 450)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-[color:var(--bg)] min-h-screen text-white pb-16 font-sans">
      
      {/* 1. ProductHero Section */}
      <section className="relative overflow-hidden py-5 lg:py-7 border-b border-white/10 bg-neutral-950">
        {/* Background Image with Gold Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
          <Image
            src={product.thumbnail || '/images/placeholder.jpg'}
            alt="Hero background"
            fill
            priority
            className="object-cover filter grayscale blur-sm"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--bg)] via-black/85 to-black/70 z-0" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[color:var(--bg)] to-transparent pointer-events-none z-0" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
            <Link href="/" className="hover:text-[color:var(--gold)] transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/san-pham" className="hover:text-[color:var(--gold)] transition-colors">
              Sản phẩm
            </Link>
            <span>/</span>
            <Link href={getProductCategoryHref(product.categorySlug)} className="hover:text-[color:var(--gold)] transition-colors">
              {product.categoryName}
            </Link>
            <span>/</span>
            <span className="text-white truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </nav>

          {/* Heading */}
          <div>
            <h1 className="max-w-3xl text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-wider">
              {product.categoryName}
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-[color:var(--silver)]">
              Giải pháp nâng hạ hiện đại – An toàn – Tiết kiệm – Hiệu quả
            </p>
          </div>
        </div>
      </section>

      {/* Main content container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 lg:pt-6 space-y-12 relative z-10">
        
        {/* 2. Main 2 columns: Gallery & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Right Column: Info Panel */}
          <div className="lg:col-span-5">
            <ProductInfoPanel product={product} />
          </div>
        </div>

        {/* 3. TrustStrip Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-white/10 bg-white/[0.01]">
          {/* Item 1 */}
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.02] transition-colors">
            <div className="p-3 rounded-xl bg-[color:var(--gold)]/10 text-[color:var(--gold)] border border-[color:var(--gold)]/20 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Bảo hành 6 – 12 tháng</h4>
              <p className="text-xs text-[color:var(--muted)] mt-0.5">Cam kết chính hãng</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.02] transition-colors">
            <div className="p-3 rounded-xl bg-[color:var(--gold)]/10 text-[color:var(--gold)] border border-[color:var(--gold)]/20 shrink-0">
              <Headset size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Hỗ trợ kỹ thuật 24/7</h4>
              <p className="text-xs text-[color:var(--muted)] mt-0.5">Tư vấn – hỗ trợ tận tâm</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.02] transition-colors">
            <div className="p-3 rounded-xl bg-[color:var(--gold)]/10 text-[color:var(--gold)] border border-[color:var(--gold)]/20 shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Giao hàng toàn quốc</h4>
              <p className="text-xs text-[color:var(--muted)] mt-0.5">Nhanh chóng – an toàn</p>
            </div>
          </div>
        </div>

        {/* 4. Body 2 columns: Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Details Sections */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description */}
            {product.description && (
              <section className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="font-extrabold uppercase text-base sm:text-lg text-white tracking-wider pb-3 border-b border-white/5 relative">
                  MÔ TẢ CHI TIẾT
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[color:var(--gold)]" />
                </h3>
                <div className="text-sm text-[color:var(--silver)] leading-relaxed">
                  <RichContent html={product.description} />
                </div>
              </section>
            )}

            {/* Advantages */}
            {product.advantages && (Array.isArray(product.advantages) ? product.advantages.length > 0 : true) && (
              <section className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="font-extrabold uppercase text-base sm:text-lg text-white tracking-wider pb-3 border-b border-white/5 relative">
                  ƯU ĐIỂM NỔI BẬT
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[color:var(--gold)]" />
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Array.isArray(product.advantages)
                    ? product.advantages
                    : JSON.parse(product.advantages as string)
                  ).map((adv: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[color:var(--silver)]">
                      <div className="mt-1 shrink-0 p-0.5 rounded-full bg-[color:var(--gold)]/20 text-[color:var(--gold)]">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Warranty & Support Policy */}
            <section className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5">
              <h3 className="font-extrabold uppercase text-base sm:text-lg text-white tracking-wider pb-3 border-b border-white/5 relative">
                CHÍNH SÁCH BẢO HÀNH & HỖ TRỢ
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[color:var(--gold)]" />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <ShieldCheck size={20} className="text-[color:var(--gold)] shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">Bảo hành 6 – 12 tháng</h4>
                    <p className="text-xs text-[color:var(--muted)] mt-1.5 leading-relaxed">
                      {product.warrantyPolicy || 'Bảo hành từ 6 đến 12 tháng hoặc 1000 giờ hoạt động tùy điều kiện nào đến trước. Hỗ trợ kỹ thuật 24/7 qua hotline, Zalo.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock size={20} className="text-[color:var(--gold)] shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">Hỗ trợ kỹ thuật 24/7</h4>
                    <p className="text-xs text-[color:var(--muted)] mt-1.5 leading-relaxed">
                      Đội ngũ kỹ thuật chuyên nghiệp, giàu kinh nghiệm luôn sẵn sàng giải quyết mọi vấn đề phát sinh. Hỗ trợ khắc phục sự cố tận nơi trong thời gian ngắn nhất.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Award size={20} className="text-[color:var(--gold)] shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">Cung cấp phụ tùng chính hãng</h4>
                    <p className="text-xs text-[color:var(--muted)] mt-1.5 leading-relaxed">
                      Kho phụ tùng dồi dào, đầy đủ linh kiện thay thế cho các hãng Toyota, Komatsu, Mitsubishi, TCM... Bảo trì định kỳ miễn phí trong thời gian bảo hành.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Star size={20} className="text-[color:var(--gold)] shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">Hỗ trợ kiểm tra, bảo trì trọn đời</h4>
                    <p className="text-xs text-[color:var(--muted)] mt-1.5 leading-relaxed">
                      Sau thời gian bảo hành, Khanh Nguyên vẫn hỗ trợ kiểm tra xe nâng định kỳ và sửa chữa với chi phí ưu đãi nhất cho quý khách hàng.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Specifications Details */}
            <section className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="font-extrabold uppercase text-base sm:text-lg text-white tracking-wider pb-3 border-b border-white/5 relative">
                THÔNG SỐ KỸ THUẬT CHI TIẾT
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[color:var(--gold)]" />
              </h3>
              <ProductSpecTable product={product} />
            </section>

            {/* Product Reviews Section */}
            <ProductReviewsSection productId={product.id} productSlug={product.slug} />
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* Quote request Card */}
            <div id="quote-form" className="bg-[color:var(--surface-2)] border border-[color:var(--line-gold)] rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg shadow-black/40">
              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-base text-[color:var(--gold)] uppercase tracking-wider">
                  YÊU CẦU BÁO GIÁ NHANH
                </h3>
                <p className="text-xs text-[color:var(--muted)]">
                  Điền thông tin bên dưới để nhận báo giá chi tiết trong 15 phút.
                </p>
              </div>
              <ProductQuoteForm productId={product.id} productName={product.name} />
            </div>

            {/* Direct Contact Card */}
            <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[color:var(--silver)] border-b border-white/5 pb-2">
                LIÊN HỆ NGAY
              </h3>
              <div className="space-y-4">
                {/* Hotline */}
                <a href="tel:1900633966" className="flex items-center gap-3.5 group cursor-pointer">
                  <div className="p-2.5 rounded-lg bg-[color:var(--gold)] text-black shrink-0 group-hover:scale-105 transition-transform">
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[color:var(--muted)] font-semibold uppercase">Hotline</span>
                    <span className="block text-base font-black text-[color:var(--gold)] group-hover:underline">1900 633 966</span>
                  </div>
                </a>

                {/* Zalo */}
                <a href="https://zalo.me/0903385225" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 group cursor-pointer">
                  <div className="p-2.5 rounded-lg bg-sky-500 text-white shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[color:var(--muted)] font-semibold uppercase">Chat Zalo ngay</span>
                    <span className="block text-sm font-bold text-white group-hover:underline">Tư vấn nhanh 24/7</span>
                  </div>
                </a>

                {/* Hours */}
                <div className="flex items-center gap-3.5 pt-2 border-t border-white/5">
                  <Clock size={16} className="text-[color:var(--muted)] shrink-0" />
                  <span className="text-xs text-[color:var(--silver)] font-medium">Giờ làm việc: 7:30 - 17:30 (Thứ 2 - Thứ 7)</span>
                </div>
              </div>
            </div>

            {/* Commitments Card */}
            <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[color:var(--silver)] border-b border-white/5 pb-2">
                CAM KẾT KHI MUA HÀNG
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-[color:var(--silver)]">
                  <div className="mt-0.5 shrink-0 text-[color:var(--gold)]">
                    <Check size={14} className="stroke-[2.5]" />
                  </div>
                  <span>Sản phẩm chất lượng – Nguồn gốc rõ ràng</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-[color:var(--silver)]">
                  <div className="mt-0.5 shrink-0 text-[color:var(--gold)]">
                    <Check size={14} className="stroke-[2.5]" />
                  </div>
                  <span>Giá tốt nhất thị trường xe nâng Nhật bãi</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-[color:var(--silver)]">
                  <div className="mt-0.5 shrink-0 text-[color:var(--gold)]">
                    <Check size={14} className="stroke-[2.5]" />
                  </div>
                  <span>Hỗ trợ kỹ thuật và bảo trì trọn đời</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-[color:var(--silver)]">
                  <div className="mt-0.5 shrink-0 text-[color:var(--gold)]">
                    <Check size={14} className="stroke-[2.5]" />
                  </div>
                  <span>Miễn phí vận chuyển nội thành TP. HCM</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-[color:var(--silver)]">
                  <div className="mt-0.5 shrink-0 text-[color:var(--gold)]">
                    <Check size={14} className="stroke-[2.5]" />
                  </div>
                  <span>Thanh toán linh hoạt – Nhiều hình thức thuận tiện</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* 5. Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-8">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}

      </div>

      {/* Sticky Mobile CTA Bar */}
      <div
        className={clsx(
          'fixed bottom-[68px] left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur-md border-t border-[color:var(--line-gold)] p-3 transition-transform duration-300 flex items-center justify-between gap-3',
          showMobileCta ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        )}
        style={{ boxShadow: '0 -4px 15px rgba(0,0,0,0.6)' }}
      >
        <div className="flex items-center gap-2.5 max-w-[60%]">
          <div className="relative size-10 rounded-lg overflow-hidden shrink-0 bg-neutral-900 border border-white/10">
            <Image
              src={product.thumbnail || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate uppercase tracking-tight">{product.name}</h4>
            <p className="text-[10px] text-[color:var(--gold)] font-bold mt-0.5">{product.priceLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            variant="solid"
            className="py-2.5 px-4 text-xs font-extrabold rounded-lg bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black cursor-pointer shadow-md"
          />
        </div>
      </div>
    </div>
  )
}
