import { getProductList, getVisibleCategories, getVisibleBrands, getCategoryBySlug, parseProductListParams } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import CategoryProductPage from '@/components/products/category-product-page'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('xe-nang-dien-dung-lai')
  return {
    title: `${category?.name || 'Xe nâng điện đứng lái'} | Khanh Nguyên Forklift`,
    description: category?.description || 'Xe nâng điện đứng lái Nhật bãi, thiết kế nhỏ gọn thích hợp cho lối đi hẹp trong kho hàng. Nhập khẩu trực tiếp từ Nhật Bản.',
    alternates: { canonical: '/xe-nang-dien/dung-lai' },
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const parsedParams = parseProductListParams(resolvedParams)

  const [category, result, categories, brands] = await Promise.all([
    getCategoryBySlug('xe-nang-dien-dung-lai'),
    getProductList({
      ...parsedParams,
      category: 'xe-nang-dien-dung-lai',
      fuel: 'Điện',
    }),
    getVisibleCategories(),
    getVisibleBrands(),
  ])

  return (
    <PublicPageShell>
      <CategoryProductPage
        category={category}
        categorySlug="xe-nang-dien/dung-lai"
        categoryTitle="Xe nâng điện đứng lái"
        result={result}
        categories={categories}
        brands={brands}
        currentParams={{
          ...parsedParams,
          category: 'xe-nang-dien-dung-lai',
          fuel: 'Điện',
        }}
      />
    </PublicPageShell>
  )
}
