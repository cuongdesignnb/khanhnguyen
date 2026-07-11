'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Image as ImageIcon, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'
import MediaPicker from '@/components/admin/media-picker'
import { toast } from '@/lib/toast'
import type { MediaItem } from '@/types/admin'

const tabs = [
  ['general.site', 'Chung'], ['brand.identity', 'Thương hiệu'], ['contact.info', 'Liên hệ'],
  ['social.links', 'Mạng xã hội'], ['header.config', 'Đầu trang'], ['footer.config', 'Chân trang'],
  ['home.config', 'Trang chủ'], ['products.config', 'Sản phẩm'], ['services.config', 'Dịch vụ'],
  ['posts.config', 'Tin tức'], ['seo.default', 'SEO toàn website'], ['seo.organization', 'Tổ chức & doanh nghiệp'],
  ['seo.schemas', 'Schema'], ['seo.robots', 'Robots'], ['integrations.tracking', 'Tích hợp'],
  ['popup.config', 'Popup/Banner'], ['advanced.config', 'Nâng cao'],
] as const

const labels: Record<string, string> = {
  siteName: 'Tên website', companyName: 'Tên công ty', shortName: 'Tên ngắn', slogan: 'Khẩu hiệu',
  description: 'Mô tả', language: 'Ngôn ngữ', timezone: 'Múi giờ', currency: 'Tiền tệ',
  currencySymbol: 'Ký hiệu tiền tệ', maintenanceMode: 'Chế độ bảo trì', maintenanceMessage: 'Thông báo bảo trì',
  hotline: 'Hotline', hotlineSecondary: 'Hotline phụ', phone: 'Điện thoại', zaloPhone: 'Số Zalo',
  email: 'Email', salesEmail: 'Email kinh doanh', supportEmail: 'Email hỗ trợ', address: 'Địa chỉ',
  showroomAddress: 'Địa chỉ showroom', warehouseAddress: 'Địa chỉ kho', workingHours: 'Giờ làm việc',
  googleMapUrl: 'Google Map URL', googleMapEmbed: 'Mã nhúng Google Map', taxCode: 'Mã số thuế',
  businessLicense: 'Giấy phép kinh doanh', brandColor: 'Màu thương hiệu', accentColor: 'Màu nhấn',
  fontFamily: 'Phông chữ', customHeadScript: 'Custom Head Script', customBodyScript: 'Custom Body Script',
  customFooterScript: 'Custom Footer Script', defaultTitle: 'Tiêu đề SEO mặc định',
  titleTemplate: 'Mẫu tiêu đề', defaultDescription: 'Mô tả SEO mặc định', defaultKeywords: 'Từ khóa mặc định',
  siteUrl: 'URL chính thức của website', defaultOgImageId: 'Ảnh chia sẻ mặc định',
  defaultOgImageUrl: 'URL ảnh chia sẻ dự phòng', twitterCard: 'Loại Twitter Card',
  robotsIndex: 'Cho phép lập chỉ mục mặc định', robotsFollow: 'Cho phép theo dõi liên kết mặc định',
  googleVerificationCode: 'Mã xác minh Google', bingVerificationCode: 'Mã xác minh Bing',
  organizationName: 'Tên tổ chức', legalName: 'Tên pháp lý', logoId: 'Logo tổ chức',
  contactType: 'Loại liên hệ', streetAddress: 'Địa chỉ đường phố', addressLocality: 'Quận/Huyện hoặc thành phố',
  addressRegion: 'Tỉnh/Thành phố', postalCode: 'Mã bưu chính', addressCountry: 'Mã quốc gia',
  latitude: 'Vĩ độ', longitude: 'Kinh độ', priceRange: 'Khoảng giá', openingHours: 'Giờ mở cửa',
  areaServed: 'Khu vực phục vụ', socialLinks: 'Liên kết mạng xã hội', businessType: 'Loại hình doanh nghiệp',
  organization: 'Organization schema', localBusiness: 'LocalBusiness schema', website: 'WebSite schema',
  webpage: 'WebPage schema', breadcrumb: 'Breadcrumb schema', product: 'Product schema', article: 'Article schema',
  service: 'Service schema', faq: 'FAQ schema', itemList: 'ItemList schema', allowIndexing: 'Cho phép công cụ tìm kiếm lập chỉ mục',
  disallow: 'Đường dẫn chặn robots',
  logoDarkId: 'Logo dùng trên nền tối', logoLightId: 'Logo dùng trên nền sáng', faviconId: 'Biểu tượng trình duyệt (Favicon)',
  ogDefaultImageId: 'Ảnh chia sẻ mặc định cũ', heroImageId: 'Ảnh banner chính', promoBannerImageId: 'Ảnh banner khuyến mãi',
  categoryBannerDefaultId: 'Banner danh mục mặc định', defaultPostImageId: 'Ảnh bài viết mặc định', defaultNoImageId: 'Ảnh thay thế khi thiếu ảnh',
  facebook: 'Facebook', zalo: 'Zalo', youtube: 'YouTube', tiktok: 'TikTok', linkedin: 'LinkedIn',
  googleBusiness: 'Google Business', messenger: 'Messenger', topNoticeEnabled: 'Hiện thông báo đầu trang',
  topNoticeText: 'Nội dung thông báo đầu trang', showSearch: 'Hiện ô tìm kiếm', showWishlist: 'Hiện danh sách yêu thích',
  showCompare: 'Hiện chức năng so sánh', showAccount: 'Hiện tài khoản', stickyHeader: 'Cố định đầu trang',
  primaryCtaLabel: 'Nhãn nút chính', primaryCtaUrl: 'Đường dẫn nút chính', hotlineLabel: 'Nhãn hotline',
  copyrightText: 'Nội dung bản quyền', showNewsletter: 'Hiện đăng ký nhận tin', newsletterTitle: 'Tiêu đề nhận tin',
  newsletterDescription: 'Mô tả nhận tin', heroEnabled: 'Hiện banner chính', heroTitle: 'Tiêu đề banner chính',
  heroSubtitle: 'Tiêu đề phụ banner', heroDescription: 'Mô tả banner', heroPrimaryCtaLabel: 'Nhãn nút chính banner',
  heroPrimaryCtaUrl: 'Đường dẫn nút chính banner', heroSecondaryCtaLabel: 'Nhãn nút phụ banner', heroSecondaryCtaUrl: 'Đường dẫn nút phụ banner',
  featuredProductsEnabled: 'Hiện sản phẩm nổi bật', featuredProductsTitle: 'Tiêu đề sản phẩm nổi bật', featuredProductsSubtitle: 'Tiêu đề phụ sản phẩm nổi bật',
  featuredProductsLimit: 'Số sản phẩm nổi bật', categoriesEnabled: 'Hiện danh mục', brandsEnabled: 'Hiện thương hiệu',
  servicesEnabled: 'Hiện dịch vụ', testimonialsEnabled: 'Hiện đánh giá khách hàng', statsEnabled: 'Hiện số liệu thống kê',
  newsEnabled: 'Hiện tin tức', newsLimit: 'Số bài viết trên trang chủ', promoBannerEnabled: 'Hiện banner quảng bá',
  promoBannerTitle: 'Tiêu đề banner quảng bá', promoBannerDescription: 'Mô tả banner quảng bá', promoBannerCtaLabel: 'Nhãn nút banner quảng bá',
  promoBannerCtaUrl: 'Đường dẫn banner quảng bá', listingTitle: 'Tiêu đề trang danh sách', listingDescription: 'Mô tả trang danh sách',
  defaultSort: 'Kiểu sắp xếp mặc định', productsPerPage: 'Số sản phẩm mỗi trang', showPrice: 'Hiện giá',
  priceFallbackLabel: 'Nhãn khi chưa có giá', showQuoteButton: 'Hiện nút báo giá', showZaloButton: 'Hiện nút Zalo',
  showHotlineButton: 'Hiện nút hotline', relatedProductsLimit: 'Số sản phẩm liên quan', enableProductReviews: 'Cho phép đánh giá sản phẩm',
  requireReviewApproval: 'Duyệt đánh giá trước khi hiện', showFaq: 'Hiện câu hỏi thường gặp', showProcess: 'Hiện quy trình',
  showContactForm: 'Hiện biểu mẫu liên hệ', defaultCtaLabel: 'Nhãn nút mặc định', defaultCtaUrl: 'Đường dẫn nút mặc định',
  postsPerPage: 'Số bài viết mỗi trang', showAuthor: 'Hiện tác giả', showPublishedDate: 'Hiện ngày đăng',
  showRelatedPosts: 'Hiện bài viết liên quan', relatedPostsLimit: 'Số bài viết liên quan', enableTableOfContents: 'Hiện mục lục',
  enableShareButtons: 'Hiện nút chia sẻ', googleAnalyticsId: 'Google Analytics ID', googleTagManagerId: 'Google Tag Manager ID',
  facebookPixelId: 'Facebook Pixel ID', googleSearchConsoleCode: 'Mã Google Search Console', enabled: 'Kích hoạt',
  type: 'Loại hiển thị', title: 'Tiêu đề', imageId: 'Ảnh', ctaLabel: 'Nhãn nút', ctaUrl: 'Đường dẫn nút',
  delaySeconds: 'Thời gian chờ (giây)', showOncePerSession: 'Chỉ hiện một lần mỗi phiên', enableCache: 'Bật bộ nhớ đệm',
  cacheTtlSeconds: 'Thời gian lưu bộ nhớ đệm (giây)', enableDebugMode: 'Bật chế độ gỡ lỗi', enableSitemap: 'Bật sitemap',
  enableRobots: 'Bật robots.txt', lazyLoadImages: 'Tải ảnh trì hoãn',
}

