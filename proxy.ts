import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from '@/lib/prisma'

export async function proxy(request: NextRequest) {
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

  if (!isAdminRoute && !pathname.startsWith('/api')) {
    try {
      const redirect = await prisma.seoRedirect.findFirst({ where: { sourcePath: pathname, isActive: true } })
      if (redirect && redirect.targetPath !== pathname) {
        await prisma.seoRedirect.update({ where: { id: redirect.id }, data: { hitCount: { increment: 1 } } })
        return NextResponse.redirect(new URL(redirect.targetPath, request.url), redirect.statusCode)
      }
    } catch (error) {
      console.error('SEO redirect lookup failed:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  if (isAdminRoute || isAdminApiRoute) {
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next()
    }

    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    let session = null
    try {
      session = await auth.api.getSession({ headers: request.headers })
    } catch (e) {
      console.error('Middleware session check failed:', e instanceof Error ? e.message : 'Unknown error')
    }

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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
