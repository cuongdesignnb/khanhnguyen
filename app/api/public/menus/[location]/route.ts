import { getMenuByLocation } from '@/lib/menu'
export async function GET(_request: Request, { params }: { params: Promise<{ location: string }> }) {
  const location = (await params).location.toUpperCase()
  if (!['HEADER','FOOTER','MOBILE'].includes(location)) return Response.json({ success: false, error: 'Vị trí menu không hợp lệ' }, { status: 404 })
  return Response.json({ success: true, data: await getMenuByLocation(location as 'HEADER'|'FOOTER'|'MOBILE') })
}
export const dynamic = 'force-dynamic'
