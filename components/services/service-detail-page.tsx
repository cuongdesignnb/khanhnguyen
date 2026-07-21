'use client'

import PageHero from '@/components/public/page-hero'
import Breadcrumb from '@/components/public/breadcrumb'
import ServiceFAQ from './service-faq'
import ServiceCTAForm from './service-cta-form'
import { PublicServiceDetail } from '@/types/public'
import { Check, ClipboardList } from 'lucide-react'
import RichContent from '@/components/public/rich-content'

interface ServiceDetailPageProps {
  service: PublicServiceDetail
}

export default function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  return (
    <div className="bg-[color:var(--surface)] min-h-screen text-white pb-16">
      <PageHero title={service.title} subtitle={service.subtitle || undefined} />
      <Breadcrumb items={[{ label: 'Dịch vụ', href: '/dich-vu' }, { label: service.title }]} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main content left */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description / Summary */}
            {service.description && (
              <div className="border-l-2 border-[color:var(--gold)] pl-4 italic">
                <RichContent
                  html={service.description}
                  className="text-base sm:text-lg [&_p]:mb-0"
                />
              </div>
            )}

            {/* Content rich text area */}
            {service.content && (
              <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 sm:p-6">
                <RichContent html={service.content} />
              </div>
            )}

            {/* Benefits list */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4">
                <h3 className="font-extrabold uppercase text-lg text-white pb-2 border-b border-white/5">
                  LỢI ÍCH DỊCH VỤ MANG LẠI
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[color:var(--silver)]">
                      <Check size={16} className="text-[color:var(--gold)] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Process steps */}
            {service.process && service.process.length > 0 && (
              <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4">
                <h3 className="font-extrabold uppercase text-lg text-white pb-2 border-b border-white/5">
                  QUY TRÌNH TRIỂN KHAI DỊCH VỤ
                </h3>
                <div className="relative pl-6 border-l border-white/10 ml-3 space-y-6 mt-4">
                  {service.process.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Step node dot */}
                      <span className="absolute -left-[31px] top-1.5 flex items-center justify-center bg-black border border-[color:var(--gold)] text-[color:var(--gold)] font-bold text-xs rounded-full size-5">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-white text-sm">{step.title}</h4>
                      {step.description && (
                        <p className="text-xs text-[color:var(--muted)] mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Accordion */}
            {service.faqs && service.faqs.length > 0 && (
              <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4">
                <h3 className="font-extrabold uppercase text-lg text-white pb-2 border-b border-white/5">
                  CÂU HỎI THƯỜNG GẶP
                </h3>
                <ServiceFAQ faqs={service.faqs} />
              </div>
            )}
          </div>

          {/* Form CTA right */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[color:var(--surface-2)] border border-[color:var(--line-gold)] rounded-xl p-5 sticky top-28">
              <h3 className="font-extrabold text-sm text-[color:var(--gold)] tracking-wider mb-2 uppercase text-center flex items-center justify-center gap-1.5">
                <ClipboardList size={16} />
                <span>ĐĂNG KÝ TƯ VẤN DỊCH VỤ</span>
              </h3>
              <p className="text-xs text-[color:var(--muted)] mb-4 text-center">
                Để lại yêu cầu dưới đây, chuyên viên kỹ thuật của Khanh Nguyên sẽ gọi lại hỗ trợ ngay lập tức.
              </p>
              <ServiceCTAForm serviceTitle={service.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
