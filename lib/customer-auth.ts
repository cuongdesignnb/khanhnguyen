import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function requireCustomerSession(request: NextRequest) {
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

  return {
    session,
    response: null,
  }
}
