// src/app/api/test-payment-service/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { testPaymentService, logPaymentServiceTest } from '@/lib/payment-service'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 开始测试支付服务...')
    
    // 获取用户IP用于日志记录
    const userIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
    
    // 测试支付服务状态
    const serviceStatus = await testPaymentService()
    
    // 记录测试结果
    await logPaymentServiceTest(serviceStatus, {
      userIp,
      userAgent: request.headers.get('user-agent'),
      endpoint: process.env.PAYMENT_TEST_ENDPOINT
    })
    
    // 返回结果
    if (serviceStatus.available) {
      return NextResponse.json({
        success: true,
        message: '支付服务可用',
        data: serviceStatus
      })
    } else {
      return NextResponse.json({
        success: false,
        message: '支付服务不可用',
        data: serviceStatus
      }, { status: 503 })
    }
  } catch (error) {
    console.error('❌ 支付服务测试API错误:', error)
    
    return NextResponse.json({
      success: false,
      message: '支付服务测试失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { endpoint, timeout, retryAttempts } = await request.json()
    
    // 自定义测试参数
    const serviceStatus = await testPaymentService({
      testEndpoint: endpoint,
      timeout: timeout || 10000,
      retryAttempts: retryAttempts || 2
    })
    
    return NextResponse.json({
      success: serviceStatus.available,
      message: serviceStatus.available ? '支付服务测试成功' : '支付服务测试失败',
      data: serviceStatus
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '自定义支付服务测试失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
