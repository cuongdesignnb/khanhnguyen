'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Eye,
  CheckCircle,
  XCircle,
  Pencil,
  EyeOff,
  Trash2,
  X,
  Save,
} from 'lucide-react'

type ReviewItem = {
  id: string
  productId: string
  productName: string
  productSlug: string
  name: string
  phone: string
  rating: number
  content: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN'
  adminNote?: string | null
  createdAt: string
  images: { id: string; url: string; alt: string }[]
}

function ActionButton({
  title,
  onClick,
  children,
  variant = 'default',
}: {
  title: string
  onClick: () => void
  children: React.ReactNode
  variant?: 'default' | 'gold' | 'success' | 'danger'
}) {
  const variantClass =
    variant === 'success'
      ? 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10'
      : variant === 'danger'
      ? 'border-red-500/30 text-red-300 hover:bg-red-500/10'
      : variant === 'gold'
      ? 'border-[color:var(--line-gold)] text-[color:var(--gold)] hover:bg-[color:var(--gold)]/10'
      : 'border-white/10 text-[color:var(--silver)] hover:border-white/30 hover:bg-white/5'

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`grid size-8 place-items-center rounded-lg border transition ${variantClass}`}
    >
      {children}
    </button>
  )
}

function StatusBadge({ status }: { status: ReviewItem['status'] }) {
  const config =
    status === 'APPROVED'
      ? {
          label: 'Đã duyệt',
          className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
        }
      : status === 'PENDING'
      ? {
          label: 'Chờ duyệt',
          className: 'border-[color:var(--line-gold)] bg-[color:var(--gold)]/10 text-[color:var(--gold)]',
        }
      : status === 'REJECTED'
      ? {
          label: 'Từ chối',
          className: 'border-red-500/30 bg-red-500/10 text-red-300',
        }
      : {
          label: 'Đã ẩn',
          className: 'border-white/10 bg-white/5 text-[color:var(--muted)]',
        }

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  )
}

