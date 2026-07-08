import {
  adminGet,
  adminPost,
  adminPatch,
  adminDelete,
} from './admin-fetch'
import { PaginatedResponse } from '@/types/api'

// Helper to stringify search query params
function toQueryString(params?: Record<string, any>): string {
  if (!params) return ''
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      searchParams.append(key, String(val))
    }
  })
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

export const adminApi = {
  // ─── Dashboard ─────────────────────────────────────────────────────────────
  getDashboardStats() {
    return adminGet<any>('/api/admin/dashboard')
  },

  // ─── Media Library ─────────────────────────────────────────────────────────
  getMediaList(params?: any) {
    return adminGet<PaginatedResponse<any>>(`/api/admin/media${toQueryString(params)}`)
  },
  getMediaById(id: string) {
    return adminGet<any>(`/api/admin/media/${id}`)
  },
  uploadMedia(formData: FormData) {
    return adminPost<any>('/api/upload', formData)
  },
  updateMedia(id: string, payload: any) {
    return adminPatch<any>(`/api/admin/media/${id}`, payload)
  },
  deleteMedia(id: string) {
    return adminDelete<any>(`/api/admin/media/${id}`)
  },

  // ─── Categories ────────────────────────────────────────────────────────────
  getCategories(params?: any) {
    return adminGet<any[]>(`/api/admin/categories${toQueryString(params)}`)
  },
  getCategoryById(id: string) {
    return adminGet<any>(`/api/admin/categories/${id}`)
  },
  createCategory(payload: any) {
    return adminPost<any>('/api/admin/categories', payload)
  },
  updateCategory(id: string, payload: any) {
    return adminPatch<any>(`/api/admin/categories/${id}`, payload)
  },
  deleteCategory(id: string) {
    return adminDelete<any>(`/api/admin/categories/${id}`)
  },

  // ─── Brands ────────────────────────────────────────────────────────────────
  getBrands(params?: any) {
    return adminGet<any[]>(`/api/admin/brands${toQueryString(params)}`)
  },
  getBrandById(id: string) {
    return adminGet<any>(`/api/admin/brands/${id}`)
  },
  createBrand(payload: any) {
    return adminPost<any>('/api/admin/brands', payload)
  },
  updateBrand(id: string, payload: any) {
    return adminPatch<any>(`/api/admin/brands/${id}`, payload)
  },
  deleteBrand(id: string) {
    return adminDelete<any>(`/api/admin/brands/${id}`)
  },

  // ─── Products ──────────────────────────────────────────────────────────────
  getProducts(params?: any) {
    return adminGet<PaginatedResponse<any>>(`/api/admin/products${toQueryString(params)}`)
  },
  getProductById(id: string) {
    return adminGet<any>(`/api/admin/products/${id}`)
  },
  createProduct(payload: any) {
    return adminPost<any>('/api/admin/products', payload)
  },
  updateProduct(id: string, payload: any) {
    return adminPatch<any>(`/api/admin/products/${id}`, payload)
  },
  deleteProduct(id: string) {
    return adminDelete<any>(`/api/admin/products/${id}`)
  },

  // ─── Orders ────────────────────────────────────────────────────────────────
  getOrders(params?: any) {
    return adminGet<PaginatedResponse<any>>(`/api/admin/orders${toQueryString(params)}`)
  },
  getOrderById(id: string) {
    return adminGet<any>(`/api/admin/orders/${id}`)
  },
  createOrder(payload: any) {
    return adminPost<any>('/api/admin/orders', payload)
  },
  updateOrder(id: string, payload: any) {
    return adminPatch<any>(`/api/admin/orders/${id}`, payload)
  },
  deleteOrder(id: string) {
    return adminDelete<any>(`/api/admin/orders/${id}`)
  },

  // ─── Contacts ──────────────────────────────────────────────────────────────
  getContacts(params?: any) {
    return adminGet<PaginatedResponse<any>>(`/api/admin/contacts${toQueryString(params)}`)
  },
  getContactById(id: string) {
    return adminGet<any>(`/api/admin/contacts/${id}`)
  },
  updateContact(id: string, payload: any) {
    return adminPatch<any>(`/api/admin/contacts/${id}`, payload)
  },
  deleteContact(id: string) {
    return adminDelete<any>(`/api/admin/contacts/${id}`)
  },

  // ─── Quote Requests ────────────────────────────────────────────────────────
  getQuoteRequests(params?: any) {
    return adminGet<PaginatedResponse<any>>(`/api/admin/quote-requests${toQueryString(params)}`)
  },
  getQuoteRequestById(id: string) {
    return adminGet<any>(`/api/admin/quote-requests/${id}`)
  },
  updateQuoteRequest(id: string, payload: any) {
    return adminPatch<any>(`/api/admin/quote-requests/${id}`, payload)
  },
  deleteQuoteRequest(id: string) {
    return adminDelete<any>(`/api/admin/quote-requests/${id}`)
  },

  // ─── Posts ─────────────────────────────────────────────────────────────────
  getPosts(params?: any) {
    return adminGet<PaginatedResponse<any>>(`/api/admin/posts${toQueryString(params)}`)
  },
  getPostById(id: string) {
    return adminGet<any>(`/api/admin/posts/${id}`)
  },
  createPost(payload: any) {
    return adminPost<any>('/api/admin/posts', payload)
  },
  updatePost(id: string, payload: any) {
    return adminPatch<any>(`/api/admin/posts/${id}`, payload)
  },
  deletePost(id: string) {
    return adminDelete<any>(`/api/admin/posts/${id}`)
  },

  // ─── Post Categories ───────────────────────────────────────────────────────
  getPostCategories(params?: any) {
    return adminGet<any[]>(`/api/admin/post-categories${toQueryString(params)}`)
  },
  createPostCategory(payload: any) {
    return adminPost<any>('/api/admin/post-categories', payload)
  },

  // ─── Services ──────────────────────────────────────────────────────────────
  getServices(params?: any) {
    return adminGet<any[]>(`/api/admin/services${toQueryString(params)}`)
  },
  getServiceById(id: string) {
    return adminGet<any>(`/api/admin/services/${id}`)
  },
  createService(payload: any) {
    return adminPost<any>('/api/admin/services', payload)
  },
  updateService(id: string, payload: any) {
    return adminPatch<any>(`/api/admin/services/${id}`, payload)
  },
  deleteService(id: string) {
    return adminDelete<any>(`/api/admin/services/${id}`)
  },

  // ─── Settings ──────────────────────────────────────────────────────────────
  getSettings(params?: any) {
    return adminGet<any[]>(`/api/admin/settings${toQueryString(params)}`)
  },
  updateSettings(payload: any[]) {
    return adminPatch<any>('/api/admin/settings', payload)
  },
  getSetting(key: string) {
    return adminGet<any>(`/api/admin/settings/${key}`)
  },
  updateSetting(key: string, payload: any) {
    return adminPatch<any>(`/api/admin/settings/${key}`, payload)
  },
}
