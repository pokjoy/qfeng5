import { NextRequest, NextResponse } from 'next/server'
import { DonationService, TokenService, ConfigService } from '@/lib/database'

// 验证cron请求的安全性
function validateCronRequest(request: NextRequest): boolean {
  // 检查请求头中的授权信息
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'default-secret'
  
  return authHeader === `Bearer ${cronSecret}`
}

export async function POST(request: NextRequest) {
  try {
    // 验证请求权限
    if (!validateCronRequest(request)) {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    // 检查是否启用自动清理
    const cleanupEnabled = await ConfigService.getConfig('cleanup.auto_enabled')
    if (!cleanupEnabled) {
      return NextResponse.json({
        message: 'Auto cleanup is disabled',
        timestamp: new Date().toISOString()
      })
    }

    console.log('🧹 开始执行定时清理任务...')
    const startTime = Date.now()
    
    // 并行执行清理任务
    const [expiredOrders, expiredTokens] = await Promise.all([
      DonationService.cleanupExpiredOrders(),
      TokenService.cleanupExpiredTokens()
    ])

    const executionTime = Date.now() - startTime

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      results: {
        expiredOrdersCleaned: expiredOrders,
        expiredTokensCleaned: expiredTokens
      }
    }

    console.log('✅ 定时清理任务完成:', result)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ 定时清理任务失败:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Cleanup failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// GET方法用于手动触发清理（仅开发环境）
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ 
      error: 'Manual cleanup only allowed in development' 
    }, { status: 403 })
  }

  // 手动清理逻辑与POST相同
  return POST(request)
}
