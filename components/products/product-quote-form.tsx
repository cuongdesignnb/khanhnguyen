'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface ProductQuoteFormProps {
  productId: string
  productName: string
}

const INPUT_CLASSES =
  'w-full bg-[color:var(--bg)] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[color:var(--muted)] focus:border-[color:var(--gold)] focus:outline-none transition-colors duration-300'

const INPUT_ERROR_CLASSES = 'border-red-500/50 focus:border-red-500'

export default function ProductQuoteForm({ productId, productName }: ProductQuoteFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ name?: string; phone?: string }>({})

  const validate = () => {
    const errs: { name?: string; phone?: string } = {}
    if (!name.trim()) errs.name = 'Vui lòng nhập họ và tên'
    if (!phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại'
    } else if (phone.trim().length < 8) {
      errs.phone = 'Số điện thoại tối thiểu 8 chữ số'
    }
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
          email: email.trim() || undefined,
          productId,
          productName,
          message: message.trim() || `Yêu cầu báo giá xe nâng: ${productName}`,
          quantity: 1,
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
      <div className="rounded-xl bg-[color:var(--success)]/10 border border-[color:var(--success)]/30 p-6 text-center animate-shimmer">
        <p className="text-[color:var(--success)] text-sm font-semibold leading-relaxed">
          Gửi yêu cầu báo giá thành công! Chúng tôi sẽ liên hệ lại qua hotline/Zalo sớm nhất để tư vấn và báo giá chi tiết.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-xs text-red-400 font-medium">
          {error}
        </div>
      )}

      {/* Họ và tên */}
      <div>
        <input
          type="text"
          placeholder="Họ và tên *"
          disabled={loading}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setValidationErrors((prev) => ({ ...prev, name: undefined }))
          }}
          className={clsx(INPUT_CLASSES, validationErrors.name && INPUT_ERROR_CLASSES)}
        />
        {validationErrors.name && (
          <p className="text-xs text-red-400 mt-1.5 ml-1">{validationErrors.name}</p>
        )}
      </div>

      {/* Số điện thoại */}
      <div>
        <input
          type="tel"
          placeholder="Số điện thoại *"
          disabled={loading}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            setValidationErrors((prev) => ({ ...prev, phone: undefined }))
          }}
          className={clsx(INPUT_CLASSES, validationErrors.phone && INPUT_ERROR_CLASSES)}
        />
        {validationErrors.phone && (
          <p className="text-xs text-red-400 mt-1.5 ml-1">{validationErrors.phone}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email"
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={INPUT_CLASSES}
        />
      </div>

      {/* Nhu cầu/Ghi chú */}
      <div>
        <textarea
          placeholder="Nhu cầu / Ghi chú (Ví dụ: Tôi muốn tư vấn xe nâng 1.5 tấn nâng cao 4.5m...)"
          disabled={loading}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={clsx(INPUT_CLASSES, 'resize-none')}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black disabled:opacity-50 disabled:cursor-not-allowed font-extrabold py-3.5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[color:var(--gold)]/10"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
        {loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU BÁO GIÁ'}
      </button>
    </form>
  )
}
