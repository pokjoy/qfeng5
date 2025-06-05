import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { testPaymentService, buildPaymentUrl } from '@/lib/payment-service'
import { DonationService, AnalyticsService } from '@/lib/database'
import { generateDonationOrderId } from '@/lib/order-id-generator'

// 获取用户真实IP
function getRealIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const connectionIP = request.headers.get('x-connecting-ip')
  
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIP) return realIP.trim()
  if (connectionIP) return connectionIP.trim()
  return '127.0.0.1'
}

// 简化的国家检测（复用现有的GeoIP逻辑）
async function getUserCountry(ip: string): Promise<string> {
  try {
    // 这里可以调用你现有的GeoIP检测API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-currency`, {
      headers: { 'x-forwarded-for': ip }
    })
    const data = await response.json()
    return data.country || 'CN'
  } catch {
    return 'CN'
  }
}

export async function POST(request: NextRequest) {
  let orderId: string | null = null
  
  try {
    const { slug, amount, currency = 'CNY' } = await request.json()
    
    // 1. 参数验证
    if (!slug || !amount || amount < 0.5 || amount > 9999) {
      return NextResponse.json({ 
        error: '无效的参数',
        details: '金额必须在0.5-9999之间'
      }, { status: 400 })
    }

    // 2. 生成订单ID
    orderId = generateDonationOrderId()
    console.log(`💰 开始创建赞赏订单: ${orderId}`)
    
    // 3. 获取用户信息
    const userIp = getRealIP(request)
    const userCountry = await getUserCountry(userIp)
    
    console.log(`👤 用户信息: IP=${userIp}, Country=${userCountry}`)

    // 4. 并行执行：测试支付服务状态
    console.log('🔍 测试支付服务状态...')
    const paymentServiceTest = testPaymentService()
    
    // 5. 构建回调URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const returnUrl = `${baseUrl}/donation/callback`
    const cancelUrl = `${baseUrl}/unlock?next=/work/${slug}`
    
    // 6. 等待支付服务测试结果
    const serviceStatus = await paymentServiceTest
    
    if (!serviceStatus.available) {
      console.log('❌ 支付服务不可用:', serviceStatus.error)
      return NextResponse.json({
        error: '支付服务暂时不可用，请稍后重试',
        details: serviceStatus.error,
        serviceStatus
      }, { status: 503 })
    }
    
    console.log(`✅ 支付服务可用 (${serviceStatus.responseTime}ms)`)

    // 7. 构建支付URL
    const paymentUrl = buildPaymentUrl({
      orderId,
      amount,
      currency,
      slug,
      returnUrl,
      cancelUrl
    })

    // 8. 存储订单到数据库
    console.log('💾 存储订单到数据库...')
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30分钟后过期
    
    // 使用正确的类型创建metadata
    const metadata = {
      paymentServiceResponseTime: serviceStatus.responseTime,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      serviceTestTimestamp: serviceStatus.timestamp,
      createdVia: 'donation-modal'
    }
    
    const donation = await DonationService.createDonation({
      orderId,
      slug,
      amount,
      currency,
      userIp,
      userCountry,
      paymentUrl,
      paymentProvider: 'external',
      expiresAt,
      metadata
    })

    console.log(`✅ 订单存储成功: ${donation.id}`)

    // 9. 校验存储是否成功
    console.log('🔍 校验订单存储...')
    const verifyOrder = await prisma.donation.findUnique({
      where: { orderId }
    })

    if (!verifyOrder) {
      throw new Error('订单存储校验失败')
    }
    
    console.log('✅ 订单存储校验通过')

    // 10. 记录用户行为分析
    try {
      const analyticsMetadata = {
        amount,
        currency,
        orderId,
        paymentServiceResponseTime: serviceStatus.responseTime
      }
      
      await AnalyticsService.recordUserAction({
        sessionId: request.headers.get('x-session-id') || 'unknown',
        userIp,
        action: 'create_donation_order',
        slug,
        userCountry,
        metadata: analyticsMetadata
      })
    } catch (analyticsError) {
      console.warn('⚠️ 记录分析数据失败:', analyticsError)
      // 不影响主流程
    }

    console.log(`🎉 订单创建完成: ${orderId}`)

    return NextResponse.json({ 
      success: true,
      orderId,
      currency,
      paymentUrl,
      expiresAt: expiresAt.toISOString(),
      serviceStatus: {
        available: serviceStatus.available,
        responseTime: serviceStatus.responseTime
      },
      steps: {
        paramValidation: true,
        serviceTest: true,
        orderCreation: true,
        storageValidation: true
      }
    })

  } catch (error) {
    console.error('❌ 创建赞赏订单失败:', error)
    
    // 记录错误日志到数据库
    if (orderId) {
      try {
        await DonationService.addPaymentLog(
          orderId,
          'create_order_error',
          'error',
          error instanceof Error ? error.message : 'Unknown error'
        )
      } catch (logError) {
        console.error('记录错误日志失败:', logError)
      }
    }
    
    return NextResponse.json({ 
      error: '创建赞赏订单失败',
      details: error instanceof Error ? error.message : 'Unknown error',
      orderId // 返回订单ID用于调试
    }, { status: 500 })
  }
}