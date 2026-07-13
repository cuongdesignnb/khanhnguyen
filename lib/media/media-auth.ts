import type { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import * as api from '@/lib/api-response'

type MediaRole = 'ADMIN' | 'EDITOR'

export async function requireMediaRole(request: NextRequest, roles: MediaRole[]) {
  const auth = await requireAdminSession(request)
  if (auth.response) return { session: null, response: auth.response }
  const role = (auth.session?.user as { role?: string } | undefined)?.role
  if (!role || !roles.includes(role as MediaRole)) {
    return { session: null, response: api.forbidden('Bạn không có quyền thực hiện thao tác Media này.') }
  }
  return { session: auth.session, response: null }
}
