import { getProductList, getVisibleCategories, getVisibleBrands, getCategoryBySlug } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import CategoryProductPage from '@/components/products/category-product-page'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('xe-nang-dien-ngoi-lai')
  return {
    title: `${category?.name || 'Xe nâng điện ngồi lái'} | Khanh Nguyên Forklift`,
    description: category?.description || 'Xe nâng điện ngồi lái Nhật bãi, tải trọng nâng từ 1.5 tấn đến 3 tấn. Đầy đủ các hãng Komatsu, Toyota, Mitsubishi, Sumitomo.',
    alternates: { canonical: '/xe-nang-dien/ngoi-lai' },
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined
  const brand = typeof resolvedParams.brand === 'string' ? resolvedParams.brand : undefined
  const fuel = typeof resolvedParams.fuel === 'string' ? resolvedParams.fuel : undefined
  const condition = typeof resolvedParams.condition === 'string' ? resolvedParams.condition : undefined
  const capacity = typeof resolvedParams.capacity === 'string' ? resolvedParams.capacity : undefined
  const liftHeight = typeof resolvedParams.liftHeight === 'string' ? resolvedParams.liftHeight : undefined
  const minPrice = typeof resolvedParams.minPrice === 'string' ? parseFloat(resolvedParams.minPrice) : undefined
  const maxPrice = typeof resolvedParams.maxPrice === 'string' ? parseFloat(resolvedParams.maxPrice) : undefined
  const sort = typeof resolvedParams.sort === 'string' ? (resolvedParams.sort as any) : undefined

  const [category, result, categories, brands] = await Promise.all([
    getCategoryBySlug('xe-nang-dien-ngoi-lai'),
    getProductList({
      q,
      category: 'xe-nang-dien-ngoi-lai',
      brand,
      fuel: 'Điện',
      condition,
      capacity,
      liftHeight,
      minPrice,
      maxPrice,
      sort,
      page,
      limit: 12,
    }),
    getVisibleCategories(),
    getVisibleBrands(),
  ])

  return (
    <PublicPageShell>
      <CategoryProductPage
        category={category}
        categorySlug="xe-nang-dien/ngoi-lai"
        categoryTitle="Xe nâng điện ngồi lái"
        result={result}
        categories={categories}
        brands={brands}
        currentParams={{
          q,
          brand,
          fuel: 'Điện',
          condition,
          capacity,
          liftHeight,
          minPrice,
          maxPrice,
          sort,
          page,
        }}
      />
    </PublicPageShell>
  )
}
