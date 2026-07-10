import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'

export async function GET() {
  try {
    const [
      totalProducts,
      totalCategories,
      totalPosts,
      totalContacts,
      totalQuotes,
      totalOrders,
      recentContacts,
      recentQuotes,
      recentOrders,
      featuredProducts,
      newQuotes,
      processingQuotes,
      quotedQuotes,
      closedQuotes,
      ignoredQuotes,
      pendingReviewsCount,
      approvedReviewsCount
    ] = await Promise.all([
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.post.count({ where: { deletedAt: null } }),
      prisma.contact.count({ where: { deletedAt: null } }),
      prisma.quoteRequest.count({ where: { deletedAt: null } }),
      prisma.order.count({ where: { deletedAt: null } }),
      
      prisma.contact.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      
      prisma.quoteRequest.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { product: true }
      }),
      
      prisma.order.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      
      prisma.product.findMany({
        where: { isFeatured: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
        take: 5,
        include: { category: true }
      }),

      prisma.quoteRequest.count({ where: { status: 'NEW', deletedAt: null } }),
      prisma.quoteRequest.count({ where: { status: 'PROCESSING', deletedAt: null } }),
      prisma.quoteRequest.count({ where: { status: 'QUOTED', deletedAt: null } }),
      prisma.quoteRequest.count({ where: { status: 'CLOSED', deletedAt: null } }),
      prisma.quoteRequest.count({ where: { status: 'IGNORED', deletedAt: null } }),
      prisma.productReview.count({ where: { status: 'PENDING', deletedAt: null } }),
      prisma.productReview.count({ where: { status: 'APPROVED', deletedAt: null } })
    ])

    const stats = [
      { label: 'Tổng sản phẩm', value: totalProducts, change: 0, icon: 'Package' },
      { label: 'Danh mục', value: totalCategories, change: 0, icon: 'Folder' },
      { label: 'Bài viết', value: totalPosts, change: 0, icon: 'Newspaper' },
      { label: 'Liên hệ mới', value: totalContacts, change: 0, icon: 'Phone' },
      { label: 'Báo giá mới', value: totalQuotes, change: 0, icon: 'ClipboardList' },
      { label: 'Đơn hàng mới', value: totalOrders, change: 0, icon: 'ShoppingCart' },
      { label: 'Đánh giá chờ duyệt', value: pendingReviewsCount, change: 0, icon: 'MessageSquare' },
      { label: 'Đánh giá đã duyệt', value: approvedReviewsCount, change: 0, icon: 'MessageSquare' }
    ]

    const requestStatusSummary = {
      new: newQuotes,
      processing: processingQuotes,
      quoted: quotedQuotes,
      closed: closedQuotes,
      ignored: ignoredQuotes
    }

    const inquiryChartData = [
      { name: 'Tháng 1', website: 40, hot: 24 },
      { name: 'Tháng 2', website: 30, hot: 13 },
      { name: 'Tháng 3', website: 20, hot: 98 },
      { name: 'Tháng 4', website: 27, hot: 39 },
      { name: 'Tháng 5', website: 18, hot: 48 },
      { name: 'Tháng 6', website: 23, hot: 38 },
      { name: 'Tháng 7', website: 34, hot: 43 }
    ]

    return api.ok({
      stats,
      recentContacts,
      recentQuotes,
      recentOrders,
      featuredProducts,
      requestStatusSummary,
      inquiryChartData
    })
  } catch (error: any) {
    console.error('Dashboard API Error:', error)
    return api.serverError('Lỗi lấy dữ liệu dashboard')
  }
}
export const dynamic = 'force-dynamic'
