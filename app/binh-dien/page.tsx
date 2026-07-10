import { getProductList, getVisibleCategories, getVisibleBrands, getCategoryBySlug, parseProductListParams } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import CategoryProductPage from '@/components/products/category-product-page'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug('binh-dien')
  return {
    title: `${category?.name || 'Bình điện'} | Khanh Nguyên Forklift`,
    description: category?.description || 'Bình điện xe nâng Nhật Bản, bình ắc quy xe nâng chính hãng Hitachi, Kobe, GS Yuasa... Nhập khẩu bảo hành uy tín.',
    alternates: { canonical: '/binh-dien' },
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const parsedParams = parseProductListParams(resolvedParams)

  const [category, result, categories, brands] = await Promise.all([
    getCategoryBySlug('binh-dien'),
    getProductList({
      ...parsedParams,
      category: 'binh-dien',
    }),
    getVisibleCategories(),
    getVisibleBrands(),
  ])

  return (
    <PublicPageShell>
      <CategoryProductPage
        category={category}
        categorySlug="binh-dien"
        categoryTitle="Bình điện"
        result={result}
        categories={categories}
        brands={brands}
        currentParams={{
          ...parsedParams,
          category: 'binh-dien',
        }}
      />
    </PublicPageShell>
  )
}
