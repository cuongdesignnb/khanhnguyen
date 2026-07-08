import { getProductBySlug, getRelatedProducts } from '@/lib/public-data'
import { notFound } from 'next/navigation'
import PublicPageShell from '@/components/public/public-page-shell'
import ProductDetailPage from '@/components/products/product-detail-page'
import JsonLd from '@/components/seo/json-ld'
import { productSchema, breadcrumbSchema } from '@/lib/schema'
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
  return {
    title: `${product.name} | Khanh Nguyên Forklift`,
    description: product.seoDescription || product.shortDescription || `${product.name} chất lượng cao Nhật bãi. Tải trọng ${product.capacity || ''}, nâng cao ${product.liftHeight || ''}.`,
    alternates: {
      canonical: `/san-pham/${product.slug}`,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId, 6)
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://khanhnguyenforklift.vn'
  
  const breadcrumbs = [
    { label: 'Trang chủ', url: origin },
    { label: 'Sản phẩm', url: `${origin}/san-pham` },
    { label: product.categoryName, url: `${origin}/${product.categorySlug}` },
    { label: product.name, url: `${origin}/san-pham/${product.slug}` },
  ]

  return (
    <>
      <JsonLd schema={productSchema(product, origin)} />
      <JsonLd schema={breadcrumbSchema(breadcrumbs)} />
      <PublicPageShell>
        <ProductDetailPage product={product} relatedProducts={relatedProducts} />
      </PublicPageShell>
    </>
  )
}
