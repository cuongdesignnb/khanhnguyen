import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Không tìm thấy trang', robots: { index: false, follow: false } }

export default function NotFound() {
  return <main className="flex min-h-[65vh] items-center justify-center px-6 py-24 text-center"><div className="w-full max-w-xl"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[color:var(--gold)]">Lỗi 404</p><h1 className="mt-4 text-4xl font-black text-white md:text-6xl">Không tìm thấy trang</h1><p className="mt-5 text-[color:var(--muted)]">Đường dẫn có thể đã được thay đổi hoặc nội dung không còn tồn tại.</p><form action="/san-pham" className="mx-auto mt-7 flex max-w-md gap-2"><input name="q" aria-label="Tìm sản phẩm" placeholder="Tìm sản phẩm..." className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-[color:var(--gold)]" /><button className="rounded-xl bg-[color:var(--gold)] px-4 py-3 font-bold text-black">Tìm kiếm</button></form><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/" className="rounded-xl bg-[color:var(--gold)] px-5 py-3 font-bold text-black">Về trang chủ</Link><Link href="/san-pham" className="rounded-xl border border-white/15 px-5 py-3 text-white">Xem sản phẩm</Link></div></div></main>
}
