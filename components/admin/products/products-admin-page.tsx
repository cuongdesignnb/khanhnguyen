'use client'

import { useState } from 'react'
import AdminPageHeader from '../admin-page-header'
import AdminButton from '../admin-button'
import ProductsFilterBar from './products-filter-bar'
import ProductsTable from './products-table'
import ProductEditorPanel from './product-editor-panel'
import { Plus, FileSpreadsheet, Filter } from 'lucide-react'
import type { ProductAdminItem } from '@/types/admin'

export default function ProductsAdminPage() {
  const [editorOpen, setEditorOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductAdminItem | null>(null)

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
            <AdminButton variant="secondary" icon={<FileSpreadsheet className="w-4 h-4" />}>
              Xuất Excel
            </AdminButton>
            <AdminButton variant="ghost" icon={<Filter className="w-4 h-4" />}>
              Bộ lọc nâng cao
            </AdminButton>
          </div>
        }
      />

      <ProductsFilterBar />

      <ProductsTable
        onEdit={(p) => {
          setSelectedProduct(p)
          setEditorOpen(true)
        }}
      />

      <ProductEditorPanel
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        product={selectedProduct}
      />
    </>
  )
}
