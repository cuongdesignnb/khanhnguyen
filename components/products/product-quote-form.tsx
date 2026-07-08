'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface ProductQuoteFormProps {
  productId: string
  productName: string
}

const INPUT_CLASSES =
  'w-full bg-[color:var(--surface)] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-[color:var(--muted)] focus:border-[color:var(--gold)] focus:outline-none transition'

const INPUT_ERROR_CLASSES = 'border-[color:var(--danger)]'

export default function ProductQuoteForm({ productId, productName }: ProductQuoteFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState(`Tôi muốn nhận báo giá xe nâng ${productName}.`)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ name?: string; phone?: string }>({})

  const validate = () => {
    const errs: { name?: string; phone?: string } = {}
    if (!name.trim()) errs.name = 'Vui lòng nhập họ tên'
    if (!phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại'
    setValidationErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          company: company || undefined,
          productId,
          productName,
          quantity,
          budget: budget || undefined,
          message,
        }),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        setSuccess(true)
      } else {
        setError(result.error || 'Gửi yêu cầu báo giá thất bại. Vui lòng thử lại.')
      }
    } catch (err) {
      console.error('Quote request error:', err)
      setError('Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-lg bg-[color:var(--success)]/10 border border-[color:var(--success)]/30 p-5 text-center">
        <p className="text-[color:var(--success)] text-xs font-semibold leading-relaxed">
          Gửi yêu cầu báo giá thành công! Chúng tôi đã nhận được thông tin và sẽ gọi lại tư vấn bảng giá cho bạn sớm nhất.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-lg bg-[color:var(--danger)]/10 border border-[color:var(--danger)]/30 p-3 text-xs text-[color:var(--danger)] font-medium">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <input
          type="text"
          placeholder="Họ và tên*"
          disabled={loading}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setValidationErrors((prev) => ({ ...prev, name: undefined }))
          }}
          className={clsx(INPUT_CLASSES, validationErrors.name && INPUT_ERROR_CLASSES)}
        />
        {validationErrors.name && (
          <p className="text-[10px] text-[color:var(--danger)] mt-0.5 ml-1">{validationErrors.name}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <input
          type="tel"
          placeholder="Số điện thoại*"
          disabled={loading}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            setValidationErrors((prev) => ({ ...prev, phone: undefined }))
          }}
          className={clsx(INPUT_CLASSES, validationErrors.phone && INPUT_ERROR_CLASSES)}
        />
        {validationErrors.phone && (
          <p className="text-[10px] text-[color:var(--danger)] mt-0.5 ml-1">{validationErrors.phone}</p>
        )}
      </div>

      {/* Email + Company (2-col) */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="email"
          placeholder="Email"
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={INPUT_CLASSES}
        />
        <input
          type="text"
          placeholder="Tên công ty"
          disabled={loading}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={INPUT_CLASSES}
        />
      </div>

      {/* Quantity + Budget (2-col) */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 bg-[color:var(--surface)] border border-white/10 rounded-lg px-2 py-1">
          <span className="text-[10px] text-[color:var(--muted)] font-medium whitespace-nowrap">SL:</span>
          <input
            type="number"
            min={1}
            disabled={loading}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            className="w-full bg-transparent text-xs text-white outline-none focus:ring-0 border-0 p-0 text-center"
          />
        </div>
        <select
          value={budget}
          disabled={loading}
          onChange={(e) => setBudget(e.target.value)}
          className="bg-[color:var(--surface)] border border-white/10 rounded-lg px-2 py-1 text-xs text-[color:var(--silver)] focus:outline-none focus:border-[color:var(--gold)] cursor-pointer"
        >
          <option value="">Ngân sách dự kiến</option>
          <option value="Dưới 100tr">Dưới 100 triệu</option>
          <option value="100tr - 200tr">100tr - 200 triệu</option>
          <option value="200tr - 300tr">200tr - 300 triệu</option>
          <option value="Trên 300tr">Trên 300 triệu</option>
        </select>
      </div>

      {/* Message */}
      <textarea
        placeholder="Lời nhắn thêm..."
        disabled={loading}
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={clsx(INPUT_CLASSES, 'resize-none')}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black disabled:opacity-50 disabled:cursor-not-allowed font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
      >
        {loading ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Send size={13} />
        )}
        {loading ? 'ĐANG GỬI...' : 'GỬI BÁO GIÁ'}
      </button>
    </form>
  )
}