const imageKeys = new Set(['logoId', 'logoDarkId', 'logoLightId', 'faviconId', 'ogDefaultImageId', 'defaultOgImageId', 'heroImageId', 'promoBannerImageId', 'categoryBannerDefaultId', 'defaultPostImageId', 'ogImageId', 'imageId', 'defaultNoImageId'])
const listKeys = new Set(['defaultKeywords', 'areaServed', 'socialLinks', 'disallow'])
const longKeys = /description|message|script|embed|menuItems|columns|bottomLinks/i
const fieldClass = 'w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60'
const humanize = (key: string) => labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())

type Preview = { url: string; alt?: string | null; filename?: string }
type FieldsProps = { value: Record<string, any>; update: (key: string, value: any) => void; chooseImage: (key: string) => void; mediaPreviews: Record<string, Preview> }

function StringList({ name, values, onChange }: { name: string; values: string[]; onChange: (values: string[]) => void }) {
  return <div className="space-y-3 md:col-span-2">
    <div className="flex items-center justify-between"><span>{humanize(name)}</span><button type="button" onClick={() => onChange([...values, ''])} className="flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-xs"><Plus size={13} /> Thêm</button></div>
    {values.length === 0 && <p className="text-sm text-[color:var(--muted)]">Chưa có dữ liệu.</p>}
    {values.map((item, index) => <div key={index} className="flex gap-2"><input className={fieldClass} value={item} placeholder={name === 'disallow' ? '/duong-dan-can-chan' : 'Nhập giá trị'} onChange={(event) => onChange(values.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} /><button type="button" aria-label="Xóa" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="rounded-xl border border-red-400/20 px-3 text-red-300"><Trash2 size={15} /></button></div>)}
  </div>
}

function OpeningHours({ value, onChange }: { value: Array<{ days?: string[]; opens?: string; closes?: string }>; onChange: (value: any[]) => void }) {
  return <div className="space-y-3 md:col-span-2"><div className="flex items-center justify-between"><span>Giờ mở cửa</span><button type="button" onClick={() => onChange([...value, { days: ['Monday'], opens: '08:00', closes: '17:00' }])} className="flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-xs"><Plus size={13} /> Thêm khung giờ</button></div>
    {value.map((row, index) => <div key={index} className="grid gap-2 rounded-xl border border-white/10 p-3 md:grid-cols-[2fr_1fr_1fr_auto]"><input className={fieldClass} value={(row.days || []).join(', ')} placeholder="Monday, Tuesday" onChange={(event) => onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, days: event.target.value.split(',').map((day) => day.trim()).filter(Boolean) } : item))} /><input className={fieldClass} type="time" value={row.opens || ''} onChange={(event) => onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, opens: event.target.value } : item))} /><input className={fieldClass} type="time" value={row.closes || ''} onChange={(event) => onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, closes: event.target.value } : item))} /><button type="button" aria-label="Xóa" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} className="px-3 text-red-300"><Trash2 size={15} /></button></div>)}
  </div>
}

