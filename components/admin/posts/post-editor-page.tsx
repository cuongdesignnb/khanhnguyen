'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AdminButton from '@/components/admin/admin-button'
import { adminApi } from '@/lib/admin-api'
import MediaPicker from '@/components/admin/media-picker'
import RichTextEditor from '@/components/admin/editor/rich-text-editor'
import SeoFormSection from '@/components/admin/seo/seo-form-section'
import { toast } from '@/lib/toast'
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  X,
  Globe,
  Settings,
  Eye,
  Check,
  Sparkles,
} from 'lucide-react'
import type { MediaItem } from '@/types/admin'

const inputClass =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 focus:ring-1 focus:ring-[color:var(--gold)]/20 transition-all'
const labelClass = 'text-xs text-[color:var(--muted)] mb-1.5 font-semibold block uppercase tracking-wider'
const selectClass =
  'w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[color:var(--text)] outline-none appearance-none cursor-pointer focus:border-[color:var(--gold)]/50'

interface PostEditorPageProps {
  mode: 'create' | 'edit'
  postId?: string
}

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function PostEditorPage({ mode, postId }: PostEditorPageProps) {
  const router = useRouter()
  
  // Data lists
  const [postCategories, setPostCategories] = useState<any[]>([])
  
  // Form states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugEditedManually, setIsSlugEditedManually] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'HIDDEN'>('DRAFT')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailMedia, setThumbnailMedia] = useState<MediaItem | null>(null)
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [ogTitle, setOgTitle] = useState('')
  const [ogDescription, setOgDescription] = useState('')
  const [ogImageId, setOgImageId] = useState<string | null>(null)
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null)
  const [robotsIndex, setRobotsIndex] = useState(true)
  const [robotsFollow, setRobotsFollow] = useState(true)
  
  // App states
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState('')

  // Track if changes are made to alert user on exit
  const isInitialLoad = useRef(true)

  useEffect(() => {
    // Load categories
    adminApi.getPostCategories().then(setPostCategories).catch(console.error)
  }, [])

  // Load editing post data
  useEffect(() => {
    if (mode === 'edit' && postId) {
      adminApi
        .getPostById(postId)
        .then((res) => {
          setTitle(res.title || '')
          setSlug(res.slug || '')
          setIsSlugEditedManually(true)
          setCategoryId(res.categoryId || '')
          setStatus(res.status)
          setExcerpt(res.excerpt || '')
          setContent(res.content || '')
          setSeoTitle(res.seoTitle || '')
          setSeoDescription(res.seoDescription || '')
          setCanonicalUrl(res.canonicalUrl || '')
          setOgTitle(res.ogTitle || '')
          setOgDescription(res.ogDescription || '')
          setOgImageId(res.ogImageId || null)
          setOgImageUrl(res.ogImage?.url || null)
          setRobotsIndex(res.robotsIndex ?? true)
          setRobotsFollow(res.robotsFollow ?? true)
          if (res.thumbnail) {
            setThumbnailMedia({
              id: res.thumbnail.id,
              src: res.thumbnail.url,
              alt: res.thumbnail.alt || '',
              type: 'post',
              format: 'jpg',
              size: '',
              uploadedAt: '',
            })
          } else {
            setThumbnailMedia(null)
          }
          setIsDirty(false)
          isInitialLoad.current = false
        })
        .catch((err) => {
          console.error(err)
          toast.error('Lỗi tải bài viết')
        })
    } else {
      isInitialLoad.current = false
    }
  }, [mode, postId])

  // Track dirtiness
  useEffect(() => {
    if (!isInitialLoad.current) {
      setIsDirty(true)
    }
  }, [title, slug, categoryId, status, excerpt, content, thumbnailMedia, seoTitle, seoDescription])

  // Auto slug generation
  useEffect(() => {
    if (mode === 'create' && !isSlugEditedManually) {
      setSlug(generateSlug(title))
    }
  }, [title, mode, isSlugEditedManually])

  // Warn on tab/window close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = 'Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời trang?'
        return e.returnValue
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty])

  // Handle quay lại
  const handleBack = () => {
    if (isDirty) {
      const ok = confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời trang?')
      if (!ok) return
    }
    router.push('/admin/tin-tuc')
  }

  // Handle save
  const handleSave = async (targetStatus?: typeof status) => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài viết')
      return
    }

    setSaving(true)
    const nextStatus = targetStatus || status
    
    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      categoryId: categoryId || null,
      status: nextStatus,
      excerpt: excerpt.trim(),
      content: content.trim(),
      thumbnailId: thumbnailMedia?.id || null,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      canonicalUrl: canonicalUrl.trim() || null,
      ogTitle: ogTitle.trim() || null,
      ogDescription: ogDescription.trim() || null,
      ogImageId,
      robotsIndex,
      robotsFollow,
    }

    try {
      let res
      if (mode === 'edit' && postId) {
        res = await adminApi.updatePost(postId, payload)
        toast.success('Cập nhật bài viết thành công')
      } else {
        res = await adminApi.createPost(payload)
        toast.success('Tạo bài viết thành công')
      }

      setIsDirty(false)
      setLastSaved(new Date().toLocaleTimeString('vi-VN'))
      
      if (mode === 'create' && res?.id) {
        router.push(`/admin/tin-tuc/${res.id}/chinh-sua`)
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Có lỗi xảy ra khi lưu bài viết')
    } finally {
      setSaving(false)
    }
  }

  const handleMediaSelect = (items: MediaItem[]) => {
    if (items.length > 0) {
      setThumbnailMedia(items[0])
    }
  }

  const callAi = async (url: string, body: unknown) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error || 'Không thể xử lý yêu cầu AI')
    return result.data
  }

  const handleGenerateArticle = async () => {
    if (!title.trim()) return toast.error('Vui lòng nhập tiêu đề trước')
    let insertMode: 'replace' | 'append' = 'replace'
    if (content.trim()) {
      const replace = confirm('Bài viết hiện đã có nội dung. Chọn OK để ghi đè, hoặc Hủy để chèn thêm bên dưới.')
      insertMode = replace ? 'replace' : 'append'
    }
    setAiLoading('Đang sinh nội dung...')
    try {
      const data = await callAi('/api/admin/ai/news/generate-one', {
        title, generateFeaturedImage: true, generateHeadingImages: true, maxHeadingImages: 3,
      })
      setTitle((current) => current || data.title)
      setSlug(data.slug)
      setIsSlugEditedManually(true)
      setExcerpt(data.excerpt)
      setSeoTitle(data.seoTitle)
      setSeoDescription(data.seoDescription)
      setContent((current) => insertMode === 'append' ? `${current}\n${data.contentHtml}` : data.contentHtml)
      if (data.featuredImage) setThumbnailMedia({ id: data.featuredImage.mediaId, src: data.featuredImage.url, alt: data.featuredImage.alt, type: 'post', format: 'webp', size: '', uploadedAt: '' })
      toast.success('Đã sinh bài và ảnh bằng AI')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể sinh bài')
    } finally { setAiLoading('') }
  }

  const handleGenerateFeaturedImage = async () => {
    if (!title.trim()) return toast.error('Vui lòng nhập tiêu đề trước')
    setAiLoading('Đang sinh ảnh đại diện...')
    try {
      const image = await callAi('/api/admin/ai/news/generate-image', { title, type: 'featured' })
      setThumbnailMedia({ id: image.mediaId, src: image.url, alt: image.alt, type: 'post', format: 'webp', size: '', uploadedAt: '' })
      toast.success('Ảnh đã được lưu vào Media Library')
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Không thể sinh ảnh') } finally { setAiLoading('') }
  }

  const handleGenerateHeadingImages = async () => {
    const headings = [...content.matchAll(/<h[23][^>]*>(.*?)<\/h[23]>/gi)].map((match) => match[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean)
    if (!headings.length) return toast.error('Nội dung chưa có heading h2/h3')
    setAiLoading('Đang sinh ảnh minh họa...')
    try {
      const data = await callAi('/api/admin/ai/news/generate-heading-images', { contentHtml: content, headings, maxHeadingImages: 3 })
      setContent(data.contentHtml)
      toast.success(`Đã chèn ${data.images.length} ảnh minh họa`)
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Không thể sinh ảnh heading') } finally { setAiLoading('') }
  }

  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--text)] pb-12 flex flex-col">
      {/* Sticky Topbar */}
      <header className="sticky top-0 z-[40] bg-[color:var(--surface)]/90 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-sm text-[color:var(--silver)] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </button>
          
          <div className="h-6 w-px bg-white/10 hidden sm:block" />
          
          <div>
            <h1 className="text-sm font-bold text-white hidden sm:block">
              {mode === 'edit' ? 'Đang chỉnh sửa bài viết' : 'Viết bài mới'}
            </h1>
            {lastSaved && (
              <p className="text-[10px] text-[color:var(--muted)]">
                Lưu lần cuối lúc: {lastSaved}
              </p>
            )}
            {isDirty && !lastSaved && (
              <p className="text-[10px] text-[color:var(--gold)]">
                Có thay đổi chưa lưu
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {mode === 'edit' && status === 'PUBLISHED' && (
            <a
              href={`/tin-tuc/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs text-[color:var(--silver)] transition"
            >
              <Eye size={14} />
              <span>Xem bài viết</span>
            </a>
          )}

          <button
            onClick={() => handleSave('DRAFT')}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg border border-[color:var(--line-gold)] text-[color:var(--gold)] hover:bg-[color:var(--gold)]/10 text-xs font-bold transition cursor-pointer disabled:opacity-50"
          >
            Lưu nháp
          </button>

          <button
            onClick={() => handleSave(status === 'DRAFT' ? 'PUBLISHED' : status)}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[color:var(--gold)] hover:bg-[color:var(--gold-strong)] text-xs font-black text-black transition cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span>Đang lưu...</span>
            ) : (
              <>
                <Check size={14} />
                <span>{mode === 'edit' ? 'Cập nhật' : 'Đăng bài'}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1400px] w-full mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Left Column (70%) */}
        <main className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="sr-only">Tiêu đề bài viết</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full bg-transparent border-b border-white/10 py-3 text-2xl sm:text-3xl font-black text-white placeholder:text-[color:var(--muted)]/30 outline-none focus:border-[color:var(--gold)] transition-colors"
                required
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={handleGenerateArticle} disabled={Boolean(aiLoading)} className="flex items-center gap-2 rounded-xl bg-violet-500/15 px-4 py-2 text-xs font-bold text-violet-200 ring-1 ring-violet-400/30 disabled:opacity-50"><Sparkles size={15} /> Sinh bài bằng AI</button>
              <button type="button" onClick={handleGenerateFeaturedImage} disabled={Boolean(aiLoading)} className="rounded-xl border border-white/10 px-4 py-2 text-xs disabled:opacity-50">Sinh ảnh đại diện</button>
              <button type="button" onClick={handleGenerateHeadingImages} disabled={Boolean(aiLoading)} className="rounded-xl border border-white/10 px-4 py-2 text-xs disabled:opacity-50">Sinh ảnh theo heading</button>
              {aiLoading && <span className="text-xs text-[color:var(--gold)]">{aiLoading}</span>}
            </div>

            <div className="flex items-center gap-2 text-xs bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 text-[color:var(--muted)]">
              <span className="font-semibold text-white">Đường dẫn tĩnh (Slug):</span>
              <span className="font-mono">/tin-tuc/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value)
                  setIsSlugEditedManually(true)
                }}
                placeholder="duong-dan-bai-viet"
                className="bg-transparent border-b border-transparent focus:border-white/20 text-white outline-none flex-1 font-mono text-xs"
              />
            </div>

            <div>
              <label className={labelClass}>Tóm tắt ngắn (Excerpt)</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Nhập tóm tắt ngắn giới thiệu bài viết..."
                className="w-full bg-[color:var(--surface-2)] border border-white/10 rounded-xl px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/50 outline-none focus:border-[color:var(--gold)]/50 resize-none h-24"
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-2)] p-4">
              <label className={`${labelClass} mb-3`}>Nội dung bài viết</label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Nhập nội dung chi tiết bài viết tại đây..."
                minHeight={500}
              />
            </div>
          </div>
        </main>

        {/* Right Settings Sidebar (30%) */}
        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          {/* Card: Thiết lập chính */}
          <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-2)] p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Settings size={16} className="text-[color:var(--gold)]" />
              <h3 className="text-sm font-bold text-white">Thiết lập bài viết</h3>
            </div>

            <div>
              <label className={labelClass}>Danh mục tin</label>
              <select
                className={selectClass}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Chọn danh mục</option>
                {postCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Trạng thái</label>
              <select
                className={selectClass}
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="DRAFT">Nháp</option>
                <option value="PUBLISHED">Công khai</option>
                <option value="HIDDEN">Ẩn bài</option>
              </select>
            </div>
          </div>

          {/* Card: Ảnh đại diện */}
          <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-2)] p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <ImageIcon size={16} className="text-[color:var(--gold)]" />
              <h3 className="text-sm font-bold text-white">Ảnh đại diện</h3>
            </div>

            <div className="space-y-3">
              {thumbnailMedia ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/25 flex items-center justify-center">
                  <Image src={thumbnailMedia.src} alt="" fill className="object-cover" />
                  <button
                    onClick={() => setThumbnailMedia(null)}
                    className="absolute top-2 right-2 bg-black/80 text-white rounded-full p-1.5 hover:bg-rose-500 transition cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setMediaPickerOpen(true)}
                  className="aspect-video w-full rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center text-[color:var(--muted)] hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer gap-2"
                >
                  <ImageIcon size={28} />
                  <span className="text-xs">Chọn ảnh từ thư viện</span>
                </div>
              )}
              {thumbnailMedia && (
                <AdminButton
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => setMediaPickerOpen(true)}
                >
                  Thay đổi ảnh
                </AdminButton>
              )}
            </div>
          </div>

          <SeoFormSection path={`/tin-tuc/${slug || 'slug-bai-viet'}`} value={{ seoTitle, seoDescription, canonicalUrl, ogTitle, ogDescription, ogImageId, ogImageUrl, robotsIndex, robotsFollow }} onChange={(seo) => { setSeoTitle(seo.seoTitle); setSeoDescription(seo.seoDescription); setCanonicalUrl(seo.canonicalUrl); setOgTitle(seo.ogTitle); setOgDescription(seo.ogDescription); setOgImageId(seo.ogImageId); setOgImageUrl(seo.ogImageUrl || null); setRobotsIndex(seo.robotsIndex); setRobotsFollow(seo.robotsFollow) }} />
        </aside>
      </div>

      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  )
}
