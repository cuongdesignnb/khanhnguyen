'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import ServiceEditorPanel from './service-editor-panel'
import { adminServices } from '@/data/admin'
import type { ServiceItem } from '@/types/admin'
import { Plus, Pencil, Trash2, Eye, MessageCircle } from 'lucide-react'

export default function ServicesAdminPage() {
  const [editorOpen, setEditorOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)

  const openEditor = (service: ServiceItem | null) => {
    setSelectedService(service)
    setEditorOpen(true)
  }

  return (
    <div>
      <AdminPageHeader
        title="Quản lý dịch vụ"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Dịch vụ' },
        ]}
        actions={
          <AdminButton icon={<Plus className="w-4 h-4" />} onClick={() => openEditor(null)}>Thêm dịch vụ</AdminButton>
        }
      />

      <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['Ảnh', 'Tên dịch vụ', 'Slug', 'Trạng thái', 'Số FAQ', 'Cập nhật', 'Thao tác'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {adminServices.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="w-14 h-10 rounded-lg overflow-hidden relative">
                      <Image src={service.image} alt={service.title} fill className="object-cover" sizes="56px" />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div>
                      <div className="text-white font-medium">{service.title}</div>
                      <div className="text-xs text-[color:var(--muted)] mt-0.5 line-clamp-1">{service.description}</div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-xs text-[color:var(--muted)] font-mono">/{service.slug}</td>
                  <td className="py-3 px-3"><AdminStatusBadge status={service.status} /></td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-[color:var(--muted)]" />
                      <span className="text-sm text-[color:var(--silver)]">{service.faqCount}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-xs text-[color:var(--muted)]">{service.updatedAt}</td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEditor(service)} className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => openEditor(service)} className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-red-400 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceEditorPanel
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        service={selectedService}
      />
    </div>
  )
}
