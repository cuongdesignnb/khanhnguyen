'use client'

import { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { X, Plus, ChevronDown } from 'lucide-react'
import AdminButton from '../admin-button'
import type { ServiceItem } from '@/types/admin'

interface ServiceEditorPanelProps {
  isOpen: boolean
  onClose: () => void
  service: ServiceItem | null
}

const tabs = ['Thông tin cơ bản', 'Nội dung', 'FAQ', 'SEO']

const inputClass = 'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 focus:border-[color:var(--gold)]/50 focus:outline-none focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-colors'

export default function ServiceEditorPanel({ isOpen, onClose, service }: ServiceEditorPanelProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [isPublished, setIsPublished] = useState(service?.status === 'published')

  const mockBenefits = [
    'Tiết kiệm chi phí đầu tư ban đầu',
    'Linh hoạt thay đổi theo nhu cầu',
    'Bảo trì, sửa chữa miễn phí',
  ]

  const mockSteps = [
    'Khảo sát nhu cầu',
    'Báo giá chi tiết',
    'Ký hợp đồng',
    'Giao xe & hỗ trợ',
  ]

  const mockFaqs = [
    { q: 'Thời gian cho thuê tối thiểu là bao lâu?', a: 'Thời gian cho thuê tối thiểu từ 1 tháng. Chúng tôi linh hoạt theo nhu cầu khách hàng.' },
    { q: 'Chi phí cho thuê xe nâng bao gồm những gì?', a: 'Chi phí bao gồm xe nâng, bảo trì định kỳ, hỗ trợ kỹ thuật 24/7.' },
    { q: 'Có hỗ trợ giao xe tận nơi không?', a: 'Có, chúng tôi hỗ trợ giao xe miễn phí trong phạm vi TP.HCM và các tỉnh lân cận.' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-[color:var(--bg)] border-l border-white/10 z-50 flex flex-col overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {service ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
                </h2>
                {service && <p className="text-xs text-[color:var(--muted)] mt-0.5">/{service.slug}</p>}
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4 shrink-0">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={clsx(
                    'px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer',
                    activeTab === i
                      ? 'bg-[color:var(--gold)]/10 text-[color:var(--gold)] border border-[color:var(--gold)]/20'
                      : 'text-[color:var(--muted)] hover:text-white hover:bg-white/5 border border-transparent'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {activeTab === 0 && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Tên dịch vụ</label>
                    <input className={inputClass} defaultValue={service?.title} placeholder="Tên dịch vụ" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Slug</label>
                    <input className={inputClass} defaultValue={service?.slug} placeholder="slug-dich-vu" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Mô tả ngắn</label>
                    <textarea className={clsx(inputClass, 'h-20 resize-none')} defaultValue={service?.description} placeholder="Mô tả ngắn về dịch vụ..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Ảnh đại diện</label>
                    {service?.image && (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-2">
                        <Image src={service.image} alt={service.title} fill className="object-cover" sizes="500px" />
                      </div>
                    )}
                    <AdminButton variant="secondary" size="sm">Chọn ảnh</AdminButton>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[color:var(--muted)]">Hiển thị</label>
                    <button
                      onClick={() => setIsPublished(!isPublished)}
                      className={clsx(
                        'w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer relative',
                        isPublished ? 'bg-[color:var(--gold)]' : 'bg-[color:var(--surface-3)]'
                      )}
                    >
                      <span
                        className="block w-4 h-4 rounded-full bg-white transition-transform duration-200"
                        style={{ transform: isPublished ? 'translateX(22px) translateY(4px)' : 'translateX(2px) translateY(4px)' }}
                      />
                    </button>
                  </div>
                </>
              )}

              {activeTab === 1 && (
                <>
                  {/* Benefits */}
                  <div>
                    <h4 className="text-sm font-semibold text-[color:var(--silver)] mb-3">Lợi ích dịch vụ</h4>
                    <div className="space-y-2">
                      {mockBenefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                          <input className={inputClass} defaultValue={b} />
                        </div>
                      ))}
                    </div>
                    <AdminButton variant="ghost" size="sm" className="mt-2">
                      <Plus className="w-3.5 h-3.5" /> Thêm lợi ích
                    </AdminButton>
                  </div>

                  {/* Process */}
                  <div>
                    <h4 className="text-sm font-semibold text-[color:var(--silver)] mb-3">Quy trình thực hiện</h4>
                    <div className="space-y-2">
                      {mockSteps.map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                          <input className={inputClass} defaultValue={s} />
                        </div>
                      ))}
                    </div>
                    <AdminButton variant="ghost" size="sm" className="mt-2">
                      <Plus className="w-3.5 h-3.5" /> Thêm bước
                    </AdminButton>
                  </div>

                  {/* CTA */}
                  <div>
                    <h4 className="text-sm font-semibold text-[color:var(--silver)] mb-3">CTA</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Tiêu đề CTA</label>
                        <input className={inputClass} defaultValue="Liên hệ ngay để được tư vấn" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Nút CTA text</label>
                        <input className={inputClass} defaultValue="Gọi ngay" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Số hotline</label>
                        <input className={inputClass} defaultValue="0901 234 567" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 2 && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-[color:var(--silver)]">Câu hỏi thường gặp</h4>
                    <span className="text-xs bg-[color:var(--gold)]/10 text-[color:var(--gold)] px-2 py-0.5 rounded-full">{mockFaqs.length} câu hỏi</span>
                  </div>
                  <div className="space-y-3">
                    {mockFaqs.map((faq, i) => (
                      <div key={i} className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-4">
                        <input className={clsx(inputClass, 'font-medium mb-2')} defaultValue={faq.q} placeholder="Câu hỏi" />
                        <textarea className={clsx(inputClass, 'h-16 resize-none')} defaultValue={faq.a} placeholder="Câu trả lời" />
                      </div>
                    ))}
                  </div>
                  <AdminButton variant="ghost" size="sm">
                    <Plus className="w-3.5 h-3.5" /> Thêm FAQ
                  </AdminButton>
                </>
              )}

              {activeTab === 3 && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Meta title</label>
                    <input className={inputClass} defaultValue={service?.title || ''} placeholder="Meta title" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Meta description</label>
                    <textarea className={clsx(inputClass, 'h-20 resize-none')} defaultValue={service?.description || ''} placeholder="Meta description" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">Keywords</label>
                    <input className={inputClass} placeholder="xe nâng, cho thuê, sửa chữa" />
                  </div>
                  <div className="text-[10px] text-[color:var(--muted)]">
                    URL preview: khanhnguyenforklift.vn/dich-vu/{service?.slug || 'slug-dich-vu'}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 shrink-0">
              <AdminButton variant="secondary" onClick={onClose}>Hủy bỏ</AdminButton>
              <AdminButton>Lưu dịch vụ</AdminButton>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
