// ─── Site Config ─────────────────────────────────────────────────────────────

export const siteConfig = {
  name: 'KHANH NGUYÊN',
  tagline: 'Chuyên mua bán xe nâng Nhật bãi',
  slogan: 'Uy tín – Chất lượng – Tạo niềm tin',
  hotline: '0903 385 225',
  secondaryHotline: '0903 959 225',
  email: 'info@khanhnguyenforklift.vn',
  showroom: 'QL1A, Phường Bình Hưng Hòa, Quận Bình Tân, TP. Hồ Chí Minh',
  branch: '',
  workingHours: 'Thứ 2 - Thứ 7: 7:30 - 17:30',
} as const

// ─── Navigation ──────────────────────────────────────────────────────────────

export type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export const navigation: NavItem[] = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Xe nâng mới', href: '/xe-nang-moi' },
  {
    label: 'Xe nâng điện',
    href: '/xe-nang-dien',
    children: [
      { label: 'Xe nâng điện đứng lái', href: '/xe-nang-dien/dung-lai' },
      { label: 'Xe nâng điện ngồi lái', href: '/xe-nang-dien/ngoi-lai' },
    ],
  },
  { label: 'Xe nâng dầu', href: '/xe-nang-dau' },
  { label: 'Xe nâng tay', href: '/xe-nang-tay' },
  { label: 'Bình điện', href: '/binh-dien' },
  { label: 'Xe nâng khác', href: '/xe-nang-khac' },
  { label: 'Phụ tùng xe nâng', href: '/phu-tung' },
  {
    label: 'Dịch vụ',
    href: '/dich-vu',
    children: [
      { label: 'Cho thuê xe nâng', href: '/dich-vu/cho-thue' },
      { label: 'Bảo hành', href: '/dich-vu/bao-hanh' },
      { label: 'Sửa chữa', href: '/dich-vu/sua-chua' },
      { label: 'Đặt hàng từ Nhật', href: '/dich-vu/dat-hang-nhat' },
    ],
  },
  { label: 'Tin tức', href: '/tin-tuc' },
  { label: 'Liên hệ', href: '#lien-he' },
]

// ─── Categories ──────────────────────────────────────────────────────────────

export type Category = {
  id: string
  label: string
  subtitle: string
  icon: string
  href: string
}

export const categories: Category[] = [
  { id: 'xe-nang-dien', label: 'Xe nâng điện', subtitle: 'Xem ngay', icon: 'Zap', href: '/xe-nang-dien' },
  { id: 'xe-nang-dau', label: 'Xe nâng dầu', subtitle: 'Xem ngay', icon: 'Fuel', href: '/xe-nang-dau' },
  { id: 'xe-nang-tay', label: 'Xe nâng tay', subtitle: 'Xem ngay', icon: 'Hand', href: '/xe-nang-tay' },
  { id: 'xe-cau', label: 'Xe cẩu', subtitle: 'Xem ngay', icon: 'Construction', href: '/xe-cau' },
  { id: 'binh-dien', label: 'Bình điện', subtitle: 'Xem ngay', icon: 'BatteryCharging', href: '/binh-dien' },
  { id: 'phu-tung', label: 'Phụ tùng', subtitle: 'Xem ngay', icon: 'Settings', href: '/phu-tung' },
  { id: 'phu-kien', label: 'Phụ kiện', subtitle: 'Xem ngay', icon: 'Wrench', href: '/phu-kien' },
  { id: 'dich-vu', label: 'Dịch vụ', subtitle: 'Xem ngay', icon: 'Headset', href: '/dich-vu' },
]

// ─── Products ────────────────────────────────────────────────────────────────

export type Product = {
  id: string
  badge?: 'Mới' | 'Bán chạy' | 'Giảm giá'
  category: string
  name: string
  image: string
  specs: Array<{ label: string; value: string }>
  priceLabel: string
}

