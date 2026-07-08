import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import * as api from '@/lib/api-response'
import { mediaSchema } from '@/lib/validators/media'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const mediaFile = await prisma.mediaFile.findFirst({
      where: { id, deletedAt: null },
      include: {
        folder: true,
      },
    })

    if (!mediaFile) {
      return api.notFound('Không tìm thấy tập tin đa phương tiện')
    }

    return api.ok(mediaFile)
  } catch (error: any) {
    console.error('MediaFile Get API Error:', error)
    return api.serverError('Lỗi lấy thông tin tập tin đa phương tiện')
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existingFile = await prisma.mediaFile.findFirst({
      where: { id, deletedAt: null },
    })

    if (!existingFile) {
      return api.notFound('Không tìm thấy tập tin đa phương tiện')
    }

    const body = await request.json()

    // Sanitize empty string to null for folderId
    if (body.folderId === '') body.folderId = null

    const parsed = mediaSchema.partial().safeParse(body)
    if (!parsed.success) {
      return api.badRequest('Dữ liệu không hợp lệ', parsed.error.format())
    }

    if (parsed.data.folderId) {
      const folderExists = await prisma.mediaFolder.findFirst({
        where: { id: parsed.data.folderId, deletedAt: null },
      })
      if (!folderExists) {
        return api.badRequest('Thư mục không tồn tại hoặc đã bị xóa')
      }
    }

    const updatedFile = await prisma.mediaFile.update({
      where: { id },
      data: {
        alt: parsed.data.alt !== undefined ? parsed.data.alt : undefined,
        title: parsed.data.title !== undefined ? parsed.data.title : undefined,
        folderId: parsed.data.folderId !== undefined ? parsed.data.folderId : undefined,
      },
      include: {
        folder: true,
      },
    })

    return api.ok(updatedFile, 'Cập nhật thông tin tập tin thành công')
  } catch (error: any) {
    console.error('MediaFile Update API Error:', error)
    return api.serverError('Lỗi cập nhật tập tin đa phương tiện')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const mediaFile = await prisma.mediaFile.findFirst({
      where: { id, deletedAt: null },
    })

    if (!mediaFile) {
      return api.notFound('Không tìm thấy tập tin đa phương tiện')
    }

    await prisma.mediaFile.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return api.ok(null, 'Xóa tập tin thành công (soft delete)')
  } catch (error: any) {
    console.error('MediaFile Delete API Error:', error)
    return api.serverError('Lỗi xóa tập tin đa phương tiện')
  }
}
