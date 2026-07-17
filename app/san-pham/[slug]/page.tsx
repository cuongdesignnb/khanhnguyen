import { getProductBySlug, getRelatedProducts } from '@/lib/public-data'
import { notFound } from 'next/navigation'
import PublicPageShell from '@/components/public/public-page-shell'
import ProductDetailPage from '@/components/products/product-detail-page'
import JsonLd from '@/components/seo/json-ld'
import { buildProductSchema, buildBreadcrumbSchema } from '@/lib/seo/schemas'
import { buildProductMetadata } from '@/lib/seo/metadata'
import { getSeoConfig } from '@/lib/seo/config'
import { getProductCategoryHref } from '@/lib/products/category-url'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)
  if (!product) {
    return { title: 'Không tìm thấy sản phẩm' }
  }
  return buildProductMetadata({ title: product.seoTitle || product.name, description: product.seoDescription || product.shortDescription,
    canonicalPath: `/san-pham/${product.slug}`, canonicalUrl: product.canonicalUrl, ogTitle: product.ogTitle,
    ogDescription: product.ogDescription, ogImage: product.ogImage || product.thumbnail, robotsIndex: product.robotsIndex, robotsFollow: product.robotsFollow })
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId, 6)
  const seoConfig = await getSeoConfig()
  const origin = seoConfig.siteUrl
  
  const breadcrumbs = [
    { label: 'Trang chủ', url: origin },
    { label: 'Sản phẩm', url: `${origin}/san-pham` },
    { label: product.categoryName, url: `${origin}${getProductCategoryHref(product.categorySlug)}` },
    { label: product.name, url: `${origin}/san-pham/${product.slug}` },
  ]

  return (
    <>
      {seoConfig.schemas.productEnabled && <JsonLd data={buildProductSchema(product, seoConfig)} />}
      {seoConfig.schemas.breadcrumbEnabled && <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />}
      <PublicPageShell>
        <ProductDetailPage product={product} relatedProducts={relatedProducts} />
      </PublicPageShell>
    </>
  )
}
