import { getProductList, getVisibleCategories, getVisibleBrands, getCategoryBySlug, parseProductListParams } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import CategoryProductPage from '@/components/products/category-product-page'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('xe-nang-moi')
  return {
    title: `${category?.name || 'Xe nâng mới'} | Khanh Nguyên Forklift`,
    description: category?.description || 'Chuyên mua bán các dòng xe nâng mới nhập khẩu chính hãng, bảo hành dài hạn.',
    alternates: { canonical: '/xe-nang-moi' },
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const parsedParams = parseProductListParams(resolvedParams)

  const [category, result, categories, brands] = await Promise.all([
    getCategoryBySlug('xe-nang-moi'),
    getProductList({
      ...parsedParams,
      category: 'xe-nang-moi',
    }),
    getVisibleCategories(),
    getVisibleBrands(),
  ])

  return (
    <PublicPageShell>
      <CategoryProductPage
        category={category}
        categorySlug="xe-nang-moi"
        categoryTitle="Xe nâng mới"
        result={result}
        categories={categories}
        brands={brands}
        currentParams={{
          ...parsedParams,
          category: 'xe-nang-moi',
        }}
      />
    </PublicPageShell>
  )
}
