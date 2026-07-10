import { getProductList, getVisibleCategories, getVisibleBrands, getCategoryBySlug, parseProductListParams } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import CategoryProductPage from '@/components/products/category-product-page'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('phu-tung')
  return {
    title: `${category?.name || 'Phụ tùng'} | Khanh Nguyên Forklift`,
    description: category?.description || 'Phụ tùng xe nâng chính hãng, bánh xe nâng điện PU, lốp xe nâng, lọc nhớt, heo thắng, bộ đề... Đầy đủ linh kiện sẵn có.',
    alternates: { canonical: '/phu-tung' },
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const parsedParams = parseProductListParams(resolvedParams)

  const [category, result, categories, brands] = await Promise.all([
    getCategoryBySlug('phu-tung'),
    getProductList({
      ...parsedParams,
      category: 'phu-tung',
    }),
    getVisibleCategories(),
    getVisibleBrands(),
  ])

  return (
    <PublicPageShell>
      <CategoryProductPage
        category={category}
        categorySlug="phu-tung"
        categoryTitle="Phụ tùng"
        result={result}
        categories={categories}
        brands={brands}
        currentParams={{
          ...parsedParams,
          category: 'phu-tung',
        }}
      />
    </PublicPageShell>
  )
}
