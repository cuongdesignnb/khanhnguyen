import Link from 'next/link'
import { Menu, PanelTop, PanelBottom, Smartphone } from 'lucide-react'
export default function MenuManagerPage() {
  const cards = [
    { href: '/admin/menu/header', title: 'Menu đầu trang', text: 'Menu chính trên header website.', icon: PanelTop },
    { href: '/admin/menu/footer', title: 'Menu chân trang', text: 'Các nhóm liên kết ở footer.', icon: PanelBottom },
    { href: '/admin/menu/mobile', title: 'Menu di động', text: 'Menu dành cho điện thoại và máy tính bảng.', icon: Smartphone },
  ]
  return <div className="mx-auto max-w-6xl space-y-6 p-6 text-white"><div><h1 className="flex items-center gap-3 text-2xl font-black"><Menu/> Quản lý Menu</h1><p className="text-sm text-[color:var(--muted)]">Tạo, chỉnh sửa và sắp xếp menu hiển thị ở đầu trang, chân trang và thiết bị di động.</p></div><div className="grid gap-5 md:grid-cols-3">{cards.map(({href,title,text,icon:Icon}) => <Link key={href} href={href} className="rounded-2xl border border-white/10 p-6 transition hover:border-[color:var(--gold)]/40 hover:bg-white/[0.025]"><Icon className="mb-5 text-[color:var(--gold)]"/><h2 className="font-bold">{title}</h2><p className="mt-2 text-sm text-[color:var(--muted)]">{text}</p></Link>)}</div></div>
}
