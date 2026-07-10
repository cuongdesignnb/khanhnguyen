import { getProductList, getVisibleCategories, getVisibleBrands, getCategoryBySlug, parseProductListParams } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import CategoryProductPage from '@/components/products/category-product-page'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('xe-nang-dau')
  return {
    title: `${category?.name || 'Xe nâng dầu'} | Khanh Nguyên Forklift`,
    description: category?.description || 'Xe nâng dầu Nhật bãi sức nâng từ 1.5 tấn đến 10 tấn. Đầy đủ các hãng Komatsu, Toyota, Mitsubishi, TCM chính hãng nhập trực tiếp từ Nhật.',
    alternates: { canonical: '/xe-nang-dau' },
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const parsedParams = parseProductListParams(resolvedParams)

  const [category, result, categories, brands] = await Promise.all([
    getCategoryBySlug('xe-nang-dau'),
    getProductList({
      ...parsedParams,
      category: 'xe-nang-dau',
      fuel: 'Dầu',
    }),
    getVisibleCategories(),
    getVisibleBrands(),
  ])

  return (
    <PublicPageShell>
      <CategoryProductPage
        category={category}
        categorySlug="xe-nang-dau"
        categoryTitle="Xe nâng dầu"
        result={result}
        categories={categories}
        brands={brands}
        currentParams={{
          ...parsedParams,
          category: 'xe-nang-dau',
          fuel: 'Dầu',
        }}
      />
    </PublicPageShell>
  )
}
