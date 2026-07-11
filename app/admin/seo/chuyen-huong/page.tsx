import RedirectManager from '@/components/admin/seo/redirect-manager'

export default function SeoRedirectPage() {
  return <div className="space-y-6 p-6 text-white"><div><h1 className="text-2xl font-black">Chuyển hướng SEO</h1><p className="mt-1 text-sm text-[color:var(--muted)]">Quản lý chuyển hướng 301 và ngăn vòng lặp URL.</p></div><RedirectManager /></div>
}
