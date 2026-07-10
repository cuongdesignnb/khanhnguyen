import { getProductList, getVisibleCategories, getVisibleBrands, getCategoryBySlug, parseProductListParams } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import CategoryProductPage from '@/components/products/category-product-page'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('xe-nang-dien')
  return {
    title: `${category?.name || 'Xe nâng điện'} | Khanh Nguyên Forklift`,
    description: category?.description || 'Chuyên dòng xe nâng điện ngồi lái, đứng lái Nhật bãi từ 1 tấn đến 3 tấn. Đầy đủ các hãng Toyota, Komatsu, Nichiyu, Mitsubishi.',
    alternates: { canonical: '/xe-nang-dien' },
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const parsedParams = parseProductListParams(resolvedParams)

  const [category, result, categories, brands] = await Promise.all([
    getCategoryBySlug('xe-nang-dien'),
    getProductList({
      ...parsedParams,
      category: 'xe-nang-dien',
      fuel: 'Điện',
    }),
    getVisibleCategories(),
    getVisibleBrands(),
  ])

  return (
    <PublicPageShell>
      <CategoryProductPage
        category={category}
        categorySlug="xe-nang-dien"
        categoryTitle="Xe nâng điện"
        result={result}
        categories={categories}
        brands={brands}
        currentParams={{
          ...parsedParams,
          category: 'xe-nang-dien',
          fuel: 'Điện',
        }}
      />
    </PublicPageShell>
  )
}
