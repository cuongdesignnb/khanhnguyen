import { getProductList, getVisibleCategories, getVisibleBrands, getCategoryBySlug, parseProductListParams } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import CategoryProductPage from '@/components/products/category-product-page'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('phu-kien')
  return {
    title: `${category?.name || 'Phụ kiện'} | Khanh Nguyên Forklift`,
    description: category?.description || 'Các loại phụ kiện xe nâng Nhật bãi, áo càng xe nâng, bộ dịch giá xe nâng, bộ kẹp giấy... Đầy đủ phụ kiện thiết bị nâng hạ.',
    alternates: { canonical: '/phu-kien' },
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const parsedParams = parseProductListParams(resolvedParams)

  const [category, result, categories, brands] = await Promise.all([
    getCategoryBySlug('phu-kien'),
    getProductList({
      ...parsedParams,
      category: 'phu-kien',
    }),
    getVisibleCategories(),
    getVisibleBrands(),
  ])

  return (
    <PublicPageShell>
      <CategoryProductPage
        category={category}
        categorySlug="phu-kien"
        categoryTitle="Phụ kiện"
        result={result}
        categories={categories}
        brands={brands}
        currentParams={{
          ...parsedParams,
          category: 'phu-kien',
        }}
      />
    </PublicPageShell>
  )
}
