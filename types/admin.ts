// ─── Status Types ────────────────────────────────────────────────────────────

export type AdminStatus =
  | 'new'
  | 'processing'
  | 'contacted'
  | 'quoted'
  | 'closed'
  | 'ignored'

export type PostStatus = 'published' | 'draft' | 'scheduled'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipping'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded'

export type ProductVisibility = 'visible' | 'hidden'

export type OrderSource = 'website' | 'admin' | 'phone' | 'zalo' | 'facebook'

export type DeliveryMethod = 'pickup' | 'delivery' | 'installation'

export type PaymentMethod = 'cash' | 'transfer' | 'cod'

// ─── Status Label & Color Maps ───────────────────────────────────────────────

export const statusLabelMap: Record<string, string> = {
  new: 'Mới',
  processing: 'Đang xử lý',
  contacted: 'Đã liên hệ',
  quoted: 'Đã báo giá',
  closed: 'Đã đóng',
  ignored: 'Bỏ qua',
  published: 'Đã đăng',
  draft: 'Nháp',
  scheduled: 'Hẹn lịch',
  visible: 'Hiển thị',
  hidden: 'Ẩn',
  sold: 'Đã bán',
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  unpaid: 'Chưa thanh toán',
  partial: 'Đã cọc',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
}

export const statusColorMap: Record<string, string> = {
  new: 'gold',
  processing: 'blue',
  contacted: 'green',
  quoted: 'purple',
  closed: 'gray',
  ignored: 'gray',
  published: 'green',
  draft: 'gray',
  scheduled: 'orange',
  visible: 'green',
  hidden: 'gray',
  sold: 'green',
  pending: 'gold',
  confirmed: 'blue',
  shipping: 'blue',
  completed: 'green',
  cancelled: 'red',
  unpaid: 'gray',
  partial: 'gold',
  paid: 'green',
  refunded: 'purple',
}

// ─── Admin Stat ──────────────────────────────────────────────────────────────

export type AdminStat = {
  label: string
  value: number | string
  change: number
  icon: string
}

// ─── Product Admin ───────────────────────────────────────────────────────────

export type ProductAdminItem = {
  id: string
  name: string
  subtitle: string
  model: string
  sku: string
  category: string
  brand: string
  price: number
  priceLabel: string
  image: string
  isFeatured: boolean
  isVisible: boolean
  status: 'visible' | 'hidden' | 'sold'
  updatedAt: string
}

// ─── Contact Admin ───────────────────────────────────────────────────────────

export type ContactAdminItem = {
  id: string
  name: string
  company: string
  email: string
  phone: string
  need: string
  status: AdminStatus
  time: string
  date: string
  note: string
}

// ─── Quote Request ───────────────────────────────────────────────────────────

export type QuoteRequestItem = {
  id: string
  code: string
  name: string
  company: string
  phone: string
  email: string
  product: string
  quantity: number
  budget: string
  status: AdminStatus
  assignedTo: string
  date: string
  note: string
}

// ─── Post Admin ──────────────────────────────────────────────────────────────

export type PostAdminItem = {
  id: string
  title: string
  image: string
  category: string
  status: PostStatus
  publishedAt: string
  author: string
}

// ─── Order Item ──────────────────────────────────────────────────────────────

export type OrderItem = {
  id: string
  productName: string
  model: string
  sku: string
  image: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

// ─── Order Admin ─────────────────────────────────────────────────────────────

export type OrderAdminItem = {
  id: string
  code: string
  customerName: string
  company: string
  phone: string
  email: string
  address: string
  items: OrderItem[]
  totalAmount: number
  depositAmount: number
  remainingAmount: number
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  source: OrderSource
  deliveryMethod: DeliveryMethod
  assignedTo: string
  note: string
  internalNote: string
  createdAt: string
  updatedAt: string
}

// ─── Order Timeline ──────────────────────────────────────────────────────────

export type OrderTimelineEvent = {
  date: string
  time: string
  description: string
  type: 'create' | 'update' | 'payment' | 'shipping' | 'note'
}

// ─── Media ───────────────────────────────────────────────────────────────────

export type MediaItem = {
  id: string
  src: string
  alt: string
  type: 'product' | 'service' | 'post' | 'hero' | 'other'
  format: 'jpg' | 'png' | 'webp' | 'svg'
  size: string
  uploadedAt: string
}

// ─── Category ────────────────────────────────────────────────────────────────

export type CategoryItem = {
  id: string
  name: string
  slug: string
  parent: string | null
  productCount: number
  isVisible: boolean
  order: number
  icon: string
  description: string
}

// ─── Brand ───────────────────────────────────────────────────────────────────

export type BrandItem = {
  id: string
  name: string
  slug: string
  logo: string
  description: string
  productCount: number
  isVisible: boolean
}

// ─── Service ─────────────────────────────────────────────────────────────────

export type ServiceItem = {
  id: string
  title: string
  slug: string
  image: string
  status: 'published' | 'draft'
  faqCount: number
  updatedAt: string
  description: string
}

// ─── Setting ─────────────────────────────────────────────────────────────────

export type SettingItem = {
  id: string
  label: string
  value: string
  icon: string
  type: 'text' | 'textarea' | 'image' | 'url' | 'link'
}

// ─── Sidebar Menu ────────────────────────────────────────────────────────────

export type AdminMenuItem = {
  label: string
  href: string
  icon: string
}
