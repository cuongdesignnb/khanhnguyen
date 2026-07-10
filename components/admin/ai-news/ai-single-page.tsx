'use client'

import { useState } from 'react'
import { toast } from '@/lib/toast'

export default function AiSinglePage() {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const generate = async () => {
    setLoading(true)
    const response = await fetch('/api/admin/ai/news/generate-one', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ keyword, generateFeaturedImage: true, generateHeadingImages: true }) })
    const json = await response.json(); setLoading(false)
    json.success ? setResult(json.data) : toast.error(json.error)
  }
  return <div className="mx-auto max-w-5xl space-y-6 p-6 text-white"><div><h1 className="text-2xl font-black">AI hỗ trợ viết tin tức</h1><p className="text-sm text-[color:var(--muted)]">Sinh nội dung SEO và ảnh, sau đó kiểm tra trước khi đưa vào bài viết.</p></div><div className="flex gap-3 rounded-2xl border border-white/10 p-5"><input maxLength={200} className="flex-1 rounded-xl bg-white/5 px-4 py-3 outline-none" placeholder="Nhập tiêu đề hoặc từ khóa..." value={keyword} onChange={(e) => setKeyword(e.target.value)} /><button disabled={loading || !keyword.trim()} onClick={generate} className="rounded-xl bg-[color:var(--gold)] px-5 font-bold text-black disabled:opacity-50">{loading ? 'Đang sinh...' : 'Sinh bài bằng AI'}</button></div>{result && <article className="rounded-2xl border border-white/10 p-6"><h2 className="text-xl font-bold">{result.title}</h2><p className="my-3 text-sm text-[color:var(--muted)]">{result.excerpt}</p>{result.featuredImage && <img src={result.featuredImage.url} alt={result.featuredImage.alt} className="mb-5 aspect-video w-full rounded-xl object-cover" />}<div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.contentHtml }} /></article>}</div>
}
