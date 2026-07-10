import { getProductList, getVisibleCategories, getVisibleBrands, getCategoryBySlug, parseProductListParams } from '@/lib/public-data'
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
  const parsedParams = parseProductListParams(resolvedParams)

  const [category, result, categories, brands] = await Promise.all([
    getCategoryBySlug('xe-nang-dien-ngoi-lai'),
    getProductList({
      ...parsedParams,
      category: 'xe-nang-dien-ngoi-lai',
      fuel: 'Điện',
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
          ...parsedParams,
          category: 'xe-nang-dien-ngoi-lai',
          fuel: 'Điện',
        }}
      />
    </PublicPageShell>
  )
}
