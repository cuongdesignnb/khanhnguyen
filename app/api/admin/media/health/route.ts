import type { NextRequest } from 'next/server'
import * as api from '@/lib/api-response'
import { requireMediaRole } from '@/lib/media/media-auth'
import { scanMediaHealth } from '@/lib/media/media-health'

export async function GET(request: NextRequest) {
  const auth = await requireMediaRole(request, ['ADMIN'])
  if (auth.response) return auth.response
  try {
    return api.ok(await scanMediaHealth())
  } catch (error) {
    console.error('Media health read failed:', error)
    return api.serverError('Không thể kiểm tra tính toàn vẹn Media.')
  }
}

export const dynamic = 'force-dynamic'
