import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function requireAdminSession(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, error: 'Chưa đăng nhập' },
        { status: 401 }
      ),
    }
  }

  const role = (session.user as any).role

  if (!['ADMIN', 'EDITOR', 'STAFF'].includes(role)) {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      ),
    }
  }

  return {
    session,
    response: null,
  }
}