export default function ProductReviewsAdminPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('ALL')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [viewingReview, setViewingReview] = useState<ReviewItem | null>(null)
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null)
  const [saving, setSaving] = useState(false)

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(handler)
  }, [search])

  async function loadReviews() {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (status && status !== 'ALL') {
        params.set('status', status)
      }
      if (debouncedSearch) {
        params.set('q', debouncedSearch)
      }

      const response = await fetch(
        `/api/admin/product-reviews${params.toString() ? `?${params.toString()}` : ''}`,
        {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        }
      )

      const result = await response.json().catch(() => null)

      if (response.status === 401) {
        router.replace('/admin/login?redirect=/admin/danh-gia-san-pham')
        return
      }

      if (!response.ok) {
        throw new Error(result?.error || `Không thể tải đánh giá. HTTP ${response.status}`)
      }

      setReviews(Array.isArray(result?.data) ? result.data : [])
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách đánh giá')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [status, debouncedSearch])

  async function approveReview(id: string) {
    await mutateReview(`/api/admin/product-reviews/${id}/approve`, 'PATCH')
  }

  async function rejectReview(id: string) {
    const ok = confirm('Bạn có chắc muốn từ chối đánh giá này?')
    if (!ok) return

    await mutateReview(`/api/admin/product-reviews/${id}/reject`, 'PATCH')
  }

  async function hideReview(id: string) {
    const ok = confirm('Bạn có chắc muốn ẩn đánh giá này khỏi website?')
    if (!ok) return

    await mutateReview(`/api/admin/product-reviews/${id}/hide`, 'PATCH')
  }

  async function deleteReview(id: string) {
    const ok = confirm('Bạn có chắc muốn xóa đánh giá này? Dữ liệu sẽ được xóa mềm.')
    if (!ok) return

    await mutateReview(`/api/admin/product-reviews/${id}`, 'DELETE')
  }

  async function mutateReview(url: string, method: 'PATCH' | 'DELETE') {
    try {
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      })

      const result = await response.json().catch(() => null)

      if (response.status === 401) {
        router.replace('/admin/login?redirect=/admin/danh-gia-san-pham')
        return
      }

      if (!response.ok) {
        throw new Error(result?.error || 'Thao tác thất bại')
      }

      await loadReviews()
    } catch (error: any) {
      alert(error?.message || 'Thao tác thất bại')
    }
  }

  function openEditModal(review: ReviewItem) {
    setEditingReview(review)
  }

  async function saveReview(payload: {
    id: string
    name: string
    phone: string
    rating: number
    content: string
    status: ReviewItem['status']
    adminNote?: string | null
  }) {
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/product-reviews/${payload.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => null)

      if (response.status === 401) {
        router.replace('/admin/login?redirect=/admin/danh-gia-san-pham')
        return
      }

      if (!response.ok) {
        throw new Error(result?.error || 'Không thể cập nhật đánh giá')
      }

      setEditingReview(null)
      await loadReviews()
    } catch (error: any) {
      alert(error?.message || 'Không thể cập nhật đánh giá')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Đánh giá sản phẩm</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Quản lý đánh giá khách hàng gửi từ trang chi tiết sản phẩm.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Tìm kiếm tên, sđt, nội dung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2 text-sm text-white outline-none focus:border-[color:var(--gold)] min-w-[200px]"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2 text-sm text-white outline-none focus:border-[color:var(--gold)]"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Từ chối</option>
            <option value="HIDDEN">Đã ẩn</option>
          </select>
        </div>
      </div>

      {loading && reviews.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-2)] p-6 text-sm text-[color:var(--muted)]">
          Đang tải danh sách đánh giá...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
          <p className="text-sm font-semibold text-red-300">{error}</p>
          <button
            type="button"
            onClick={loadReviews}
            className="mt-3 rounded-lg bg-[color:var(--gold)] px-4 py-2 text-xs font-bold text-black"
          >
            Tải lại
          </button>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-2)] p-6 text-sm text-[color:var(--muted)]">
          Chưa có đánh giá nào.
        </div>
      )}

      {reviews.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[color:var(--surface-2)]">
          <table className="w-full min-w-[1150px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase text-[color:var(--muted)]">
              <tr>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Sao</th>
                <th className="px-4 py-3">Nội dung</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày gửi</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {reviews.map((review) => (
                <tr key={review.id} className="text-[color:var(--silver)] hover:bg-white/[0.01] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{review.name}</div>
                    <div className="text-xs text-[color:var(--muted)]">{review.phone}</div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="max-w-[220px] line-clamp-2">{review.productName}</div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-[color:var(--gold)]">
                      {'★'.repeat(review.rating)}
                    </span>
                    <span className="text-white/20">
                      {'★'.repeat(5 - review.rating)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="max-w-[260px] line-clamp-2">{review.content}</div>
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={review.status} />
                  </td>

                  <td className="px-4 py-3 text-xs text-[color:var(--muted)]">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton title="Xem chi tiết" onClick={() => setViewingReview(review)}>
                        <Eye size={15} />
                      </ActionButton>

                      <ActionButton title="Sửa đánh giá" variant="gold" onClick={() => openEditModal(review)}>
                        <Pencil size={15} />
                      </ActionButton>

                      {review.status === 'PENDING' && (
                        <>
                          <ActionButton title="Duyệt đánh giá" variant="success" onClick={() => approveReview(review.id)}>
                            <CheckCircle size={15} />
                          </ActionButton>

                          <ActionButton title="Từ chối đánh giá" variant="danger" onClick={() => rejectReview(review.id)}>
                            <XCircle size={15} />
                          </ActionButton>
                        </>
                      )}

                      {review.status === 'APPROVED' && (
                        <ActionButton title="Ẩn đánh giá" onClick={() => hideReview(review.id)}>
                          <EyeOff size={15} />
                        </ActionButton>
                      )}

                      {(review.status === 'REJECTED' || review.status === 'HIDDEN') && (
                        <ActionButton title="Duyệt lại đánh giá" variant="success" onClick={() => approveReview(review.id)}>
                          <CheckCircle size={15} />
                        </ActionButton>
                      )}

                      <ActionButton title="Xóa đánh giá" variant="danger" onClick={() => deleteReview(review.id)}>
                        <Trash2 size={15} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewingReview && (
        <ReviewDetailModal
          review={viewingReview}
          onClose={() => setViewingReview(null)}
        />
      )}

      {editingReview && (
        <ReviewEditModal
          review={editingReview}
          saving={saving}
          onClose={() => setEditingReview(null)}
          onSave={saveReview}
        />
      )}
    </div>
  )
}

function ReviewDetailModal({
  review,
  onClose,
}: {
  review: ReviewItem
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-white">Chi tiết đánh giá</h2>
            <p className="text-xs text-[color:var(--muted)]">{review.productName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg border border-white/10 text-[color:var(--muted)] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoBox label="Khách hàng" value={review.name} />
            <InfoBox label="Số điện thoại" value={review.phone} />
            <InfoBox label="Sản phẩm" value={review.productName} />
            <InfoBox label="Trạng thái" value={review.status} />
            <InfoBox label="Số sao" value={`${review.rating}/5`} />
            <InfoBox
              label="Ngày gửi"
              value={new Date(review.createdAt).toLocaleString('vi-VN')}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-[color:var(--muted)]">
              Nội dung đánh giá
            </p>
            <p className="text-sm leading-6 text-white">{review.content}</p>
          </div>

          {review.adminNote && (
            <div className="rounded-xl border border-[color:var(--line-gold)] bg-[color:var(--gold)]/5 p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-[color:var(--gold)]">
                Ghi chú admin
              </p>
              <p className="text-sm leading-6 text-[color:var(--silver)]">{review.adminNote}</p>
            </div>
          )}

          {review.images.length > 0 && (
            <div>
              <p className="mb-3 text-xs uppercase tracking-wide text-[color:var(--muted)]">
                Ảnh khách gửi
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {review.images.map((image) => (
                  <a
                    key={image.id}
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  )
}

function ReviewEditModal({
  review,
  saving,
  onClose,
  onSave,
}: {
  review: ReviewItem
  saving: boolean
  onClose: () => void
  onSave: (payload: {
    id: string
    name: string
    phone: string
    rating: number
    content: string
    status: ReviewItem['status']
    adminNote?: string | null
  }) => void
}) {
  const [name, setName] = useState(review.name)
  const [phone, setPhone] = useState(review.phone)
  const [rating, setRating] = useState(review.rating)
  const [content, setContent] = useState(review.content)
  const [status, setStatus] = useState<ReviewItem['status']>(review.status)
  const [adminNote, setAdminNote] = useState(review.adminNote || '')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-white">Sửa đánh giá</h2>
            <p className="text-xs text-[color:var(--muted)]">{review.productName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid size-9 place-items-center rounded-lg border border-white/10 text-[color:var(--muted)] hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form
          className="space-y-4 p-5"
          onSubmit={(e) => {
            e.preventDefault()

            onSave({
              id: review.id,
              name,
              phone,
              rating,
              content,
              status,
              adminNote,
            })
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[color:var(--muted)]">
                Họ tên
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-3 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[color:var(--muted)]">
                Số điện thoại
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-3 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[color:var(--muted)]">
                Số sao
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-3 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]"
              >
                <option value={5}>5 sao</option>
                <option value={4}>4 sao</option>
                <option value={3}>3 sao</option>
                <option value={2}>2 sao</option>
                <option value={1}>1 sao</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[color:var(--muted)]">
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReviewItem['status'])}
                className="w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-3 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]"
              >
                <option value="PENDING">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Từ chối</option>
                <option value="HIDDEN">Đã ẩn</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[color:var(--muted)]">
              Nội dung đánh giá
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-3 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[color:var(--muted)]">
              Ghi chú admin
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-3 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[color:var(--silver)] hover:bg-white/5 disabled:opacity-50"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--gold)] px-4 py-2 text-sm font-bold text-black hover:bg-[color:var(--gold-strong)] disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
