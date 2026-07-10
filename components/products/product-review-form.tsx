'use client'

import { useState, useRef, FormEvent, ChangeEvent } from 'react'
import { Star, Upload, X, Loader2, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

interface ProductReviewFormProps {
  productId: string
  onSuccess: () => void
}

export default function ProductReviewForm({ productId, onSuccess }: ProductReviewFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [content, setContent] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    
    // Check total files (existing + new)
    if (selectedFiles.length + files.length > 5) {
      setErrorMsg('Bạn chỉ được upload tối đa 5 hình ảnh thực tế')
      return
    }

    // Validate size and format
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(`Ảnh "${file.name}" vượt quá dung lượng 5MB cho phép`)
        return
      }
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg(`Ảnh "${file.name}" không hợp lệ. Chỉ hỗ trợ định dạng JPG, PNG, WEBP`)
        return
      }
    }

    setErrorMsg(null)
    const newFiles = [...selectedFiles, ...files]
    setSelectedFiles(newFiles)

    // Generate previews
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeFile = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index])

    const updatedFiles = selectedFiles.filter((_, i) => i !== index)
    const updatedPreviews = previews.filter((_, i) => i !== index)

    setSelectedFiles(updatedFiles)
    setPreviews(updatedPreviews)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập họ tên')
      return
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 8 số)')
      return
    }
    if (!content.trim()) {
      setErrorMsg('Vui lòng nhập nội dung đánh giá')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('productId', productId)
      formData.append('name', name.trim())
      formData.append('phone', phone.trim())
      formData.append('rating', rating.toString())
      formData.append('content', content.trim())

      selectedFiles.forEach((file) => {
        formData.append('images', file)
      })

      const response = await fetch('/api/public/product-reviews', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSuccess(true)
        // Reset form
        setName('')
        setPhone('')
        setRating(5)
        setContent('')
        setSelectedFiles([])
        setPreviews([])
        onSuccess()
      } else {
        setErrorMsg(result.error || 'Có lỗi xảy ra khi gửi đánh giá')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-[color:var(--success)]/10 border border-[color:var(--success)]/20 p-6 rounded-2xl text-center space-y-3">
        <CheckCircle2 className="mx-auto text-[color:var(--success)]" size={40} />
        <h4 className="font-bold text-white uppercase text-sm tracking-wider">Gửi đánh giá thành công</h4>
        <p className="text-xs sm:text-sm text-[color:var(--silver)] leading-relaxed">
          Cảm ơn bạn đã gửi đánh giá. Đánh giá sẽ được hiển thị sau khi Khanh Nguyên phê duyệt.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-xs font-bold text-[color:var(--gold)] hover:underline"
        >
          Gửi thêm đánh giá khác
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
        Gửi đánh giá của bạn
      </h4>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-lg text-xs text-red-400 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Ratings star selection */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[color:var(--silver)] uppercase tracking-wider">
          Chọn số sao đánh giá <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="text-[color:var(--gold)] hover:scale-115 transition-transform"
            >
              <Star
                size={22}
                fill={(hoverRating !== null ? star <= hoverRating : star <= rating) ? 'currentColor' : 'transparent'}
                className="stroke-[1.5]"
              />
            </button>
          ))}
          <span className="text-xs text-[color:var(--muted)] font-bold ml-2">
            ({rating} / 5 sao)
          </span>
        </div>
      </div>

      {/* Name Input */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-[color:var(--silver)] uppercase tracking-wider">
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập họ tên của bạn..."
          disabled={loading}
          className="w-full bg-[color:var(--bg)] border border-white/10 focus:border-[color:var(--gold)]/50 focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 transition-colors"
        />
      </div>

      {/* Phone Input */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-[color:var(--silver)] uppercase tracking-wider">
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Nhập số điện thoại bảo mật..."
          disabled={loading}
          className="w-full bg-[color:var(--bg)] border border-white/10 focus:border-[color:var(--gold)]/50 focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 transition-colors"
        />
        <p className="text-[10px] text-[color:var(--muted)] italic">
          * Số điện thoại sẽ được bảo mật và không hiển thị ngoài trang web.
        </p>
      </div>

      {/* Review Content */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-[color:var(--silver)] uppercase tracking-wider">
          Nội dung đánh giá <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập trải nghiệm thực tế của bạn về sản phẩm..."
          disabled={loading}
          rows={3}
          className="w-full bg-[color:var(--bg)] border border-white/10 focus:border-[color:var(--gold)]/50 focus:outline-none rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 transition-colors resize-none"
        />
      </div>

      {/* Image upload area */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-[color:var(--silver)] uppercase tracking-wider">
          Ảnh thực tế (Tối đa 5 ảnh, dưới 5MB)
        </label>
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Previews list */}
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative size-14 rounded-lg overflow-hidden border border-white/10 bg-neutral-900 group"
            >
              <img src={preview} alt="Upload preview" className="object-cover size-full" />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/70 hover:bg-black text-white"
              >
                <X size={10} />
              </button>
            </div>
          ))}

          {/* Add file trigger */}
          {selectedFiles.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="size-14 rounded-lg border border-dashed border-white/20 hover:border-[color:var(--gold)]/40 hover:bg-white/[0.02] flex flex-col items-center justify-center text-[color:var(--muted)] hover:text-white transition-colors cursor-pointer"
            >
              <Upload size={14} />
              <span className="text-[8px] mt-1 uppercase font-bold">Thêm ảnh</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black font-extrabold py-2.5 rounded-lg transition-colors text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-[color:var(--gold)]/10"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Đang gửi đánh giá...</span>
          </>
        ) : (
          <span>Gửi đánh giá</span>
        )}
      </button>
    </form>
  )
}
