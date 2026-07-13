/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy non-Media mapper payloads are outside this refactor. */
import {
  ProductAdminItem,
  CategoryItem,
  BrandItem,
  OrderAdminItem,
  ContactAdminItem,
  QuoteRequestItem,
  PostAdminItem,
  MediaItem,
  ServiceItem,
} from '@/types/admin'
import type { MediaFileDto } from '@/types/media'

export function mapProductToAdminItem(p: any): ProductAdminItem {
  return {
    id: p.id,
    name: p.name,
    subtitle: p.shortDescription || '',
    model: p.model || '',
    sku: p.sku || '',
    category: p.category?.name || 'Chưa phân loại',
    brand: p.brand?.name || 'Không có',
    price: p.price ? Number(p.price) : 0,
    priceLabel: p.priceLabel || 'Liên hệ',
    image: p.thumbnail?.url || '/images/placeholder.jpg',
    isFeatured: p.isFeatured || false,
    isVisible: p.status === 'PUBLISHED',
    status: p.status === 'PUBLISHED' ? 'visible' : p.status === 'SOLD' ? 'sold' : 'hidden',
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('vi-VN') : '',
  }
}

export function mapCategoryToItem(c: any): CategoryItem {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    parent: c.parent?.name || null,
    productCount: c._count?.products || 0,
    isVisible: c.isVisible ?? true,
    order: c.sortOrder ?? 0,
    icon: c.icon || 'Folder',
    description: c.description || '',
  }
}

export function mapBrandToItem(b: any): BrandItem {
  const logo = b.logo && typeof b.logo === 'object'
    ? {
        id: String(b.logo.id || b.logoId || ''),
        url: String(b.logo.url || ''),
        filename: String(b.logo.filename || ''),
        originalName: String(b.logo.originalName || b.logo.filename || ''),
        mimeType: String(b.logo.mimeType || ''),
        extension: String(b.logo.extension || ''),
        width: typeof b.logo.width === 'number' ? b.logo.width : null,
        height: typeof b.logo.height === 'number' ? b.logo.height : null,
        alt: typeof b.logo.alt === 'string' ? b.logo.alt : null,
        title: typeof b.logo.title === 'string' ? b.logo.title : null,
        size: Number(b.logo.size) || 0,
      }
    : typeof b.logo === 'string' && b.logo
      ? {
          id: String(b.logoId || ''), url: b.logo, filename: '', originalName: '', mimeType: '', extension: '',
          width: null, height: null, alt: null, title: null, size: 0,
        }
      : null
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logoId: b.logoId || logo?.id || null,
    logo,
    description: b.description || '',
    sortOrder: b.sortOrder ?? 0,
    productCount: b.productCount ?? b._count?.products ?? 0,
    isVisible: b.isVisible ?? true,
  }
}

export function mapBrandToAdminDto(b: any) {
  const item = mapBrandToItem(b)
  return {
    ...b,
    logoId: item.logoId,
    logo: item.logo,
    productCount: item.productCount,
    _count: undefined,
  }
}

export function mapOrderToAdminItem(o: any): OrderAdminItem {
  return {
    id: o.id,
    code: o.code,
    customerName: o.customerName,
    company: o.company || '',
    phone: o.phone,
    email: o.email || '',
    address: o.address || '',
    items: (o.items || []).map((item: any) => ({
      id: item.id,
      productName: item.productName,
      model: item.model || '',
      sku: item.sku || '',
      image: item.imageUrl || '/images/placeholder.jpg',
      quantity: item.quantity,
      unitPrice: item.unitPrice ? Number(item.unitPrice) : 0,
      totalPrice: item.totalPrice ? Number(item.totalPrice) : 0,
    })),
    totalAmount: o.totalAmount ? Number(o.totalAmount) : 0,
    depositAmount: o.depositAmount ? Number(o.depositAmount) : 0,
    remainingAmount: o.remainingAmount ? Number(o.remainingAmount) : 0,
    orderStatus: (o.orderStatus || 'PENDING').toLowerCase() as any,
    paymentStatus: (o.paymentStatus || 'UNPAID').toLowerCase() as any,
    source: (o.source || 'WEBSITE').toLowerCase() as any,
    deliveryMethod: (o.deliveryMethod || 'DELIVERY').toLowerCase() as any,
    assignedTo: o.assignedTo?.name || 'Chưa gán',
    note: o.note || '',
    internalNote: o.internalNote || '',
    expectedDeliveryAt: o.expectedDeliveryAt ? new Date(o.expectedDeliveryAt).toISOString() : undefined,
    createdAt: o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : '',
    updatedAt: o.updatedAt ? new Date(o.updatedAt).toLocaleString('vi-VN') : '',
  }
}

export function mapContactToAdminItem(c: any): ContactAdminItem {
  const d = c.createdAt ? new Date(c.createdAt) : new Date()
  return {
    id: c.id,
    name: c.name,
    company: c.company || '',
    email: c.email || '',
    phone: c.phone,
    need: c.need || c.message || '',
    status: (c.status || 'NEW').toLowerCase() as any,
    time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    date: d.toLocaleDateString('vi-VN'),
    note: c.internalNote || '',
  }
}

export function mapQuoteRequestToItem(q: any): QuoteRequestItem {
  return {
    id: q.id,
    code: q.code,
    name: q.name,
    company: q.company || '',
    phone: q.phone,
    email: q.email || '',
    product: q.product?.name || q.productName || 'Không xác định',
    quantity: q.quantity || 1,
    budget: q.budget || 'Liên hệ',
    status: (q.status || 'NEW').toLowerCase() as any,
    assignedTo: q.assignedTo?.name || 'Chưa gán',
    date: q.createdAt ? new Date(q.createdAt).toLocaleDateString('vi-VN') : '',
    note: q.internalNote || '',
  }
}

export function mapPostToAdminItem(p: any): PostAdminItem {
  return {
    id: p.id,
    title: p.title,
    image: p.thumbnail?.url || '/images/placeholder.jpg',
    category: p.category?.name || 'Chưa phân loại',
    status: (p.status || 'DRAFT').toLowerCase() as any,
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('vi-VN') : 'Chưa đăng',
    author: p.author?.name || 'Admin',
  }
}

export function mapMediaToItem(media: MediaFileDto): MediaItem {
  return media
}

export function mapServiceToItem(s: any): ServiceItem {
  return {
    id: s.id,
    title: s.title,
    slug: s.slug,
    image: s.image?.url || '/images/placeholder.jpg',
    status: s.status === 'PUBLISHED' ? 'published' : 'draft',
    faqCount: s.faqs?.length || 0,
    updatedAt: s.updatedAt ? new Date(s.updatedAt).toLocaleDateString('vi-VN') : '',
    description: s.description || '',
  }
}
