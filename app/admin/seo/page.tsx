import Link from 'next/link'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function SeoDashboardPage() {
  const [products, posts, services, categories, redirects] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null, status: 'PUBLISHED', OR: [{ seoTitle: null }, { seoDescription: null }] } }),
    prisma.post.count({ where: { deletedAt: null, status: 'PUBLISHED', OR: [{ seoTitle: null }, { seoDescription: null }] } }),
    prisma.service.count({ where: { deletedAt: null, status: 'PUBLISHED', OR: [{ seoTitle: null }, { seoDescription: null }] } }),
    prisma.category.count({ where: { deletedAt: null, isVisible: true, OR: [{ seoTitle: null }, { seoDescription: null }] } }),
    prisma.seoRedirect.count({ where: { isActive: true } }),
  ])
  const cards = [['Sản phẩm thiếu SEO', products], ['Bài viết thiếu SEO', posts], ['Dịch vụ thiếu SEO', services], ['Danh mục thiếu SEO', categories], ['Chuyển hướng đang bật', redirects]] as const
  return <div className="space-y-6 p-6 text-white"><div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-black">Tổng quan SEO</h1><p className="mt-1 text-sm text-[color:var(--muted)]">Theo dõi nội dung còn thiếu tiêu đề hoặc mô tả SEO.</p></div><div className="flex gap-2"><Link href="/admin/cai-dat" className="rounded-xl border border-white/15 px-4 py-2 text-sm">Cài đặt SEO</Link><Link href="/admin/seo/chuyen-huong" className="rounded-xl bg-[color:var(--gold)] px-4 py-2 text-sm font-bold text-black">Chuyển hướng 301</Link></div></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-[color:var(--surface)] p-5"><p className="text-sm text-[color:var(--muted)]">{label}</p><p className="mt-3 text-3xl font-black text-[color:var(--gold)]">{value}</p></div>)}</div></div>
}
