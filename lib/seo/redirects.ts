import prisma from '@/lib/prisma'

export async function recordSeoRedirect(sourcePath: string, targetPath: string) {
  if (!sourcePath.startsWith('/') || !targetPath.startsWith('/') || sourcePath === targetPath) return
  const reverse = await prisma.seoRedirect.findFirst({ where: { sourcePath: targetPath, targetPath: sourcePath, isActive: true } })
  if (reverse) await prisma.seoRedirect.update({ where: { id: reverse.id }, data: { isActive: false } })
  await prisma.seoRedirect.upsert({
    where: { sourcePath },
    update: { targetPath, statusCode: 301, isActive: true },
    create: { sourcePath, targetPath, statusCode: 301 },
  })
}
