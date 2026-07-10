import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireMenuAdmin } from '@/lib/menu-admin'

const pages = [
  ['Trang chủ','/'],['Sản phẩm','/san-pham'],['Xe nâng mới','/xe-nang-moi'],['Xe nâng điện','/xe-nang-dien'],
  ['Xe nâng điện đứng lái','/xe-nang-dien/dung-lai'],['Xe nâng điện ngồi lái','/xe-nang-dien/ngoi-lai'],
  ['Xe nâng dầu','/xe-nang-dau'],['Xe nâng tay','/xe-nang-tay'],['Xe cẩu','/xe-cau'],['Bình điện','/binh-dien'],
  ['Phụ tùng','/phu-tung'],['Phụ kiện','/phu-kien'],['Xe nâng khác','/xe-nang-khac'],['Dịch vụ','/dich-vu'],
  ['Tin tức','/tin-tuc'],['Giới thiệu','/gioi-thieu'],['Liên hệ','/lien-he'],['Catalogue','/catalogue'],
  ['Kiểm tra đơn hàng','/kiem-tra-don-hang'],['So sánh','/so-sanh'],['Yêu thích','/yeu-thich'],
  ['Giỏ hàng','/gio-hang'],['Tài khoản','/tai-khoan'],['Hướng dẫn mua hàng','/ho-tro/huong-dan-mua-hang'],
  ['Bảo hành','/ho-tro/bao-hanh'],['Đổi trả','/ho-tro/doi-tra'],['Thanh toán','/ho-tro/thanh-toan'],['FAQ','/ho-tro/faq'],
].map(([label,url]) => ({ label, url, type: 'page' }))

export async function GET(request: NextRequest) {
  const auth = await requireMenuAdmin(request); if (auth.response) return auth.response
  const type = new URL(request.url).searchParams.get('type') || 'all'
  const [categories, products, services, posts, postCategories] = await Promise.all([
    prisma.category.findMany({ where: { deletedAt: null, isVisible: true }, select: { name: true, slug: true }, take: 100 }),
    prisma.product.findMany({ where: { deletedAt: null }, select: { name: true, slug: true }, take: 100 }),
    prisma.service.findMany({ where: { deletedAt: null }, select: { title: true, slug: true }, take: 100 }),
    prisma.post.findMany({ where: { deletedAt: null }, select: { title: true, slug: true }, take: 100 }),
    prisma.postCategory.findMany({ where: { deletedAt: null, isVisible: true }, select: { name: true, slug: true }, take: 100 }),
  ])
  const all = [
    ...pages,
    ...categories.map((x) => ({ label: x.name, url: `/san-pham?category=${x.slug}`, type: 'category' })),
    ...products.map((x) => ({ label: x.name, url: `/san-pham/${x.slug}`, type: 'product' })),
    ...services.map((x) => ({ label: x.title, url: `/dich-vu/${x.slug}`, type: 'service' })),
    ...posts.map((x) => ({ label: x.title, url: `/tin-tuc/${x.slug}`, type: 'post' })),
    ...postCategories.map((x) => ({ label: x.name, url: `/tin-tuc/danh-muc/${x.slug}`, type: 'post-category' })),
  ]
  return Response.json({ success: true, data: type === 'all' ? all : all.filter((item) => item.type === type) })
}
