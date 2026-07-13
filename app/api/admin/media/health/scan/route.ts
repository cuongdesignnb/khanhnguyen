import type { NextRequest } from 'next/server'
import * as api from '@/lib/api-response'
import { requireMediaRole } from '@/lib/media/media-auth'
import { scanMediaHealth } from '@/lib/media/media-health'

export async function POST(request: NextRequest) {
  const auth = await requireMediaRole(request, ['ADMIN'])
  if (auth.response) return auth.response
  try {
    return api.ok(await scanMediaHealth(), 'Đã quét database và Docker volume uploads.')
  } catch (error) {
    console.error('Media health scan failed:', error)
    return api.serverError('Không thể quét tính toàn vẹn Media.')
  }
}

export const dynamic = 'force-dynamic'
