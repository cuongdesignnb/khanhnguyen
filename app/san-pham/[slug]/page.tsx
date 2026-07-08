import { getProductBySlug, getRelatedProducts } from '@/lib/public-data'
import { notFound } from 'next/navigation'
import PublicPageShell from '@/components/public/public-page-shell'
import ProductDetailPage from '@/components/products/product-detail-page'
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

  return (
    <PublicPageShell>
      <ProductDetailPage product={product} relatedProducts={relatedProducts} />
    </PublicPageShell>
  )
}
