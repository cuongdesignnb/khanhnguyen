'use client'

import { useState } from 'react'
import AdminPageHeader from '../admin-page-header'
import AdminStatCard from '../admin-stat-card'
import AdminButton from '../admin-button'
import OrdersFilterBar from './orders-filter-bar'
import OrdersTable from './orders-table'
import OrderDetailPanel from './order-detail-panel'
import OrderCreatePanel from './order-create-panel'
import { orderStats } from '@/data/admin'
import { Plus, FileSpreadsheet, Printer, Filter } from 'lucide-react'
import type { OrderAdminItem } from '@/types/admin'

export default function OrdersAdminPage() {
  const [detailOpen, setDetailOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderAdminItem | null>(null)

  return (
    <>
      <AdminPageHeader
        title="Quản lý đơn hàng"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Đơn hàng' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <AdminButton icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>Tạo đơn hàng</AdminButton>
            <AdminButton variant="secondary" icon={<FileSpreadsheet className="w-4 h-4" />}>
              Xuất Excel
            </AdminButton>
            <AdminButton variant="secondary" icon={<Printer className="w-4 h-4" />}>
              In danh sách
            </AdminButton>
            <AdminButton variant="ghost" icon={<Filter className="w-4 h-4" />}>
              Bộ lọc nâng cao
            </AdminButton>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {orderStats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <OrdersFilterBar />

      <OrdersTable
        onView={(order) => {
          setSelectedOrder(order)
          setDetailOpen(true)
        }}
      />

      <OrderDetailPanel
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        order={selectedOrder}
      />

      <OrderCreatePanel
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  )
}