function Fields({ value, update, chooseImage, mediaPreviews }: FieldsProps) {
  return <div className="grid gap-5 md:grid-cols-2">{Object.entries(value).map(([key, field]) => {
    if (key === 'menuItems' || key === 'columns') return <div key={key} className="space-y-3 rounded-xl border border-[color:var(--gold)]/20 bg-[color:var(--gold)]/5 p-5 md:col-span-2"><h3 className="font-bold">{key === 'menuItems' ? 'Menu đầu trang' : 'Menu chân trang'}</h3><p className="text-sm text-[color:var(--muted)]">Menu được quản lý bằng giao diện kéo thả riêng.</p><Link href={key === 'menuItems' ? '/admin/menu/header' : '/admin/menu/footer'} className="inline-flex rounded-xl bg-[color:var(--gold)] px-4 py-2 text-sm font-bold text-black">Quản lý menu</Link></div>
    if (listKeys.has(key) && Array.isArray(field)) return <StringList key={key} name={key} values={field} onChange={(items) => update(key, items)} />
    if (key === 'openingHours' && Array.isArray(field)) return <OpeningHours key={key} value={field} onChange={(items) => update(key, items)} />
    if (key === 'bottomLinks' && Array.isArray(field)) return <StringList key={key} name={key} values={field.map((item: any) => `${item.label || ''}|${item.url || ''}`)} onChange={(items) => update(key, items.map((item) => { const [label, url] = item.split('|'); return { label, url: url || '/' } }))} />
    if (imageKeys.has(key)) { const preview = field ? mediaPreviews[String(field)] : undefined; return <div key={key} className="space-y-3 rounded-xl border border-white/10 p-4"><span className="text-sm font-semibold">{humanize(key)}</span>{preview ? <div className="relative h-32 overflow-hidden rounded-xl border border-white/10 bg-black/30"><Image src={preview.url} alt={preview.alt || humanize(key)} fill unoptimized className="object-contain p-3" sizes="420px" /></div> : <button type="button" onClick={() => chooseImage(key)} className="flex h-24 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 text-sm text-[color:var(--muted)] hover:border-[color:var(--gold)]/50 hover:text-white"><ImageIcon size={20} /> Chưa chọn ảnh</button>}<div className="flex gap-2"><button type="button" onClick={() => chooseImage(key)} className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm"><ImageIcon size={15} /> {field ? 'Thay ảnh' : 'Chọn ảnh'}</button>{field && <button type="button" onClick={() => update(key, null)} className="text-xs text-red-300">Xóa ảnh</button>}</div></div> }
    if (typeof field === 'boolean') return <label key={key} className="flex items-center gap-3 rounded-xl border border-white/10 p-4"><input type="checkbox" checked={field} onChange={(event) => update(key, event.target.checked)} /><span>{humanize(key)}</span></label>
    if (typeof field === 'number') return <label key={key} className="space-y-2"><span>{humanize(key)}</span><input className={fieldClass} type="number" value={field} onChange={(event) => update(key, Number(event.target.value))} /></label>
    if (key === 'brandColor' || key === 'accentColor') return <label key={key} className="space-y-2"><span>{humanize(key)}</span><div className="flex gap-2"><input type="color" aria-label={humanize(key)} value={String(field || '#000000')} onChange={(event) => update(key, event.target.value)} className="h-11 w-14 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1" /><input className={fieldClass} value={String(field || '')} onChange={(event) => update(key, event.target.value)} /></div></label>
    if (key === 'twitterCard') return <label key={key} className="space-y-2"><span>{humanize(key)}</span><select className={fieldClass} value={String(field)} onChange={(event) => update(key, event.target.value)}><option value="summary_large_image">Ảnh lớn</option><option value="summary">Ảnh thu gọn</option></select></label>
    if (key === 'businessType') return <label key={key} className="space-y-2"><span>{humanize(key)}</span><select className={fieldClass} value={String(field)} onChange={(event) => update(key, event.target.value)}><option value="LocalBusiness">Doanh nghiệp địa phương</option><option value="Store">Cửa hàng</option><option value="AutomotiveBusiness">Doanh nghiệp phương tiện</option><option value="Organization">Tổ chức</option></select></label>
    if (Array.isArray(field) || (field && typeof field === 'object')) return <div key={key} className="rounded-xl border border-white/10 p-4 text-sm text-[color:var(--muted)] md:col-span-2">Trường {humanize(key)} được hệ thống quản lý tự động.</div>
    const isLong = longKeys.test(key)
    return <label key={key} className={`space-y-2 ${isLong ? 'md:col-span-2' : ''}`}><span>{humanize(key)}</span>{isLong ? <textarea className={`${fieldClass} min-h-28`} value={String(field ?? '')} onChange={(event) => update(key, event.target.value)} /> : <input className={fieldClass} value={String(field ?? '')} type={/email/i.test(key) ? 'email' : 'text'} onChange={(event) => update(key, event.target.value)} />}</label>
  })}</div>
}

export default function SettingsPage() {
  const [active, setActive] = useState<(typeof tabs)[number][0]>('general.site')
  const [all, setAll] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mediaField, setMediaField] = useState<string | null>(null)
  const [mediaPreviews, setMediaPreviews] = useState<Record<string, Preview>>({})
  const current = useMemo(() => all[active] || {}, [all, active])
  const load = () => { setLoading(true); fetch('/api/admin/settings').then((response) => response.json()).then(async (result) => { if (!result.success) throw new Error(result.error); setAll(result.data); const ids = [...new Set(Object.values(result.data).flatMap((group: any) => Object.entries(group).filter(([key, item]) => imageKeys.has(key) && typeof item === 'string').map(([, item]) => item as string)))]; if (ids.length) { const mediaResult = await fetch(`/api/admin/media?limit=${ids.length}&ids=${encodeURIComponent(ids.join(','))}`).then((response) => response.json()); const items = mediaResult.data?.items || []; setMediaPreviews(Object.fromEntries(items.map((item: any) => [item.id, { url: item.url, alt: item.alt, filename: item.filename }]))); } }).catch((error) => toast.error(error.message)).finally(() => setLoading(false)) }
  useEffect(load, [])
  const update = (key: string, value: any) => setAll((old) => ({ ...old, [active]: { ...old[active], [key]: value } }))
  const save = async () => { setSaving(true); const result = await fetch(`/api/admin/settings/${encodeURIComponent(active)}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ value: current }) }).then((response) => response.json()); setSaving(false); result.success ? toast.success('Đã lưu cài đặt') : toast.error(result.error) }
  const reset = async () => { if (!confirm('Khôi phục tab này về mặc định?')) return; const result = await fetch('/api/admin/settings/reset', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ group: active }) }).then((response) => response.json()); result.success ? (setAll((old) => ({ ...old, [active]: result.data })), toast.success('Đã khôi phục mặc định')) : toast.error(result.error) }
  const activeLabel = tabs.find(([id]) => id === active)?.[1] || ''
  return <div className="mx-auto max-w-[1500px] space-y-6 p-6 text-white"><div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-black">Cài đặt website</h1><p className="text-sm text-[color:var(--muted)]">Quản lý nội dung và hành vi toàn website theo từng lĩnh vực.</p></div><div className="flex flex-wrap gap-2"><Link href="/" target="_blank" className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm"><ExternalLink size={15} /> Xem trước</Link><button onClick={reset} className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm"><RotateCcw size={15} /> Khôi phục</button><button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-xl bg-[color:var(--gold)] px-5 py-2 text-sm font-bold text-black disabled:opacity-50"><Save size={15} /> {saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button></div></div>
    <select className={`${fieldClass} md:hidden`} value={active} onChange={(event) => setActive(event.target.value as any)}>{tabs.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
    <div className="grid gap-6 md:grid-cols-[230px_minmax(0,1fr)]"><aside className="hidden self-start rounded-2xl border border-white/10 bg-[color:var(--surface)] p-2 md:block">{tabs.map(([id, label]) => <button key={id} onClick={() => setActive(id)} className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${active === id ? 'bg-[color:var(--gold)] font-bold text-black' : 'text-[color:var(--muted)] hover:bg-white/5 hover:text-white'}`}>{label}</button>)}<Link href="/admin/cai-dat/ai" className="block rounded-xl px-3 py-2.5 text-sm text-violet-200 hover:bg-violet-400/10">AI/API</Link></aside><section className="min-w-0 rounded-2xl border border-white/10 bg-[color:var(--surface)] p-5 md:p-6"><div className="mb-6 border-b border-white/10 pb-4"><h2 className="text-xl font-bold">{activeLabel}</h2><p className="mt-1 text-sm text-[color:var(--muted)]">Các thay đổi chỉ được áp dụng sau khi bấm “Lưu cài đặt”.</p></div>{loading ? <p>Đang tải cài đặt...</p> : <Fields value={current} update={update} chooseImage={setMediaField} mediaPreviews={mediaPreviews} />}</section></div>
    <MediaPicker isOpen={Boolean(mediaField)} onClose={() => setMediaField(null)} onSelect={(items: MediaItem[]) => { if (mediaField && items[0]) { update(mediaField, items[0].id); setMediaPreviews((old) => ({ ...old, [items[0].id]: { url: items[0].src, alt: items[0].alt } })) } setMediaField(null) }} />
  </div>
}
