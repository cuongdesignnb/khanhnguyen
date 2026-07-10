import { getProductList, getVisibleCategories, getVisibleBrands, getCategoryBySlug, parseProductListParams } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import CategoryProductPage from '@/components/products/category-product-page'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('xe-cau')
  return {
    title: `${category?.name || 'Xe cẩu'} | Khanh Nguyên Forklift`,
    description: category?.description || 'Mua bán cho thuê các dòng xe cẩu tự hành, xe cẩu chuyên dụng Unic, Tadano nhập khẩu nguyên chiếc từ Nhật Bản giá cạnh tranh nhất.',
    alternates: { canonical: '/xe-cau' },
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const parsedParams = parseProductListParams(resolvedParams)

  const [category, result, categories, brands] = await Promise.all([
    getCategoryBySlug('xe-cau'),
    getProductList({
      ...parsedParams,
      category: 'xe-cau',
    }),
    getVisibleCategories(),
    getVisibleBrands(),
  ])

  return (
    <PublicPageShell>
      <CategoryProductPage
        category={category}
        categorySlug="xe-cau"
        categoryTitle="Xe cẩu"
        result={result}
        categories={categories}
        brands={brands}
        currentParams={{
          ...parsedParams,
          category: 'xe-cau',
        }}
      />
    </PublicPageShell>
  )
}
