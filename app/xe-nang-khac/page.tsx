import { getProductList, getVisibleCategories, getVisibleBrands, getCategoryBySlug, parseProductListParams } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import CategoryProductPage from '@/components/products/category-product-page'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('xe-nang-khac')
  return {
    title: `${category?.name || 'Xe nâng khác'} | Khanh Nguyên Forklift`,
    description: category?.description || 'Các chủng loại xe nâng đặc biệt khác: xe nâng tay cao điện, thang nâng người, các dòng xe nâng chuyên dụng Nhật bãi.',
    alternates: { canonical: '/xe-nang-khac' },
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const parsedParams = parseProductListParams(resolvedParams)

  const [category, result, categories, brands] = await Promise.all([
    getCategoryBySlug('xe-nang-khac'),
    getProductList({
      ...parsedParams,
      category: 'xe-nang-khac',
    }),
    getVisibleCategories(),
    getVisibleBrands(),
  ])

  return (
    <PublicPageShell>
      <CategoryProductPage
        category={category}
        categorySlug="xe-nang-khac"
        categoryTitle="Xe nâng khác"
        result={result}
        categories={categories}
        brands={brands}
        currentParams={{
          ...parsedParams,
          category: 'xe-nang-khac',
        }}
      />
    </PublicPageShell>
  )
}
