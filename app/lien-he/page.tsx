import PublicPageShell from '@/components/public/public-page-shell'
import PageHero from '@/components/public/page-hero'
import Breadcrumb from '@/components/public/breadcrumb'
import { ContactSection } from '@/components/home/contact-section'
import { getSiteSettings } from '@/lib/public-data'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import JsonLd from '@/components/seo/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getSeoConfig } from '@/lib/seo/config'
import { buildContactPageSchema, buildLocalBusinessSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildPageMetadata({ title: 'Liên hệ', description: `Liên hệ tư vấn qua hotline ${settings.hotline} hoặc gửi yêu cầu để nhận báo giá.`, canonicalPath: '/lien-he' })
}

export default async function Page() {
  const siteConfig = await getSiteSettings()
  const seoConfig = await getSeoConfig()
  const url = `${seoConfig.siteUrl}/lien-he`
  const schemas = [buildContactPageSchema({ name: 'Liên hệ', description: seoConfig.organization.description, url, siteUrl: seoConfig.siteUrl }), buildLocalBusinessSchema(seoConfig), buildBreadcrumbSchema([{ label: 'Trang chủ', url: seoConfig.siteUrl }, { label: 'Liên hệ', url }])]

  return (
    <PublicPageShell>
      <JsonLd data={schemas} />
      <div className="bg-[color:var(--surface)] min-h-screen text-white pb-16">
        <PageHero title="LIÊN HỆ VỚI KHANH NGUYÊN" subtitle="Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ quý khách" />
        <Breadcrumb items={[{ label: 'Liên hệ' }]} />

        {/* Info panel grid */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 flex items-start gap-4">
            <div className="text-[color:var(--gold)] shrink-0 mt-1">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wide">Hotline tư vấn</h3>
              <p className="text-base font-black text-[color:var(--gold)] mt-2">{siteConfig.hotline}</p>
              {siteConfig.secondaryHotline && (
                <p className="text-base font-black text-[color:var(--gold)] mt-1">{siteConfig.secondaryHotline}</p>
              )}
            </div>
          </div>

          <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 flex items-start gap-4">
            <div className="text-[color:var(--gold)] shrink-0 mt-1">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wide">Hòm thư email</h3>
              <p className="text-sm text-[color:var(--silver)] font-semibold mt-2 break-all">{siteConfig.email}</p>
            </div>
          </div>

          <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 flex items-start gap-4 lg:col-span-2">
            <div className="text-[color:var(--gold)] shrink-0 mt-1">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wide">Địa chỉ showroom</h3>
              <p className="text-sm text-[color:var(--silver)] font-semibold mt-2">{siteConfig.showroom}</p>
              {siteConfig.branch && (
                <p className="text-xs text-[color:var(--muted)] mt-1.5">Chi nhánh: {siteConfig.branch}</p>
              )}
            </div>
          </div>
        </div>

        {/* Reuse dynamic form */}
        <ContactSection siteConfig={siteConfig} />
      </div>
    </PublicPageShell>
  )
}
