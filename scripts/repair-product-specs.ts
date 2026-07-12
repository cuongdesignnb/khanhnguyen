import prisma from '@/lib/prisma'
import { featuredProducts } from '@/data/home'
import { normalizeProductSpecs } from '@/lib/products/normalize-product-specs'
import { toVietnameseSlug } from '@/lib/slug'

const dryRun = process.argv.includes('--dry-run')

async function main() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: { brand: true, specs: { orderBy: { sortOrder: 'asc' } } },
  })
  let repairedProducts = 0
  let removedSpecs = 0
  let createdSpecs = 0

  for (const product of products) {
    const invalid = product.specs.filter((spec) => /^\d+$/.test(spec.label.trim()) || spec.value.trim().toLowerCase() === '[object object]')
    if (!invalid.length) continue

    const staticProduct = featuredProducts.find((item) => item.id === product.slug || toVietnameseSlug(item.name) === product.slug)
    const sourceSpecs = staticProduct?.specs || []
    const normalized = normalizeProductSpecs(sourceSpecs, {
      model: product.model,
      brand: product.brand?.name,
      capacity: product.capacity,
      liftHeight: product.liftHeight,
      fuelType: product.fuelType,
      manufactureYear: product.manufactureYear,
      condition: product.condition,
      origin: product.origin,
      forkLength: product.forkLength,
    })
    const validKeys = new Set(normalizeProductSpecs(product.specs.filter((spec) => !invalid.includes(spec))).map((spec) => spec.key))
    const replacements = normalized.filter((spec) => !validKeys.has(spec.key))

    console.log(`${dryRun ? '[DRY-RUN] ' : ''}${product.name} (${product.slug})`)
    console.log(`  Xóa ${invalid.length} specs lỗi; thêm ${replacements.length} specs hợp lệ.`)
    replacements.forEach((spec) => console.log(`  + ${spec.label}: ${spec.value}`))

    if (!dryRun) {
      await prisma.$transaction([
        prisma.productSpec.deleteMany({ where: { id: { in: invalid.map((spec) => spec.id) } } }),
        ...replacements.map((spec, index) => prisma.productSpec.create({ data: {
          productId: product.id,
          key: spec.key,
          label: spec.label,
          value: spec.value,
          sortOrder: index,
        } })),
      ])
    }
    repairedProducts += 1
    removedSpecs += invalid.length
    createdSpecs += replacements.length
  }

  console.log(`\n${dryRun ? 'Dry-run' : 'Hoàn tất'}: ${repairedProducts} sản phẩm, ${removedSpecs} specs lỗi, ${createdSpecs} specs thay thế.`)
  if (!dryRun) console.log('Hãy chạy lại npm run audit:product-specs để xác nhận.')
}

main().finally(() => prisma.$disconnect())
