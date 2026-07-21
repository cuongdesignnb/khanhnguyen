'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CircleStop } from 'lucide-react'
import { toast } from '@/lib/toast'

type JobItem = {
  id: string
  keyword: string
  status: string
  scheduledAt?: string | null
  errorMessage?: string | null
  post?: { id: string; title: string } | null
  rawAiResponse?: { warnings?: unknown } | null
}

type Job = {
  code: string
  status: string
  completedItems: number
  totalItems: number
  failedItems: number
  items: JobItem[]
}

export default function AiJobDetailPage({ id }: { id: string }) {
  const [job, setJob] = useState<Job | null>(null)

  useEffect(() => {
    const load = () => fetch(`/api/admin/ai/news/bulk-jobs/${id}`).then((response) => response.json()).then((result) => setJob(result.data))
    load()
    const timer = setInterval(load, 4000)
    return () => clearInterval(timer)
  }, [id])

  if (!job) return <div className="p-6 text-white">Đang tải job...</div>

  const cancel = async () => {
    const result = await fetch(`/api/admin/ai/news/bulk-jobs/${id}/cancel`, { method: 'POST' }).then((response) => response.json())
    if (result.success) toast.success('Đã dừng job')
    else toast.error(result.error)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 text-white">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">{job.code}</h1>
          <p className="text-sm text-[color:var(--muted)]">{job.status} · {job.completedItems}/{job.totalItems} hoàn thành · {job.failedItems} lỗi</p>
        </div>
        {['PENDING', 'RUNNING'].includes(job.status) && (
          <button onClick={cancel} className="inline-flex items-center gap-2 rounded-lg border border-red-400/40 px-4 py-2 text-red-300">
            <CircleStop className="size-4" />
            Dừng job
          </button>
        )}
      </div>
      <div className="overflow-auto border-y border-white/10">
        <table className="w-full text-left text-sm">
          <thead><tr>{['Từ khóa', 'Trạng thái', 'Bài viết', 'Lịch đăng', 'Cảnh báo ảnh', 'Lỗi nội dung'].map((label) => <th key={label} className="p-4">{label}</th>)}</tr></thead>
          <tbody>
            {job.items.map((item) => {
              const warnings = Array.isArray(item.rawAiResponse?.warnings) ? item.rawAiResponse.warnings.filter((warning): warning is string => typeof warning === 'string') : []
              return <tr key={item.id} className="border-t border-white/10">
                <td className="p-4">{item.keyword}</td>
                <td className="p-4">{item.status}</td>
                <td className="p-4">{item.post ? <Link className="text-[color:var(--gold)]" href={`/admin/tin-tuc/${item.post.id}/chinh-sua`}>{item.post.title}</Link> : '—'}</td>
                <td className="p-4">{item.scheduledAt ? new Date(item.scheduledAt).toLocaleString('vi-VN') : '—'}</td>
                <td className="max-w-sm p-4 text-amber-200">{warnings.length ? warnings.join(' | ') : '—'}</td>
                <td className="max-w-xs p-4 text-red-300">{item.errorMessage || '—'}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
