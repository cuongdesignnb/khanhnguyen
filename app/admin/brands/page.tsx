'use client'

import Image from 'next/image'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import { adminBrands } from '@/data/admin'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function BrandsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Quản lý thương hiệu"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Thương hiệu' },
        ]}
        actions={
          <AdminButton icon={<Plus className="w-4 h-4" />}>Thêm thương hiệu</AdminButton>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {adminBrands.map((brand) => (
          <div
            key={brand.id}
            className="bg-[color:var(--surface)]/80 border border-white/10 rounded-2xl overflow-hidden hover:border-[color:var(--gold)]/20 transition-colors group"
          >
            {/* Logo/Image */}
            <div className="relative h-32 bg-[color:var(--surface-2)]">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                sizes="300px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--surface)] to-transparent" />
              <div className="absolute bottom-3 left-4">
                <div className="text-lg font-bold text-white">{brand.name}</div>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
              <div className="text-xs text-[color:var(--muted)]">{brand.description}</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-[color:var(--muted)]">
                  <span className="text-[color:var(--gold)] font-semibold">{brand.productCount}</span> sản phẩm
                </div>
                <AdminStatusBadge status={brand.isVisible ? 'visible' : 'hidden'} />
              </div>
              <div className="text-[10px] text-[color:var(--muted)] font-mono">/{brand.slug}</div>

              <div className="flex gap-2 pt-1">
                <AdminButton variant="secondary" size="sm" className="flex-1">
                  <Pencil className="w-3 h-3" /> Sửa
                </AdminButton>
                <AdminButton variant="danger" size="sm">
                  <Trash2 className="w-3 h-3" />
                </AdminButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
