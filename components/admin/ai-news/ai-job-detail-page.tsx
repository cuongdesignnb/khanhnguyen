'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from '@/lib/toast'

export default function AiJobDetailPage({ id }: { id: string }) {
  const [job, setJob] = useState<any>(null)
  useEffect(() => { const load = () => fetch(`/api/admin/ai/news/bulk-jobs/${id}`).then((r) => r.json()).then((r) => setJob(r.data)); load(); const timer = setInterval(load, 4000); return () => clearInterval(timer) }, [id])
  if (!job) return <div className="p-6 text-white">Đang tải job...</div>
  const cancel = async () => { const r = await fetch(`/api/admin/ai/news/bulk-jobs/${id}/cancel`, { method: 'POST' }).then((x) => x.json()); r.success ? toast.success('Đã hủy job') : toast.error(r.error) }
  return <div className="mx-auto max-w-6xl space-y-6 p-6 text-white"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-black">{job.code}</h1><p>{job.status} · {job.completedItems}/{job.totalItems} hoàn thành · {job.failedItems} lỗi</p></div>{['PENDING','RUNNING'].includes(job.status) && <button onClick={cancel} className="rounded-xl border border-red-400/40 px-4 py-2 text-red-300">Dừng job</button>}</div><div className="overflow-auto rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead><tr>{['Từ khóa','Trạng thái','Bài viết','Lịch đăng','Lỗi'].map((x) => <th key={x} className="p-4">{x}</th>)}</tr></thead><tbody>{job.items.map((item: any) => <tr key={item.id} className="border-t border-white/10"><td className="p-4">{item.keyword}</td><td className="p-4">{item.status}</td><td className="p-4">{item.post ? <Link className="text-[color:var(--gold)]" href={`/admin/tin-tuc/${item.post.id}/chinh-sua`}>{item.post.title}</Link> : '—'}</td><td className="p-4">{item.scheduledAt ? new Date(item.scheduledAt).toLocaleString('vi-VN') : '—'}</td><td className="max-w-xs p-4 text-red-300">{item.errorMessage || '—'}</td></tr>)}</tbody></table></div></div>
}
