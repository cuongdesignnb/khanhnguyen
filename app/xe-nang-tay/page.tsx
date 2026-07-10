import { getProductList, getVisibleCategories, getVisibleBrands, getCategoryBySlug, parseProductListParams } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import CategoryProductPage from '@/components/products/category-product-page'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('xe-nang-tay')
  return {
    title: `${category?.name || 'Xe nâng tay'} | Khanh Nguyên Forklift`,
    description: category?.description || 'Xe nâng tay cao, xe nâng tay thấp tải trọng từ 1.5 tấn đến 3 tấn. Đầy đủ các thương hiệu giá rẻ chất lượng tốt.',
    alternates: { canonical: '/xe-nang-tay' },
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const parsedParams = parseProductListParams(resolvedParams)

  const [category, result, categories, brands] = await Promise.all([
    getCategoryBySlug('xe-nang-tay'),
    getProductList({
      ...parsedParams,
      category: 'xe-nang-tay',
    }),
    getVisibleCategories(),
    getVisibleBrands(),
  ])

  return (
    <PublicPageShell>
      <CategoryProductPage
        category={category}
        categorySlug="xe-nang-tay"
        categoryTitle="Xe nâng tay"
        result={result}
        categories={categories}
        brands={brands}
        currentParams={{
          ...parsedParams,
          category: 'xe-nang-tay',
        }}
      />
    </PublicPageShell>
  )
}
