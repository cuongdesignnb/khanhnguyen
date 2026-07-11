export default function SeoGooglePreview({ title, description, url }: { title: string; description: string; url: string }) {
  return <div className="rounded-xl border border-white/10 bg-white p-4 text-left"><p className="truncate text-xs text-emerald-700">{url || 'https://ten-mien.vn/duong-dan'}</p><p className="mt-1 truncate text-lg text-[#1a0dab]">{title || 'Tiêu đề trang sẽ hiển thị tại đây'}</p><p className="mt-1 line-clamp-2 text-sm leading-5 text-[#4d5156]">{description || 'Mô tả SEO của trang sẽ hiển thị tại đây.'}</p></div>
}
