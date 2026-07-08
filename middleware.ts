import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminApiRoute = pathname.startsWith('/api/admin')

  if (isAdminRoute || isAdminApiRoute) {
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next()
    }

    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      if (isAdminApiRoute) {
        return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const userRole = session.user.role
    if (userRole !== 'ADMIN' && userRole !== 'EDITOR' && userRole !== 'STAFF') {
      if (isAdminApiRoute) {
        return NextResponse.json({ success: false, error: 'Không có quyền truy cập' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
