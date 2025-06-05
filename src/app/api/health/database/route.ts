import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/database'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const healthCheck = await checkDatabaseHealth()
    
    if (healthCheck.healthy) {
      // 获取数据库统计信息
      const stats = await Promise.all([
        prisma.donation.count(),
        prisma.paymentLog.count(),
        prisma.unlockToken.count(),
        prisma.userAnalytics.count(),
        prisma.systemConfig.count()
      ])

      return NextResponse.json({
        status: 'healthy',
        message: healthCheck.message,
        timestamp: new Date().toISOString(),
        database: {
          connected: true,
          tables: {
            donations: stats[0],
            paymentLogs: stats[1],
            unlockTokens: stats[2],
            userAnalytics: stats[3],
            systemConfigs: stats[4]
          }
        }
      })
    } else {
      return NextResponse.json({
        status: 'unhealthy',
        message: healthCheck.message,
        timestamp: new Date().toISOString(),
        database: {
          connected: false
        }
      }, { status: 503 })
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Database health check failed',
      timestamp: new Date().toISOString(),
      database: {
        connected: false
      }
    }, { status: 500 })
  }
}