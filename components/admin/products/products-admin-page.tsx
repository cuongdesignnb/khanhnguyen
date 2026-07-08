'use client'

import { useState, useEffect } from 'react'
import AdminPageHeader from '../admin-page-header'
import AdminButton from '../admin-button'
import ProductsFilterBar from './products-filter-bar'
import ProductsTable from './products-table'
import ProductEditorPanel from './product-editor-panel'
import { Plus, RefreshCw } from 'lucide-react'
import type { ProductAdminItem } from '@/types/admin'
import { useAdminList } from '@/hooks/use-admin-list'
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import { adminApi } from '@/lib/admin-api'
import { mapProductToAdminItem } from '@/lib/admin-mappers'
import AdminConfirmModal from '../admin-confirm-modal'
import { adminProducts } from '@/data/admin'

export default function ProductsAdminPage() {
  const [editorOpen, setEditorOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductAdminItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Dropdowns lists
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])

  useEffect(() => {
    // Load categories & brands lists for filters
    adminApi.getCategories().then((res) => setCategories(res || [])).catch(console.error)
    adminApi.getBrands().then((res) => setBrands(res || [])).catch(console.error)
  }, [])

  const {
    items: products,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    params,
    setParams,
    reload,
    usingFallback,
  } = useAdminList<any, ProductAdminItem>({
    fetcher: adminApi.getProducts,
    initialParams: {
      page: 1,
      limit: 10,
      q: '',
      categoryId: '',
      brandId: '',
      status: '',
      stockStatus: '',
      isFeatured: '',
      showOnHome: '',
    },
    fallbackData: adminProducts,
    mapItem: mapProductToAdminItem,
  })

  const { mutate: deleteProduct, loading: deleting } = useAdminMutation(
    adminApi.deleteProduct,
    {
      successMessage: 'Xóa sản phẩm thành công',
      onSuccess: () => {
        setDeleteId(null)
        reload()
      },
    }
  )

  const handleToggleVisibility = async (id: string, currentVal: boolean) => {
    try {
      await adminApi.updateProduct(id, { status: currentVal ? 'HIDDEN' : 'PUBLISHED' })
      reload()
    } catch (err) {
      // Toast handles error automatically
    }
  }

  const handleToggleFeatured = async (id: string, currentVal: boolean) => {
    try {
      await adminApi.updateProduct(id, { isFeatured: !currentVal })
      reload()
    } catch (err) {
      // Toast handles error
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Quản lý sản phẩm"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Sản phẩm' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <AdminButton
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setSelectedProduct(null)
                setEditorOpen(true)
              }}
            >
              Thêm sản phẩm
            </AdminButton>
          </div>
        }
      />

      {usingFallback && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs rounded-xl flex items-center justify-between">
          <span>Đang sử dụng dữ liệu tạm. Vui lòng kiểm tra kết nối database.</span>
          <button onClick={reload} className="p-1 hover:bg-white/5 rounded-lg text-amber-400">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      <ProductsFilterBar
        params={params}
        setParams={setParams}
        categories={categories}
        brands={brands}
      />

      <ProductsTable
        products={products}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={(p) => setParams({ page: p })}
        onEdit={(p) => {
          setSelectedProduct(p)
          setEditorOpen(true)
        }}
        onDelete={(id) => setDeleteId(id)}
        onToggleVisibility={handleToggleVisibility}
        onToggleFeatured={handleToggleFeatured}
      />

      <ProductEditorPanel
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        product={selectedProduct}
        categories={categories}
        brands={brands}
        onSaved={reload}
      />

      <AdminConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteProduct(deleteId)
        }}
        loading={deleting}
        title="Xóa sản phẩm"
        description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống? Dữ liệu đơn hàng hoặc báo giá cũ liên quan có thể bị ảnh hưởng."
      />
    </>
  )
}
