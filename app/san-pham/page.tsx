import { getProductList, getVisibleCategories, getVisibleBrands } from '@/lib/public-data'
import PublicPageShell from '@/components/public/public-page-shell'
import ProductListingPage from '@/components/products/product-listing-page'
import type { Metadata } from 'next'
import JsonLd from '@/components/seo/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { hasIndexBlockingQuery, paginatedCanonical } from '@/lib/seo/canonical'
import { buildBreadcrumbSchema, buildItemListSchema, buildWebPageSchema } from '@/lib/seo/schemas'
import { getSeoConfig } from '@/lib/seo/config'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const page = typeof params.page === 'string' ? Number(params.page) : 1
  const filtered = hasIndexBlockingQuery(params)
  return buildPageMetadata({ title: 'Danh sách sản phẩm', description: 'Xe nâng Nhật bãi, xe nâng điện, xe nâng dầu và thiết bị nâng hạ.',
    canonicalPath: paginatedCanonical('/san-pham', page), robotsIndex: !filtered, robotsFollow: true })
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1
  const minPrice = typeof resolvedParams.minPrice === 'string' ? parseFloat(resolvedParams.minPrice) : undefined
  const maxPrice = typeof resolvedParams.maxPrice === 'string' ? parseFloat(resolvedParams.maxPrice) : undefined

  const queryParams = {
    q: typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined,
    category: typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined,
    brand: typeof resolvedParams.brand === 'string' ? resolvedParams.brand : undefined,
    fuel: typeof resolvedParams.fuel === 'string' ? resolvedParams.fuel : undefined,
    condition: typeof resolvedParams.condition === 'string' ? resolvedParams.condition : undefined,
    capacity: typeof resolvedParams.capacity === 'string' ? resolvedParams.capacity : undefined,
    liftHeight: typeof resolvedParams.liftHeight === 'string' ? resolvedParams.liftHeight : undefined,
    origin: typeof resolvedParams.origin === 'string' ? resolvedParams.origin : undefined,
    manufactureYear: typeof resolvedParams.manufactureYear === 'string' ? resolvedParams.manufactureYear : undefined,
    stockStatus: typeof resolvedParams.stockStatus === 'string' ? resolvedParams.stockStatus : undefined,
    sort: typeof resolvedParams.sort === 'string' ? (resolvedParams.sort as any) : undefined,
    page,
    minPrice,
    maxPrice,
  }

  const [result, categories, brands] = await Promise.all([
    getProductList(queryParams),
    getVisibleCategories(),
    getVisibleBrands(),
  ])
  const seoConfig = await getSeoConfig()
  const canonical = `${seoConfig.siteUrl}${paginatedCanonical('/san-pham', page)}`

  return (
    <><JsonLd data={[
      buildWebPageSchema({ name: 'Danh sách sản phẩm', url: canonical, siteUrl: seoConfig.siteUrl, type: 'CollectionPage' }),
      buildItemListSchema(result.items.map((item) => ({ name: item.name, url: `${seoConfig.siteUrl}/san-pham/${item.slug}`, image: item.image }))),
      buildBreadcrumbSchema([{ label: 'Trang chủ', url: seoConfig.siteUrl }, { label: 'Sản phẩm', url: `${seoConfig.siteUrl}/san-pham` }]),
    ]} /><PublicPageShell>
      <ProductListingPage
        result={result}
        categories={categories}
        brands={brands}
        currentParams={queryParams}
      />
    </PublicPageShell></>
  )
}
