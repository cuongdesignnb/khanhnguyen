import prisma from '@/lib/prisma'

export async function validateBrandLogo(logoId: string | null | undefined) {
  if (logoId === null || logoId === undefined) return { valid: true as const }

  const logo = await prisma.mediaFile.findFirst({
    where: { id: logoId, deletedAt: null },
    select: { id: true, type: true, url: true },
  })
  if (!logo) return { valid: false as const, error: 'Logo không tồn tại hoặc đã bị xóa.' }
  if (logo.type !== 'IMAGE') return { valid: false as const, error: 'Logo thương hiệu phải là hình ảnh.' }
  if (!logo.url || (!logo.url.startsWith('/') && !/^https?:\/\//i.test(logo.url))) {
    return { valid: false as const, error: 'URL file logo không hợp lệ.' }
  }
  return { valid: true as const }
}
