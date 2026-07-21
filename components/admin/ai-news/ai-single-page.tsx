'use client'

import { useState } from 'react'
import Image from 'next/image'
import { WandSparkles } from 'lucide-react'
import { toast } from '@/lib/toast'

type GeneratedArticleResult = {
  title: string
  excerpt: string
  contentHtml: string
  featuredImage?: { url: string; alt: string } | null
  warnings: string[]
}

async function readJson(response: Response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Máy chủ trả về HTTP ${response.status} thay vì JSON.`)
  }
}

export default function AiSinglePage() {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GeneratedArticleResult | null>(null)

  const generate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/ai/news/generate-one', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ keyword, generateFeaturedImage: true, generateHeadingImages: true }),
      })
      const json = await readJson(response)
      if (!json.success) throw new Error(json.error)
      const warnings: string[] = Array.isArray(json.data.warnings) ? json.data.warnings : []
      setResult({ ...json.data, warnings })
      if (warnings.length) toast.warning(`Bài đã tạo nhưng có ${warnings.length} cảnh báo ảnh.`)
      else toast.success('Đã tạo bài viết bằng AI.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể sinh bài')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 text-white">
      <h1 className="text-2xl font-black">AI hỗ trợ viết tin tức</h1>
      <div className="flex gap-3 border-y border-white/10 py-5">
        <input maxLength={200} className="flex-1 rounded-lg bg-white/5 px-4 py-3 outline-none" placeholder="Nhập tiêu đề hoặc từ khóa" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
        <button disabled={loading || !keyword.trim()} onClick={generate} className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--gold)] px-5 font-bold text-black disabled:opacity-50">
          <WandSparkles className="size-4" />
          {loading ? 'Đang sinh...' : 'Sinh bài'}
        </button>
      </div>
      {result && (
        <article className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-xl font-bold">{result.title}</h2>
          <p className="text-sm text-[color:var(--muted)]">{result.excerpt}</p>
          {result.warnings?.length > 0 && (
            <ul className="space-y-1 border-l-2 border-amber-400/70 pl-4 text-sm text-amber-200">
              {result.warnings.map((warning: string) => <li key={warning}>{warning}</li>)}
            </ul>
          )}
          {result.featuredImage && <div className="relative mb-5 aspect-video w-full overflow-hidden rounded-lg"><Image src={result.featuredImage.url} alt={result.featuredImage.alt} fill unoptimized className="object-cover" /></div>}
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.contentHtml }} />
        </article>
      )}
    </div>
  )
}
