'use client'

import { useState } from 'react'
import AdminPageHeader from '../admin-page-header'
import AdminStatCard from '../admin-stat-card'
import AdminButton from '../admin-button'
import OrdersFilterBar from './orders-filter-bar'
import OrdersTable from './orders-table'
import OrderDetailPanel from './order-detail-panel'
import OrderCreatePanel from './order-create-panel'
import { orderStats, adminOrders } from '@/data/admin'
import { Plus, RefreshCw } from 'lucide-react'
import type { OrderAdminItem } from '@/types/admin'
import { useAdminList } from '@/hooks/use-admin-list'
import { adminApi } from '@/lib/admin-api'
import { mapOrderToAdminItem } from '@/lib/admin-mappers'

export default function OrdersAdminPage() {
  const [detailOpen, setDetailOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderAdminItem | null>(null)

  const {
    items: orders,
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
  } = useAdminList<any, OrderAdminItem>({
    fetcher: adminApi.getOrders,
    initialParams: {
      page: 1,
      limit: 10,
      q: '',
      orderStatus: '',
      paymentStatus: '',
      source: '',
      deliveryMethod: '',
    },
    fallbackData: adminOrders,
    mapItem: mapOrderToAdminItem,
  })

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
            <AdminButton icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
              Tạo đơn hàng
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

      {usingFallback && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs rounded-xl flex items-center justify-between animate-fade-in">
          <span>Đang sử dụng dữ liệu tạm. Vui lòng kiểm tra kết nối database.</span>
          <button onClick={reload} className="p-1 hover:bg-white/5 rounded-lg text-amber-400">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      <OrdersFilterBar params={params} setParams={setParams} />

      <OrdersTable
        orders={orders}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={(p) => setParams({ page: p })}
        onView={(order) => {
          setSelectedOrder(order)
          setDetailOpen(true)
        }}
        onEdit={(order) => {
          setSelectedOrder(order)
          setDetailOpen(true)
        }}
      />

      <OrderDetailPanel
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        order={selectedOrder}
        onSaved={reload}
      />

      <OrderCreatePanel
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={reload}
      />
    </>
  )
}
