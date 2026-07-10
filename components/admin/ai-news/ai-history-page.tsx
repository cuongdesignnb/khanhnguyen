'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const statusLabel: Record<string, string> = { PENDING: 'Chờ chạy', RUNNING: 'Đang chạy', COMPLETED: 'Hoàn thành', FAILED: 'Lỗi', CANCELLED: 'Đã hủy' }
export default function AiHistoryPage() {
  const [jobs, setJobs] = useState<any[]>([])
  useEffect(() => { const load = () => fetch('/api/admin/ai/news/bulk-jobs').then((r) => r.json()).then((r) => setJobs(r.data || [])); load(); const timer = setInterval(load, 5000); return () => clearInterval(timer) }, [])
  return <div className="mx-auto max-w-6xl space-y-6 p-6 text-white"><div className="flex justify-between"><div><h1 className="text-2xl font-black">Lịch sử AI</h1><p className="text-sm text-[color:var(--muted)]">Tiến độ tự cập nhật mỗi 5 giây.</p></div><Link href="/admin/tin-tuc/ai/hang-loat" className="rounded-xl bg-[color:var(--gold)] px-4 py-2 text-sm font-bold text-black">Tạo job mới</Link></div><div className="overflow-auto rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/5 text-[color:var(--muted)]"><tr>{['Mã job','Trạng thái','Tiến độ','Lỗi','Ngày tạo',''].map((x) => <th key={x} className="p-4">{x}</th>)}</tr></thead><tbody>{jobs.map((job) => <tr key={job.id} className="border-t border-white/10"><td className="p-4 font-mono">{job.code}</td><td className="p-4">{statusLabel[job.status] || job.status}</td><td className="p-4">{job.completedItems}/{job.totalItems}</td><td className="p-4">{job.failedItems}</td><td className="p-4">{new Date(job.createdAt).toLocaleString('vi-VN')}</td><td className="p-4"><Link className="text-[color:var(--gold)]" href={`/admin/tin-tuc/ai/lich-su/${job.id}`}>Chi tiết</Link></td></tr>)}</tbody></table></div></div>
}
