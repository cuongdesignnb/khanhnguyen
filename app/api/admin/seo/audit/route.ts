import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request)
  if (auth.response) return auth.response
  const [products, posts, services, categories, redirects] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null, status: 'PUBLISHED', OR: [{ seoTitle: null }, { seoDescription: null }] } }),
    prisma.post.count({ where: { deletedAt: null, status: 'PUBLISHED', OR: [{ seoTitle: null }, { seoDescription: null }] } }),
    prisma.service.count({ where: { deletedAt: null, status: 'PUBLISHED', OR: [{ seoTitle: null }, { seoDescription: null }] } }),
    prisma.category.count({ where: { deletedAt: null, isVisible: true, OR: [{ seoTitle: null }, { seoDescription: null }] } }),
    prisma.seoRedirect.count({ where: { isActive: true } }),
  ])
  return Response.json({ success: true, data: { products, posts, services, categories, redirects } })
}

export const dynamic = 'force-dynamic'
