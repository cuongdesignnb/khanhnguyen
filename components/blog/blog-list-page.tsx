'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHero from '@/components/public/page-hero'
import Breadcrumb from '@/components/public/breadcrumb'
import BlogCard from './blog-card'
import BlogSidebar from './blog-sidebar'
import ProductPagination from '@/components/products/product-pagination'
import ProductListEmpty from '@/components/products/product-list-empty'
import { PostListResult, PostListParams } from '@/types/public'
import { Search } from 'lucide-react'

interface BlogListPageProps {
  result: PostListResult
  categoryName?: string
  categorySlug?: string
  currentParams: PostListParams
}

export default function BlogListPage({
  result,
  categoryName,
  categorySlug,
  currentParams,
}: BlogListPageProps) {
  const router = useRouter()
  const [searchVal, setSearchVal] = useState(currentParams.q || '')

  const basePath = categorySlug ? `/tin-tuc/danh-muc/${categorySlug}` : '/tin-tuc'

  const updateFilters = (newParams: Partial<PostListParams>) => {
    const updated = { ...currentParams, ...newParams }
    if (newParams.page === undefined) {
      updated.page = 1
    }

    const query = new URLSearchParams()
    Object.entries(updated).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.set(key, String(val))
      }
    })

    const queryString = query.toString()
    router.push(`${basePath}${queryString ? `?${queryString}` : ''}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ q: searchVal })
  }

  const clearAllFilters = () => {
    setSearchVal('')
    router.push(basePath)
  }

  const pageTitle = categoryName ? `Chuyên mục: ${categoryName}` : 'TIN TỨC & KINH NGHIỆM'
  const pageSubtitle = categoryName
    ? `Các bài viết chia sẻ về ${categoryName}`
    : 'Kinh nghiệm vận hành – Hướng dẫn bảo dưỡng xe nâng từ chuyên gia'

  const breadcrumbs = categoryName
    ? [
        { label: 'Tin tức', href: '/tin-tuc' },
        { label: categoryName },
      ]
    : [{ label: 'Tin tức' }]

  return (
    <div className="bg-[color:var(--surface)] min-h-screen text-white pb-16">
      <PageHero title={pageTitle} subtitle={pageSubtitle} />
      <Breadcrumb items={breadcrumbs} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main List */}
          <main className="lg:col-span-8 space-y-6">
            {/* Mobile search bar */}
            <form onSubmit={handleSearchSubmit} className="relative block lg:hidden">
              <input
                type="search"
                placeholder="Tìm bài viết..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[color:var(--muted)] focus:outline-none focus:border-[color:var(--gold)]"
              />
              <Search className="absolute left-3.5 top-3 text-[color:var(--muted)]" size={16} />
            </form>

            {result.items.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {result.items.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                <ProductPagination
                  currentPage={result.page}
                  totalPages={result.totalPages}
                  onChange={(page) => updateFilters({ page })}
                />
              </>
            ) : (
              <ProductListEmpty onClear={clearAllFilters} />
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <BlogSidebar
              searchVal={searchVal}
              onSearchChange={setSearchVal}
              onSearchSubmit={handleSearchSubmit}
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
