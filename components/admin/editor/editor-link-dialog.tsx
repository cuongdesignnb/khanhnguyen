'use client'

import { useState } from 'react'

interface EditorLinkDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (url: string, openInNewTab: boolean) => void
  initialUrl?: string
  initialOpenInNewTab?: boolean
}

export default function EditorLinkDialog({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = '',
  initialOpenInNewTab = false,
}: EditorLinkDialogProps) {
  const [url, setUrl] = useState(initialUrl)
  const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab)

  if (!isOpen) return null

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(url, openInNewTab)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <form
        onSubmit={handleConfirm}
        className="w-full max-w-md bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-5 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Chèn liên kết</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[color:var(--muted)] hover:text-white transition text-xs"
          >
            Đóng
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-[color:var(--muted)] uppercase tracking-wide mb-1">
              Đường dẫn liên kết (URL)*
            </label>
            <input
              type="text"
              placeholder="https://example.com"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[color:var(--surface)] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-[color:var(--muted)] focus:border-[color:var(--gold)] focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="openInNewTab"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="rounded border-white/10 bg-[color:var(--surface)] text-[color:var(--gold)] focus:ring-0 focus:ring-offset-0"
            />
            <label
              htmlFor="openInNewTab"
              className="text-xs text-[color:var(--silver)] font-medium select-none cursor-pointer"
            >
              Mở trong tab mới
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-white/10 rounded-lg text-xs text-[color:var(--silver)] hover:bg-white/5 transition"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-black font-bold rounded-lg text-xs transition"
          >
            Đồng ý
          </button>
        </div>
      </form>
    </div>
  )
}
