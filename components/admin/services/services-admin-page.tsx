'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import ServiceEditorPanel from './service-editor-panel'
import { adminServices } from '@/data/admin'
import type { ServiceItem } from '@/types/admin'
import { useAdminList } from '@/hooks/use-admin-list'
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import { adminApi } from '@/lib/admin-api'
import { mapServiceToItem } from '@/lib/admin-mappers'
import { htmlToPlainText } from '@/lib/sanitize-html'
import AdminConfirmModal from '@/components/admin/admin-confirm-modal'
import AdminLoading from '@/components/admin/admin-loading'
import AdminErrorState from '@/components/admin/admin-error-state'
import { Plus, Pencil, Trash2, Eye, MessageCircle, RefreshCw } from 'lucide-react'

export default function ServicesAdminPage() {
  const [editorOpen, setEditorOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const {
    items: services,
    loading,
    error,
    reload,
    usingFallback,
  } = useAdminList<any, ServiceItem>({
    fetcher: adminApi.getServices,
    fallbackData: adminServices,
    mapItem: mapServiceToItem,
  })

  const { mutate: deleteService, loading: deleting } = useAdminMutation(
    adminApi.deleteService,
    {
      successMessage: 'Xóa dịch vụ thành công',
      onSuccess: () => {
        setDeleteId(null)
        if (selectedService?.id === deleteId) {
          setSelectedService(null)
        }
        reload()
      },
    }
  )

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
          <AdminButton icon={<Plus className="w-4 h-4" />} onClick={() => openEditor(null)}>
            Thêm dịch vụ
          </AdminButton>
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

      <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
        {loading ? (
          <AdminLoading type="table" count={5} />
        ) : error && !usingFallback ? (
          <AdminErrorState message={error} onRetry={reload} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {['Ảnh', 'Tên dịch vụ', 'Slug', 'Trạng thái', 'Số FAQ', 'Cập nhật', 'Thao tác'].map((h) => (
                    <th
                      key={h}
                      className="text-xs text-[color:var(--muted)] uppercase font-medium py-3 px-3 text-left"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="w-14 h-10 rounded-lg overflow-hidden relative border border-white/10 bg-black/20">
                        <Image
                          src={service.image || '/images/placeholder.jpg'}
                          alt={service.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div>
                        <div className="text-white font-medium text-sm">{service.title}</div>
                        <div className="text-xs text-[color:var(--muted)] mt-0.5 line-clamp-1 max-w-[350px]">
                          {htmlToPlainText(service.description)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs text-[color:var(--muted)] font-mono">
                      /{service.slug}
                    </td>
                    <td className="py-3 px-3">
                      <AdminStatusBadge status={service.status} />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-[color:var(--muted)]" />
                        <span className="text-sm text-[color:var(--silver)]">{service.faqCount}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs text-[color:var(--muted)]">{service.updatedAt}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditor(service)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(service.id)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ServiceEditorPanel
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        service={selectedService}
        onSaved={reload}
      />

      <AdminConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteService(deleteId)
        }}
        loading={deleting}
        title="Xóa dịch vụ"
        description="Bạn có chắc chắn muốn xóa dịch vụ này khỏi hệ thống? Dữ liệu giới thiệu dịch vụ ngoài trang chủ sẽ không còn truy cập được."
      />
    </div>
  )
}
