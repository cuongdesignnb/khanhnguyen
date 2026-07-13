import prisma from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return Response.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('Database health check error:', error)
    return Response.json({ status: 'error', database: 'disconnected', timestamp: new Date().toISOString() }, { status: 503 })
  }
}

export const dynamic = 'force-dynamic'
