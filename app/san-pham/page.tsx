import { getProductList, getVisibleCategories, getVisibleBrands } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import ProductListingPage from '@/components/products/product-listing-page'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Danh sách sản phẩm | Khanh Nguyên Forklift',
    description: 'Chuyên cung cấp các loại xe nâng Nhật bãi nhập khẩu chính hãng Toyota, Komatsu, Mitsubishi, TCM... Đầy đủ chủng loại xe nâng điện, xe nâng dầu, xe nâng tay.',
    alternates: {
      canonical: '/san-pham',
    },
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined
  const brand = typeof resolvedParams.brand === 'string' ? resolvedParams.brand : undefined
  const fuel = typeof resolvedParams.fuel === 'string' ? resolvedParams.fuel : undefined
  const condition = typeof resolvedParams.condition === 'string' ? resolvedParams.condition : undefined
  const capacity = typeof resolvedParams.capacity === 'string' ? resolvedParams.capacity : undefined
  const liftHeight = typeof resolvedParams.liftHeight === 'string' ? resolvedParams.liftHeight : undefined
  const minPrice = typeof resolvedParams.minPrice === 'string' ? parseFloat(resolvedParams.minPrice) : undefined
  const maxPrice = typeof resolvedParams.maxPrice === 'string' ? parseFloat(resolvedParams.maxPrice) : undefined
  const sort = typeof resolvedParams.sort === 'string' ? (resolvedParams.sort as any) : undefined

  const [result, categories, brands] = await Promise.all([
    getProductList({
      q,
      category,
      brand,
      fuel,
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
      <ProductListingPage
        result={result}
        categories={categories}
        brands={brands}
        currentParams={{
          q,
          category,
          brand,
          fuel,
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
