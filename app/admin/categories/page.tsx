'use client'

import { useState, Fragment } from 'react'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminButton from '@/components/admin/admin-button'
import AdminStatusBadge from '@/components/admin/admin-status-badge'
import { adminCategories } from '@/data/admin'
import { Plus, Pencil, Trash2, Eye, ChevronRight, Save, X } from 'lucide-react'

export default function CategoriesPage() {
  const [editingId, setEditingId] = useState<string | null>(null)

  const parentCategories = adminCategories.filter((c) => !c.parent)
  const getChildren = (parentName: string) =>
    adminCategories.filter((c) => c.parent === parentName)

  return (
    <div>
      <AdminPageHeader
        title="Quản lý danh mục"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Danh mục' },
        ]}
        actions={
          <AdminButton icon={<Plus className="w-4 h-4" />}>Thêm danh mục</AdminButton>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table */}
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {['Tên danh mục', 'Slug', 'Danh mục cha', 'Số SP', 'Hiển thị', 'Thứ tự', 'Thao tác'].map((h) => (
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
                {parentCategories.map((cat) => (
                  <Fragment key={cat.id}>
                    <tr
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => setEditingId(cat.id)}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{cat.name}</span>
                          {getChildren(cat.name).length > 0 && (
                            <span className="text-[10px] bg-[color:var(--surface-2)] text-[color:var(--muted)] px-1.5 py-0.5 rounded">
                              {getChildren(cat.name).length}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-xs text-[color:var(--muted)] font-mono">
                        {cat.slug}
                      </td>
                      <td className="py-3 px-3 text-xs text-[color:var(--muted)]">—</td>
                      <td className="py-3 px-3 text-sm text-[color:var(--silver)]">
                        {cat.productCount}
                      </td>
                      <td className="py-3 px-3">
                        <AdminStatusBadge status={cat.isVisible ? 'visible' : 'hidden'} />
                      </td>
                      <td className="py-3 px-3 text-sm text-[color:var(--muted)]">{cat.order}</td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-red-400 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {getChildren(cat.name).map((child) => (
                      <tr
                        key={child.id}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                        onClick={() => setEditingId(child.id)}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 pl-6">
                            <ChevronRight className="w-3 h-3 text-[color:var(--muted)]" />
                            <span className="text-[color:var(--silver)]">{child.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-xs text-[color:var(--muted)] font-mono">
                          {child.slug}
                        </td>
                        <td className="py-3 px-3 text-xs text-[color:var(--muted)]">
                          {child.parent}
                        </td>
                        <td className="py-3 px-3 text-sm text-[color:var(--silver)]">
                          {child.productCount}
                        </td>
                        <td className="py-3 px-3">
                          <AdminStatusBadge status={child.isVisible ? 'visible' : 'hidden'} />
                        </td>
                        <td className="py-3 px-3 text-sm text-[color:var(--muted)]">
                          {child.order}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-red-400 cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel Form */}
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)]/80 p-5">
          <h3 className="text-sm font-semibold text-[color:var(--silver)] mb-4">
            {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
                Tên danh mục *
              </label>
              <input
                type="text"
                defaultValue={editingId ? adminCategories.find((c) => c.id === editingId)?.name : ''}
                placeholder="Nhập tên danh mục"
                className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
                Slug
              </label>
              <input
                type="text"
                defaultValue={editingId ? adminCategories.find((c) => c.id === editingId)?.slug : ''}
                placeholder="tu-dong-tao"
                className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
                Danh mục cha
              </label>
              <select className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--muted)] outline-none appearance-none cursor-pointer">
                <option>Không có (danh mục gốc)</option>
                {parentCategories.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
                Mô tả SEO
              </label>
              <textarea
                placeholder="Mô tả ngắn cho SEO..."
                defaultValue={editingId ? adminCategories.find((c) => c.id === editingId)?.description : ''}
                className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 resize-none h-20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                defaultValue={editingId ? adminCategories.find((c) => c.id === editingId)?.order : 1}
                className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] outline-none focus:border-[color:var(--gold)]/50"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[color:var(--silver)]">Hiển thị</span>
              <button
                className="w-11 h-6 rounded-full bg-[color:var(--gold)] p-0.5 cursor-pointer transition-colors"
              >
                <div className="w-4 h-4 rounded-full bg-white" style={{ transform: 'translateX(18px)', transition: 'transform 0.2s' }} />
              </button>
            </div>
            <div className="flex gap-3 pt-2">
              <AdminButton variant="secondary" className="flex-1" onClick={() => setEditingId(null)}>
                Hủy
              </AdminButton>
              <AdminButton className="flex-1" icon={<Save className="w-4 h-4" />}>
                Lưu danh mục
              </AdminButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
