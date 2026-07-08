import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  let dbStatus = 'disconnected'
  try {
    await prisma.$queryRaw`SELECT 1`
    dbStatus = 'connected'
  } catch (error) {
    console.error('Health check DB error:', error)
  }

  return NextResponse.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  })
}
export const dynamic = 'force-dynamic'
