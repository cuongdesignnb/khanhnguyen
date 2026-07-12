import prisma from '@/lib/prisma'
import { normalizeProductSpecs } from '@/lib/products/normalize-product-specs'

async function main() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, slug: true, specs: { orderBy: { sortOrder: 'asc' } } },
  })
  let invalidCount = 0

  for (const product of products) {
    const invalid = product.specs.filter((spec) => /^\d+$/.test(spec.label.trim()) || spec.value.trim().toLowerCase() === '[object object]')
    if (!invalid.length) continue
    invalidCount += invalid.length
    console.log(`- ${product.name} (${product.slug}): ${invalid.length} specs lỗi`)
    invalid.forEach((spec) => console.log(`  ${spec.label}: ${spec.value}`))
  }

  const normalizedCount = products.reduce((total, product) => total + normalizeProductSpecs(product.specs).length, 0)
  console.log(`\nTổng ProductSpec: ${products.reduce((total, product) => total + product.specs.length, 0)}`)
  console.log(`ProductSpec hợp lệ sau normalize: ${normalizedCount}`)
  console.log(`ProductSpec lỗi cần xem xét: ${invalidCount}`)
  process.exitCode = invalidCount ? 2 : 0
}

main().finally(() => prisma.$disconnect())
