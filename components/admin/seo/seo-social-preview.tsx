import Image from 'next/image'

export default function SeoSocialPreview({ title, description, image }: { title: string; description: string; image?: string | null }) {
  return <div className="overflow-hidden rounded-xl border border-white/10 bg-[color:var(--surface-2)]">{image ? <div className="relative aspect-[1200/630]"><Image src={image} alt="Xem trước ảnh chia sẻ" fill className="object-cover" sizes="520px" /></div> : <div className="flex aspect-[1200/630] items-center justify-center bg-black/30 text-sm text-[color:var(--muted)]">Chưa chọn ảnh chia sẻ</div>}<div className="p-4"><p className="font-bold text-white">{title || 'Tiêu đề chia sẻ'}</p><p className="mt-1 line-clamp-2 text-sm text-[color:var(--muted)]">{description || 'Mô tả chia sẻ mạng xã hội'}</p></div></div>
}
