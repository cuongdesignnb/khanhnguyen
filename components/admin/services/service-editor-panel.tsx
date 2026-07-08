'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import AdminButton from '../admin-button'
import type { ServiceItem, MediaItem } from '@/types/admin'
import { adminApi } from '@/lib/admin-api'
import { toast } from '@/lib/toast'
import MediaPicker from '../media-picker'

interface ServiceEditorPanelProps {
  isOpen: boolean
  onClose: () => void
  service: ServiceItem | null
  onSaved: () => void
}

const tabs = ['Thông tin cơ bản', 'Nội dung', 'FAQ', 'SEO']

const inputClass =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 focus:border-[color:var(--gold)]/50 focus:outline-none focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-colors'

const labelClass = 'text-xs text-[color:var(--muted)] mb-1.5 font-medium block'

export default function ServiceEditorPanel({
  isOpen,
  onClose,
  service,
  onSaved,
}: ServiceEditorPanelProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageMedia, setImageMedia] = useState<MediaItem | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  // Content states
  const [benefits, setBenefits] = useState<string[]>([])
  const [process, setProcess] = useState<string[]>([])
  const [ctaTitle, setCtaTitle] = useState('')
  const [ctaDescription, setCtaDescription] = useState('')
  const [ctaButtonText, setCtaButtonText] = useState('')
  const [ctaButtonHref, setCtaButtonHref] = useState('')

  // FAQ states
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([])

  // SEO states
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')

  // Load details when editing
  useEffect(() => {
    if (isOpen) {
      if (service?.id) {
        setLoading(true)
        adminApi
          .getServiceById(service.id)
          .then((res) => {
            setTitle(res.title || '')
            setSlug(res.slug || '')
            setDescription(res.description || '')
            setIsVisible(res.status === 'PUBLISHED')
            setBenefits(res.benefits || [])
            setProcess(res.process || [])
            setCtaTitle(res.ctaTitle || '')
            setCtaDescription(res.ctaDescription || '')
            setCtaButtonText(res.ctaButtonText || '')
            setCtaButtonHref(res.ctaButtonHref || '')
            setSeoTitle(res.seoTitle || '')
            setSeoDescription(res.seoDescription || '')

            // FAQs
            if (res.faqs) {
              setFaqs(
                res.faqs.map((f: any) => ({
                  question: f.question,
                  answer: f.answer,
                }))
              )
            } else {
              setFaqs([])
            }

            // Image
            if (res.image) {
              setImageMedia({
                id: res.image.id,
                src: res.image.url,
                alt: res.image.alt || '',
                type: 'service',
                format: 'jpg',
                size: '',
                uploadedAt: '',
              })
            } else {
              setImageMedia(null)
            }
          })
          .catch((err) => {
            console.error('Lỗi tải chi tiết dịch vụ:', err)
            toast.error('Không thể tải chi tiết dịch vụ.')
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        // Reset states for creation mode
        setTitle('')
        setSlug('')
        setDescription('')
        setImageMedia(null)
        setIsVisible(true)
        setBenefits(['Tiết kiệm chi phí đầu tư ban đầu', 'Linh hoạt thay đổi tải trọng'])
        setProcess(['Khảo sát nhu cầu', 'Ký kết hợp đồng', 'Giao xe nâng'])
        setCtaTitle('Liên hệ ngay để được hỗ trợ')
        setCtaDescription('')
        setCtaButtonText('Liên hệ hotline')
        setCtaButtonHref('0901 234 567')
        setFaqs([{ question: 'Thời gian thuê tối thiểu bao lâu?', answer: 'Tối thiểu từ 1 tháng.' }])
        setSeoTitle('')
        setSeoDescription('')
      }
      setActiveTab(0)
    }
  }, [isOpen, service])

  const handleAddBenefit = () => setBenefits((prev) => [...prev, ''])
  const handleRemoveBenefit = (idx: number) => setBenefits((prev) => prev.filter((_, i) => i !== idx))
  const handleBenefitChange = (idx: number, val: string) => {
    setBenefits((prev) => {
      const next = [...prev]
      next[idx] = val
      return next
    })
  }

  const handleAddStep = () => setProcess((prev) => [...prev, ''])
  const handleRemoveStep = (idx: number) => setProcess((prev) => prev.filter((_, i) => i !== idx))
  const handleStepChange = (idx: number, val: string) => {
    setProcess((prev) => {
      const next = [...prev]
      next[idx] = val
      return next
    })
  }

  const handleAddFaq = () => setFaqs((prev) => [...prev, { question: '', answer: '' }])
  const handleRemoveFaq = (idx: number) => setFaqs((prev) => prev.filter((_, i) => i !== idx))
  const handleFaqChange = (idx: number, field: 'question' | 'answer', val: string) => {
    setFaqs((prev) => {
      const next = [...prev]
      next[idx][field] = val
      return next
    })
  }

  const handleImageSelect = (items: MediaItem[]) => {
    if (items.length > 0) {
      setImageMedia(items[0])
    }
  }

  const handleSave = async () => {
    if (!title) {
      toast.error('Vui lòng nhập tên dịch vụ.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title,
        slug: slug || undefined,
        description,
        imageId: imageMedia?.id || null,
        status: isVisible ? 'PUBLISHED' : 'DRAFT',
        benefits: benefits.filter(Boolean),
        process: process.filter(Boolean),
        ctaTitle: ctaTitle || null,
        ctaDescription: ctaDescription || null,
        ctaButtonText: ctaButtonText || null,
        ctaButtonHref: ctaButtonHref || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        faqs: faqs
          .filter((f) => f.question && f.answer)
          .map((f, idx) => ({
            question: f.question,
            answer: f.answer,
            sortOrder: idx,
          })),
      }

      if (service?.id) {
        await adminApi.updateService(service.id, payload)
        toast.success('Cập nhật dịch vụ thành công')
      } else {
        await adminApi.createService(payload)
        toast.success('Thêm dịch vụ thành công')
      }
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Lỗi lưu dịch vụ')
    } finally {
      setSaving(false)
    }
  }

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
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-[color:var(--bg)] border-l border-white/10 z-50 flex flex-col overflow-hidden shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-black/10">
              <div>
                <h2 className="text-lg font-semibold text-white font-sans">
                  {service ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
                </h2>
                {service && <p className="text-xs text-[color:var(--gold)] mt-0.5">/{service.slug}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4 shrink-0 bg-black/15 pb-2">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={clsx(
                    'px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer border',
                    activeTab === i
                      ? 'bg-[color:var(--gold)] text-black border-[color:var(--gold)]'
                      : 'text-[color:var(--muted)] hover:text-white hover:bg-white/5 border-white/10'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {loading ? (
                <div className="py-20 flex justify-center">
                  <svg className="animate-spin w-8 h-8 text-[color:var(--gold)]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : (
                <>
                  {activeTab === 0 && (
                    <>
                      <div>
                        <label className={labelClass}>Tên dịch vụ *</label>
                        <input
                          className={inputClass}
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Nhập tên dịch vụ"
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Slug</label>
                        <input
                          className={inputClass}
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="tự động tạo nếu để trống"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Mô tả ngắn</label>
                        <textarea
                          className={clsx(inputClass, 'h-20 resize-none')}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Mô tả tóm tắt dịch vụ..."
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Ảnh banner dịch vụ</label>
                        <div className="flex gap-4 items-center">
                          {imageMedia ? (
                            <div className="relative w-28 aspect-video rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black/20">
                              <Image src={imageMedia.src} alt="" fill className="object-cover" />
                              <button
                                type="button"
                                onClick={() => setImageMedia(null)}
                                className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5 hover:bg-rose-500"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => setMediaPickerOpen(true)}
                              className="w-28 aspect-video rounded-xl border border-dashed border-white/15 flex items-center justify-center text-[color:var(--muted)] flex-shrink-0 cursor-pointer hover:border-[color:var(--gold)]/50 transition-all"
                            >
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                          <AdminButton variant="secondary" size="sm" onClick={() => setMediaPickerOpen(true)}>
                            Chọn ảnh
                          </AdminButton>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                        <label className="text-xs font-semibold text-white">Hiển thị công khai</label>
                        <button
                          type="button"
                          onClick={() => setIsVisible(!isVisible)}
                          className={clsx(
                            'w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer relative',
                            isVisible ? 'bg-[color:var(--gold)]' : 'bg-[color:var(--surface-3)] border border-white/10'
                          )}
                        >
                          <span
                            className="block w-4 h-4 rounded-full bg-white transition-transform duration-200"
                            style={{ transform: isVisible ? 'translateX(24px) translateY(2.5px)' : 'translateX(2.5px) translateY(2.5px)' }}
                          />
                        </button>
                      </div>
                    </>
                  )}

                  {activeTab === 1 && (
                    <>
                      {/* Benefits */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Lợi ích dịch vụ</h4>
                          <AdminButton
                            variant="secondary"
                            size="sm"
                            icon={<Plus className="w-3.5 h-3.5" />}
                            onClick={handleAddBenefit}
                          >
                            Thêm lợi ích
                          </AdminButton>
                        </div>
                        {benefits.length === 0 ? (
                          <div className="text-center py-6 text-xs text-[color:var(--muted)]">Chưa có lợi ích nào.</div>
                        ) : (
                          <div className="space-y-2">
                            {benefits.map((b, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)] text-xs font-bold flex items-center justify-center shrink-0">
                                  {i + 1}
                                </span>
                                <input
                                  className={inputClass}
                                  value={b}
                                  onChange={(e) => handleBenefitChange(i, e.target.value)}
                                  placeholder="Ví dụ: Đội ngũ bảo trì 24/7"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveBenefit(i)}
                                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Process */}
                      <div className="space-y-3 border-t border-white/5 pt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Quy trình thực hiện</h4>
                          <AdminButton
                            variant="secondary"
                            size="sm"
                            icon={<Plus className="w-3.5 h-3.5" />}
                            onClick={handleAddStep}
                          >
                            Thêm bước
                          </AdminButton>
                        </div>
                        {process.length === 0 ? (
                          <div className="text-center py-6 text-xs text-[color:var(--muted)]">Chưa có bước quy trình nào.</div>
                        ) : (
                          <div className="space-y-2">
                            {process.map((s, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">
                                  {i + 1}
                                </span>
                                <input
                                  className={inputClass}
                                  value={s}
                                  onChange={(e) => handleStepChange(i, e.target.value)}
                                  placeholder="Ví dụ: Khảo sát tại nhà máy"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStep(i)}
                                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="space-y-3 border-t border-white/5 pt-4">
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Nút kêu gọi hành động (CTA)</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] text-[color:var(--muted)] block mb-1">Tiêu đề CTA</label>
                            <input
                              className={inputClass}
                              value={ctaTitle}
                              onChange={(e) => setCtaTitle(e.target.value)}
                              placeholder="Liên hệ tư vấn dịch vụ ngay"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] text-[color:var(--muted)] block mb-1">Nút CTA Text</label>
                              <input
                                className={inputClass}
                                value={ctaButtonText}
                                onChange={(e) => setCtaButtonText(e.target.value)}
                                placeholder="VD: Gọi điện hotline"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-[color:var(--muted)] block mb-1">Đường dẫn / Hotline</label>
                              <input
                                className={inputClass}
                                value={ctaButtonHref}
                                onChange={(e) => setCtaButtonHref(e.target.value)}
                                placeholder="VD: 0901234567"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Hỏi đáp thường gặp (FAQ)</h4>
                        <AdminButton
                          variant="secondary"
                          size="sm"
                          icon={<Plus className="w-3.5 h-3.5" />}
                          onClick={handleAddFaq}
                        >
                          Thêm câu hỏi
                        </AdminButton>
                      </div>
                      {faqs.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-white/10 rounded-xl text-[color:var(--muted)] text-sm">
                          Chưa có FAQ nào. Click Thêm câu hỏi để tạo mới.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {faqs.map((faq, i) => (
                            <div
                              key={i}
                              className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-4 space-y-3 relative group"
                            >
                              <button
                                type="button"
                                onClick={() => handleRemoveFaq(i)}
                                className="absolute top-2 right-2 p-1 bg-black/50 text-rose-400 hover:bg-rose-500 rounded-lg hover:text-white transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <div>
                                <label className="text-[9px] text-[color:var(--muted)] uppercase mb-1 block">Câu hỏi {i + 1}</label>
                                <input
                                  className={inputClass}
                                  value={faq.question}
                                  onChange={(e) => handleFaqChange(i, 'question', e.target.value)}
                                  placeholder="Câu hỏi..."
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-[color:var(--muted)] uppercase mb-1 block">Trả lời</label>
                                <textarea
                                  className={clsx(inputClass, 'h-16 resize-none')}
                                  value={faq.answer}
                                  onChange={(e) => handleFaqChange(i, 'answer', e.target.value)}
                                  placeholder="Câu trả lời chi tiết..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 3 && (
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Tiêu đề SEO</label>
                        <input
                          className={inputClass}
                          value={seoTitle}
                          onChange={(e) => setSeoTitle(e.target.value)}
                          placeholder="Meta title"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Mô tả SEO</label>
                        <textarea
                          className={clsx(inputClass, 'h-24 resize-none')}
                          value={seoDescription}
                          onChange={(e) => setSeoDescription(e.target.value)}
                          placeholder="Meta description"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 shrink-0 bg-black/10">
              <AdminButton variant="secondary" onClick={onClose} disabled={saving}>
                Hủy bỏ
              </AdminButton>
              <AdminButton
                variant="primary"
                onClick={handleSave}
                loading={saving}
                disabled={loading || !title}
              >
                Lưu dịch vụ
              </AdminButton>
            </div>
          </motion.aside>
        </>
      )}

      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleImageSelect}
      />
    </AnimatePresence>
  )
}
