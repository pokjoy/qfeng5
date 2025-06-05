// src/lib/payment-service.ts
// 支付服务测试和管理模块

export interface PaymentServiceStatus {
  available: boolean
  responseTime: number
  error?: string
  statusCode?: number
  timestamp: string
}

export interface PaymentServiceConfig {
  testEndpoint: string
  apiKey?: string
  timeout: number
  retryAttempts: number
}

/**
 * 测试外部支付服务的可用性
 */
export async function testPaymentService(config?: Partial<PaymentServiceConfig>): Promise<PaymentServiceStatus> {
  const defaultConfig: PaymentServiceConfig = {
    testEndpoint: process.env.PAYMENT_TEST_ENDPOINT || 'https://httpbin.org/status/200',
    apiKey: process.env.PAYMENT_API_KEY,
    timeout: 10000, // 10秒超时
    retryAttempts: 2
  }

  const finalConfig = { ...defaultConfig, ...config }
  const startTime = Date.now()

  for (let attempt = 1; attempt <= finalConfig.retryAttempts; attempt++) {
    try {
      console.log(`🔍 测试支付服务 (尝试 ${attempt}/${finalConfig.retryAttempts})...`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout)

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'Pokjoy-Payment-Service-Test/1.0'
      }

      // 如果有API密钥，添加到请求头
      if (finalConfig.apiKey && finalConfig.apiKey !== 'mock_payment_key') {
        headers['Authorization'] = `Bearer ${finalConfig.apiKey}`
      }

      const response = await fetch(finalConfig.testEndpoint, {
        method: 'GET',
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const responseTime = Date.now() - startTime

      if (response.ok) {
        console.log(`✅ 支付服务测试成功 (${responseTime}ms)`)
        return {
          available: true,
          responseTime,
          statusCode: response.status,
          timestamp: new Date().toISOString()
        }
      } else {
        const errorText = await response.text().catch(() => 'Unknown error')
        console.log(`⚠️ 支付服务返回错误状态: ${response.status}`)
        
        if (attempt === finalConfig.retryAttempts) {
          return {
            available: false,
            responseTime,
            statusCode: response.status,
            error: `HTTP ${response.status}: ${errorText}`,
            timestamp: new Date().toISOString()
          }
        }
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      console.log(`❌ 支付服务测试失败 (尝试 ${attempt}): ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      if (attempt === finalConfig.retryAttempts) {
        return {
          available: false,
          responseTime,
          error: error instanceof Error ? error.message : 'Network error',
          timestamp: new Date().toISOString()
        }
      }
      
      // 重试前等待一小段时间
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // 这里理论上不会到达，但为了类型安全
  return {
    available: false,
    responseTime: Date.now() - startTime,
    error: 'All retry attempts failed',
    timestamp: new Date().toISOString()
  }
}

/**
 * 构建支付页面URL
 */
export function buildPaymentUrl(params: {
  orderId: string
  amount: number
  currency: string
  slug: string
  returnUrl: string
  cancelUrl: string
}): string {
  const baseUrl = process.env.EXTERNAL_PAYMENT_URL || 'https://httpbin.org/get'
  const url = new URL(baseUrl)
  
  // 添加基本参数
  url.searchParams.set('order_id', params.orderId)
  url.searchParams.set('amount', params.amount.toFixed(2))
  url.searchParams.set('currency', params.currency)
  url.searchParams.set('subject', `解锁内容：${params.slug}`)
  url.searchParams.set('return_url', params.returnUrl)
  url.searchParams.set('cancel_url', params.cancelUrl)
  url.searchParams.set('timestamp', Math.floor(Date.now() / 1000).toString())
  
  // 添加安全签名（如果配置了API密钥）
  const apiKey = process.env.PAYMENT_API_KEY
  if (apiKey && apiKey !== 'mock_payment_key') {
    const signature = generatePaymentSignature(url.searchParams, apiKey)
    url.searchParams.set('signature', signature)
  }
  
  return url.toString()
}

/**
 * 生成支付请求签名
 */
function generatePaymentSignature(params: URLSearchParams, apiKey: string): string {
  // 获取所有参数并排序
  const sortedParams = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  
  // 简单的签名算法（生产环境应使用更安全的HMAC）
  const signString = sortedParams + '&key=' + apiKey
  
  // 使用简单的哈希（生产环境建议使用crypto模块的HMAC）
  let hash = 0
  for (let i = 0; i < signString.length; i++) {
    const char = signString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为32位整数
  }
  
  return Math.abs(hash).toString(16)
}

/**
 * 验证支付回调签名
 */
export function verifyPaymentCallback(params: Record<string, string>, signature: string): boolean {
  const apiKey = process.env.PAYMENT_API_KEY
  if (!apiKey || apiKey === 'mock_payment_key') {
    return true // 开发模式跳过验证
  }
  
  const urlParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (key !== 'signature') {
      urlParams.set(key, value)
    }
  })
  
  const expectedSignature = generatePaymentSignature(urlParams, apiKey)
  return expectedSignature === signature
}

/**
 * 解析支付回调参数
 */
export interface PaymentCallbackData {
  orderId: string
  status: 'success' | 'failed' | 'cancelled' | 'pending'
  amount?: string
  currency?: string
  paymentMethod?: string
  transactionId?: string
  timestamp?: string
  message?: string
}

export function parsePaymentCallback(searchParams: URLSearchParams): PaymentCallbackData | null {
  const orderId = searchParams.get('order_id')
  const status = searchParams.get('status') as PaymentCallbackData['status']
  
  if (!orderId || !status) {
    return null
  }
  
  return {
    orderId,
    status,
    amount: searchParams.get('amount') || undefined,
    currency: searchParams.get('currency') || undefined,
    paymentMethod: searchParams.get('payment_method') || undefined,
    transactionId: searchParams.get('transaction_id') || undefined,
    timestamp: searchParams.get('timestamp') || undefined,
    message: searchParams.get('message') || undefined
  }
}

/**
 * 记录支付服务测试结果
 */
export async function logPaymentServiceTest(
  status: PaymentServiceStatus,
  context?: Record<string, unknown>
): Promise<void> {
  try {
    // 这里可以记录到数据库或日志文件
    console.log('💾 支付服务测试结果:', {
      timestamp: new Date().toISOString(),
      status,
      context
    })
  } catch (error) {
    console.error('记录支付服务测试结果失败:', error)
  }
}