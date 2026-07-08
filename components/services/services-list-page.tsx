'use client'

import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/public/page-hero'
import Breadcrumb from '@/components/public/breadcrumb'
import { PublicService } from '@/types/public'
import { CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react'

interface ServicesListPageProps {
  services: PublicService[]
}

export default function ServicesListPage({ services }: ServicesListPageProps) {
  return (
    <div className="bg-[color:var(--surface)] min-h-screen text-white pb-16">
      <PageHero title="DỊCH VỤ CỦA CHÚNG TÔI" subtitle="Chuyên nghiệp – Tận tâm – Uy tín hàng đầu" />
      <Breadcrumb items={[{ label: 'Dịch vụ' }]} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-16">
        {/* Grid of Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => (
            <article
              key={service.id}
              className="group bg-[color:var(--surface-2)] border border-white/10 rounded-xl overflow-hidden hover:border-[color:var(--line-gold)] transition-all flex flex-col"
            >
              {/* Image */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                />
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-[color:var(--gold)] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[color:var(--muted)] line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <Link
                  href={`/dich-vu/${service.slug}`}
                  className="text-sm font-bold text-[color:var(--gold)] hover:text-[color:var(--gold-strong)] mt-5 inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
                >
                  Xem chi tiết →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Why choose Khanh Nguyen for Services */}
        <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-center text-white tracking-wider uppercase">VÌ SAO NÊN CHỌN DỊCH VỤ XE NÂNG KHANH NGUYÊN?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="text-[color:var(--gold)] shrink-0 mt-0.5">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Phục vụ nhanh chóng</h4>
                <p className="text-xs text-[color:var(--muted)] mt-1.5 leading-relaxed">
                  Đội ngũ kỹ thuật lành nghề luôn túc trực, tiếp nhận thông tin hỗ trợ sửa chữa lưu động ngay lập tức tại TP.HCM và các tỉnh lân cận.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-[color:var(--gold)] shrink-0 mt-0.5">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Linh kiện chính hãng</h4>
                <p className="text-xs text-[color:var(--muted)] mt-1.5 leading-relaxed">
                  100% phụ tùng thay thế, ắc quy xe nâng, bánh xe nâng đều bảo đảm chính hãng chất lượng cao, có bảo hành đi kèm.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-[color:var(--gold)] shrink-0 mt-0.5">
                <HeartHandshake size={24} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Giá cả cạnh tranh nhất</h4>
                <p className="text-xs text-[color:var(--muted)] mt-1.5 leading-relaxed">
                  Bảng giá cho thuê xe nâng ngắn hạn/dài hạn, đơn giá dịch vụ bảo dưỡng được tối ưu tối đa giúp tiết kiệm ngân sách doanh nghiệp của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
