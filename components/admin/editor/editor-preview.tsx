'use client'

import RichContent from '@/components/public/rich-content'

interface EditorPreviewProps {
  html: string
}

export default function EditorPreview({ html }: EditorPreviewProps) {
  return (
    <div className="bg-[color:var(--surface)] border border-white/5 rounded-lg p-5 min-h-[200px]">
      <h4 className="text-xs font-bold text-[color:var(--gold)] uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
        Xem trước nội dung (Giao diện hiển thị ngoài trang chủ)
      </h4>
      {html.trim() ? (
        <RichContent html={html} />
      ) : (
        <p className="text-xs text-[color:var(--muted)] italic">Chưa có nội dung để hiển thị.</p>
      )}
    </div>
  )
}
