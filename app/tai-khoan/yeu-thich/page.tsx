import WishlistPage from '@/components/customer/wishlist/wishlist-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sản phẩm yêu thích | Khanh Nguyên Forklift',
  description: 'Danh sách sản phẩm xe nâng được yêu thích của bạn tại Khanh Nguyên Forklift.',
}

export default function Page() {
  return <WishlistPage />
}