export const featuredProducts: Product[] = [
  {
    id: 'toyota-8fb25',
    badge: 'Mới',
    category: 'Xe nâng điện ngồi lái',
    name: 'TOYOTA 8FB25',
    image: '/images/seed/products/toyota-8fb25.jpg',
    specs: [
      { label: 'Tải trọng', value: '2.5 tấn' },
      { label: 'Nâng cao', value: '3.0 m' },
      { label: 'Năm SX', value: '2020' },
    ],
    priceLabel: 'Liên hệ',
  },
  {
    id: 'komatsu-fd25t',
    badge: 'Bán chạy',
    category: 'Xe nâng dầu',
    name: 'KOMATSU FD25T-17',
    image: '/images/seed/products/komatsu-fd25t.jpg',
    specs: [
      { label: 'Tải trọng', value: '2.5 tấn' },
      { label: 'Nâng cao', value: '3.0 m' },
      { label: 'Năm SX', value: '2017' },
    ],
    priceLabel: 'Liên hệ',
  },
  {
    id: 'mitsubishi-rb14',
    badge: 'Giảm giá',
    category: 'Xe nâng điện đứng lái',
    name: 'MITSUBISHI RB14',
    image: '/images/seed/products/mitsubishi-rb14.jpg',
    specs: [
      { label: 'Tải trọng', value: '1.4 tấn' },
      { label: 'Nâng cao', value: '4.5 m' },
      { label: 'Năm SX', value: '2016' },
    ],
    priceLabel: 'Liên hệ',
  },
  {
    id: 'tcm-fd30',
    badge: 'Mới',
    category: 'Xe nâng dầu',
    name: 'TCM FD30T3',
    image: '/images/seed/products/tcm-fd30.jpg',
    specs: [
      { label: 'Tải trọng', value: '3.0 tấn' },
      { label: 'Nâng cao', value: '3.0 m' },
      { label: 'Năm SX', value: '2019' },
    ],
    priceLabel: 'Liên hệ',
  },
  {
    id: 'niuli-ac25',
    badge: 'Bán chạy',
    category: 'Xe nâng tay thấp',
    name: 'NIULI AC25',
    image: '/images/seed/products/niuli-ac25.jpg',
    specs: [
      { label: 'Tải trọng', value: '2.5 tấn' },
      { label: 'Chiều dài càng', value: '1150 mm' },
      { label: 'Năm SX', value: '2023' },
    ],
    priceLabel: 'Liên hệ',
  },
  {
    id: 'unic-urv504',
    badge: 'Giảm giá',
    category: 'Xe cẩu tự hành',
    name: 'UNIC URV504',
    image: '/images/seed/products/unic-urv504.jpg',
    specs: [
      { label: 'Sức nâng', value: '5 tấn' },
      { label: 'Chiều cao', value: '15.2 m' },
      { label: 'Năm SX', value: '2018' },
    ],
    priceLabel: 'Liên hệ',
  },
]

// ─── Brand Names ─────────────────────────────────────────────────────────────

export const brandNames: string[] = [
  'KOMATSU',
  'TOYOTA',
  'MITSUBISHI',
  'TCM',
  'NISSAN FORKLIFT',
  'SUMITOMO',
  'NICHIYU',
  'UNICARRIERS',
]

// ─── Value Propositions ──────────────────────────────────────────────────────

export type ValueProp = {
  icon: string
  title: string
  description: string
}

export const valueProps: ValueProp[] = [
  { icon: 'ShieldCheck', title: 'Xe nâng chất lượng', description: 'Hàng Nhật bãi được chọn lọc kỹ càng' },
  { icon: 'ClipboardCheck', title: 'Hoạt động bền bỉ', description: 'Kiểm định kỹ thuật 100% trước giao' },
  { icon: 'Shield', title: 'Bảo hành uy tín', description: 'Cam kết bảo hành rõ ràng, minh bạch' },
  { icon: 'HandCoins', title: 'Giá tốt hỗ trợ tận tâm', description: 'Hỗ trợ trả góp, tư vấn 24/7' },
]

// ─── Stats ────────────────────────────────────────────────────────────────────

export type Stat = {
  value: number
  suffix: string
  label: string
  icon: string
}

export const stats: Stat[] = [
  { value: 2500, suffix: '+', label: 'Xe nâng đã bán', icon: 'Forklift' },
  { value: 1200, suffix: '+', label: 'Khách hàng tin tưởng', icon: 'Users' },
  { value: 12, suffix: '+', label: 'Năm kinh nghiệm', icon: 'Award' },
  { value: 63, suffix: '', label: 'Tỉnh thành giao hàng', icon: 'MapPin' },
]

// ─── Services ────────────────────────────────────────────────────────────────

export type Service = {
  title: string
  subtitle: string
  image: string
}

export const services: Service[] = [
  { title: 'Cho thuê xe nâng', subtitle: 'Đa dạng tải trọng', image: '/images/seed/services/rental.jpg' },
  { title: 'Sửa chữa xe nâng', subtitle: 'Nhanh chóng – Uy tín', image: '/images/seed/services/repair.jpg' },
  { title: 'Bảo dưỡng định kỳ', subtitle: 'Kéo dài tuổi thọ thiết bị', image: '/images/seed/services/maintenance.jpg' },
  { title: 'Cung cấp phụ tùng', subtitle: 'Chính hãng – Giá tốt', image: '/images/seed/services/parts.jpg' },
  { title: 'Nhập khẩu theo yêu cầu', subtitle: 'Từ Nhật Bản', image: '/images/seed/services/import.jpg' },
]

