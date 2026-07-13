import { NextResponse } from 'next/server'

export function ok<T>(data: T, message?: string) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: 200 }
  )
}

export function created<T>(data: T, message?: string) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: 201 }
  )
}

export function badRequest(error: string, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details !== undefined && { details }),
    },
    { status: 400 }
  )
}

export function unauthorized(error = 'Chưa đăng nhập') {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status: 401 }
  )
}

export function forbidden(error = 'Không có quyền truy cập') {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status: 403 }
  )
}

export function notFound(error = 'Không tìm thấy tài nguyên') {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status: 404 }
  )
}

export function conflict(error: string, details?: unknown) {
  return NextResponse.json(
    { success: false, error, ...(details !== undefined && { details }) },
    { status: 409 }
  )
}

export function payloadTooLarge(error: string) {
  return NextResponse.json({ success: false, error }, { status: 413 })
}

export function serverError(error = 'Lỗi hệ thống') {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status: 500 }
  )
}
