import { ApiResponse } from '@/types/api'

export class ApiErrorResponse extends Error {
  status: number
  details?: any

  constructor(message: string, status: number, details?: any) {
    super(message)
    this.name = 'ApiErrorResponse'
    this.status = status
    this.details = details
  }
}

export async function adminFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {})

  // Set default content type to JSON if body is a plain object,
  // but do not set it for FormData
  const isFormData = options.body instanceof FormData
  if (!headers.has('Content-Type') && !isFormData && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  // Include credentials for Better Auth session cookie
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'same-origin',
  }

  try {
    const response = await fetch(url, fetchOptions)

    // Handle 401 Unauthorized by redirecting to login page on client side
    if (response.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/admin/login'
      throw new ApiErrorResponse('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401)
    }

    let result: ApiResponse<T>
    try {
      result = await response.json()
    } catch (e) {
      throw new ApiErrorResponse('Không thể đọc phản hồi từ máy chủ.', response.status)
    }

    if (!response.ok || !result.success) {
      const errorMsg = result.success === false ? result.error : 'Có lỗi xảy ra'
      const details = result.success === false ? result.details : undefined
      throw new ApiErrorResponse(errorMsg || `Lỗi hệ thống (${response.status})`, response.status, details)
    }

    return result.data
  } catch (error: any) {
    if (error instanceof ApiErrorResponse) {
      throw error
    }
    // Network errors or fetch failures
    throw new ApiErrorResponse(error.message || 'Không thể kết nối tới máy chủ.', 500)
  }
}

export async function adminGet<T>(url: string): Promise<T> {
  return adminFetch<T>(url, { method: 'GET' })
}

export async function adminPost<T>(url: string, body?: any): Promise<T> {
  return adminFetch<T>(url, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
}

export async function adminPatch<T>(url: string, body?: any): Promise<T> {
  return adminFetch<T>(url, {
    method: 'PATCH',
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
}

export async function adminDelete<T>(url: string): Promise<T> {
  return adminFetch<T>(url, { method: 'DELETE' })
}
