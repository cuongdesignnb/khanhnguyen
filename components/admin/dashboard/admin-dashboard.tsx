'use client'

import Link from 'next/link'
import { Plus, FileSpreadsheet, Upload } from 'lucide-react'
import { adminStats } from '@/data/admin'
import AdminPageHeader from '../admin-page-header'
import AdminStatCard from '../admin-stat-card'
import AdminButton from '../admin-button'
import InquiryLineChart from './inquiry-line-chart'
import RequestStatusDonut from './request-status-donut'
import FeaturedProductsTable from './featured-products-table'
import RecentContactsPanel from './recent-contacts-panel'
import RecentOrdersPanel from './recent-orders-panel'

export default function AdminDashboard() {
  return (
    <>
      {/* Page Header */}
      <AdminPageHeader
        title="Tổng quan"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Tổng quan' },
        ]}
        actions={
          <>
            <AdminButton variant="ghost" size="sm" icon={<Upload className="w-4 h-4" />}>
              Nhập dữ liệu
            </AdminButton>
            <AdminButton variant="secondary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />}>
              Xuất báo cáo
            </AdminButton>
            <Link href="/admin/products">
              <AdminButton size="sm" icon={<Plus className="w-4 h-4" />}>
                Thêm sản phẩm
              </AdminButton>
            </Link>
          </>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {adminStats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <InquiryLineChart />
        </div>
        <div className="lg:col-span-2">
          <RequestStatusDonut />
        </div>
      </div>

      {/* Featured Products & Recent Contacts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <FeaturedProductsTable />
        <RecentContactsPanel />
      </div>

      {/* Recent Orders */}
      <RecentOrdersPanel />
    </>
  )
}