// ─── Testimonials ────────────────────────────────────────────────────────────

export type Testimonial = {
  name: string
  location: string
  quote: string
  image: string
  rating: number
}

export const testimonials: Testimonial[] = [
  {
    name: 'Anh Minh',
    location: 'Bình Dương',
    quote: 'Xe nâng chất lượng tốt, giao hàng nhanh, nhân viên tư vấn nhiệt tình. Sẽ ủng hộ lâu dài.',
    image: '/images/seed/testimonials/minh.jpg',
    rating: 5,
  },
  {
    name: 'Chị Hằng',
    location: 'Đồng Nai',
    quote: 'Dịch vụ hậu mãi rất chu đáo, kỹ thuật hỗ trợ nhanh chóng khi cần. Khách hàng chúng tôi rất hài lòng!',
    image: '/images/seed/testimonials/hang.jpg',
    rating: 5,
  },
  {
    name: 'Anh Tuấn',
    location: 'Hà Nội',
    quote: 'Giá cả hợp lý, xe đẹp, hoạt động ổn định. Rất hài lòng!',
    image: '/images/seed/testimonials/tuan.jpg',
    rating: 5,
  },
]

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  date: string
  image: string
  href: string
}

export const latestPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Kinh nghiệm chọn mua xe nâng nhật bãi chất lượng',
    excerpt: 'Những lưu ý quan trọng giúp bạn chọn được xe nâng hoạt động bền bỉ, tiết kiệm chi phí...',
    date: '28/06/2024',
    image: '/images/seed/services/repair.jpg',
    href: '/tin-tuc/kinh-nghiem-chon-mua-xe-nang',
  },
  {
    id: 'post-2',
    title: 'Cách bảo dưỡng xe nâng giúp tăng tuổi thọ',
    excerpt: 'Hướng dẫn bảo dưỡng định kỳ giúp xe nâng hoạt động hiệu quả và an toàn...',
    date: '15/06/2024',
    image: '/images/seed/services/maintenance.jpg',
    href: '/tin-tuc/cach-bao-duong-xe-nang',
  },
  {
    id: 'post-3',
    title: 'So sánh xe nâng điện và xe nâng dầu',
    excerpt: 'Nên chọn xe nâng điện hay xe nâng dầu? So sánh ưu nhược điểm chi tiết...',
    date: '10/06/2024',
    image: '/images/seed/products/toyota-8fb25.jpg',
    href: '/tin-tuc/so-sanh-xe-nang-dien-va-dau',
  },
]

// ─── Footer ──────────────────────────────────────────────────────────────────

export type FooterLink = {
  label: string
  href: string
}

export type FooterGroup = {
  title: string
  links: FooterLink[]
}

export const footerGroups: FooterGroup[] = [
  {
    title: 'DANH MỤC SẢN PHẨM',
    links: [
      { label: 'Xe nâng mới', href: '/xe-nang-moi' },
      { label: 'Xe nâng điện', href: '/xe-nang-dien' },
      { label: 'Xe nâng tay', href: '/xe-nang-tay' },
      { label: 'Xe cẩu', href: '/xe-cau' },
      { label: 'Bình điện', href: '/binh-dien' },
      { label: 'Phụ kiện', href: '/phu-kien' },
      { label: 'Phụ tùng xe nâng', href: '/phu-tung' },
    ],
  },
  {
    title: 'DỊCH VỤ',
    links: [
      { label: 'Cho thuê xe nâng', href: '/dich-vu/cho-thue' },
      { label: 'Sửa chữa xe nâng', href: '/dich-vu/sua-chua' },
      { label: 'Bảo dưỡng định kỳ', href: '/dich-vu/bao-duong' },
      { label: 'Cung cấp phụ tùng', href: '/dich-vu/phu-tung' },
      { label: 'Nhập khẩu theo yêu cầu', href: '/dich-vu/nhap-khau' },
      { label: 'Bảo hành', href: '/dich-vu/bao-hanh' },
    ],
  },
  {
    title: 'HỖ TRỢ KHÁCH HÀNG',
    links: [
      { label: 'Hướng dẫn mua hàng', href: '/ho-tro/huong-dan-mua-hang' },
      { label: 'Chính sách bảo hành', href: '/ho-tro/bao-hanh' },
      { label: 'Chính sách đổi trả', href: '/ho-tro/doi-tra' },
      { label: 'Thanh toán – Giao hàng', href: '/ho-tro/thanh-toan' },
      { label: 'Câu hỏi thường gặp', href: '/ho-tro/faq' },
      { label: 'Liên hệ', href: '#lien-he' },
    ],
  },
]
