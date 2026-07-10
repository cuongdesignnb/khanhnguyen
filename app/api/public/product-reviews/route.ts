import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { handleUpload } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const productId = formData.get('productId') as string | null
    const name = (formData.get('name') as string | null)?.trim()
    const phone = (formData.get('phone') as string | null)?.trim()
    const ratingStr = formData.get('rating') as string | null
    const content = (formData.get('content') as string | null)?.trim()

    // 1. Validation basic fields
    if (!productId) {
      return api.badRequest('Thiếu ID sản phẩm')
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, deletedAt: null }
    })
    if (!product) {
      return api.badRequest('Sản phẩm không tồn tại')
    }

    if (!name) {
      return api.badRequest('Vui lòng nhập họ tên')
    }

    if (!phone || phone.length < 8) {
      return api.badRequest('Số điện thoại không hợp lệ (tối thiểu 8 ký tự)')
    }

    if (!ratingStr) {
      return api.badRequest('Vui lòng chọn số sao đánh giá')
    }

    const rating = parseInt(ratingStr, 10)
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return api.badRequest('Số sao đánh giá phải từ 1 đến 5')
    }

    if (!content) {
      return api.badRequest('Vui lòng nhập nội dung đánh giá')
    }

    // 2. Anti-spam check: 1 review per product per phone every 1 minute
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000)
    const spamCheck = await prisma.productReview.findFirst({
      where: {
        productId,
        phone,
        createdAt: { gte: oneMinuteAgo }
      }
    })
    if (spamCheck) {
      return api.badRequest('Bạn đã gửi một đánh giá gần đây. Vui lòng đợi 1 phút để tiếp tục.')
    }

    // 3. Image uploads parsing
    const files: File[] = []
    const allImages = formData.getAll('images')
    const allImagesBrackets = formData.getAll('images[]')
    const combined = [...allImages, ...allImagesBrackets]

    for (const item of combined) {
      if (item instanceof File) {
        files.push(item)
      }
    }

    if (files.length > 5) {
      return api.badRequest('Chỉ được upload tối đa 5 hình ảnh')
    }

    // Validate size and format
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return api.badRequest(`Ảnh ${file.name} vượt quá dung lượng cho phép (tối đa 5MB)`)
      }
      if (!allowedMimeTypes.includes(file.type)) {
        return api.badRequest(`Định dạng ảnh ${file.name} không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP`)
      }
    }

    // 4. Create Product Review in PENDING status
    const review = await prisma.productReview.create({
      data: {
        productId,
        name,
        phone,
        rating,
        content,
        status: 'PENDING'
      }
    })

    // 5. Upload files and link them
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        // Upload to media system (this automatically converts to WebP if supported)
        const uploadResult = await handleUpload(file)
        
        await prisma.productReviewImage.create({
          data: {
            reviewId: review.id,
            mediaId: uploadResult.id,
            sortOrder: i
          }
        })
      } catch (uploadError: any) {
        console.error(`Error uploading review image ${file.name}:`, uploadError)
        // Continue uploading other files even if one fails
      }
    }

    return api.ok(
      null,
      'Cảm ơn bạn đã gửi đánh giá. Đánh giá sẽ được hiển thị sau khi được duyệt.'
    )
  } catch (error: any) {
    console.error('Submit review error:', error)
    return api.serverError(error.message || 'Lỗi gửi đánh giá')
  }
}

export const dynamic = 'force-dynamic'
