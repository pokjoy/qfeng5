import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始初始化数据库...')

  // 1. 清理现有数据（开发环境）
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 清理开发环境数据...')
    await prisma.paymentLog.deleteMany()
    await prisma.donation.deleteMany()
    await prisma.unlockToken.deleteMany()
    await prisma.userAnalytics.deleteMany()
  }

  // 2. 初始化系统配置
  console.log('⚙️ 初始化系统配置...')
  
  const configs = [
    {
      key: 'payment.enabled',
      value: 'true',
      type: 'boolean',
      category: 'payment',
      description: '是否启用支付功能'
    },
    {
      key: 'payment.test_mode',
      value: 'true',
      type: 'boolean',
      category: 'payment',
      description: '是否为测试模式'
    },
    {
      key: 'unlock.ad_duration',
      value: '3600',
      type: 'number',
      category: 'unlock',
      description: '广告解锁时长（秒）'
    },
    {
      key: 'unlock.code_duration',
      value: '3600',
      type: 'number',
      category: 'unlock',
      description: '访问码解锁时长（秒）'
    },
    {
      key: 'unlock.donation_duration',
      value: '2592000',
      type: 'number',
      category: 'unlock',
      description: '赞赏解锁时长（秒）'
    },
    {
      key: 'order.expiry_minutes',
      value: '30',
      type: 'number',
      category: 'payment',
      description: '订单过期时间（分钟）'
    },
    {
      key: 'currency.supported',
      value: JSON.stringify(['CNY', 'USD', 'EUR', 'GBP', 'JPY', 'HKD', 'SGD', 'AUD', 'CAD']),
      type: 'json',
      category: 'payment',
      description: '支持的货币列表'
    },
    {
      key: 'analytics.enabled',
      value: 'true',
      type: 'boolean',
      category: 'system',
      description: '是否启用用户行为分析'
    },
    {
      key: 'cleanup.auto_enabled',
      value: 'true',
      type: 'boolean',
      category: 'system',
      description: '是否启用自动清理过期数据'
    },
    {
      key: 'site.name',
      value: 'Qfeng5 Portfolio',
      type: 'string',
      category: 'system',
      description: '网站名称'
    }
  ]

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: config,
      create: config
    })
  }

  // 3. 创建测试数据（仅开发环境）
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 创建测试数据...')
    
    // 创建一些测试订单
    const testOrders = [
      {
        orderId: 'test_order_001',
        slug: 'internup',
        amount: 19.9,
        currency: 'CNY',
        status: 'paid',
        userIp: '127.0.0.1',
        userCountry: 'CN',
        paymentProvider: 'test',
        paymentMethod: 'alipay',
        paidAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        metadata: {
          test: true,
          description: '测试订单 - 已支付'
        }
      },
      {
        orderId: 'test_order_002',
        slug: 'snowoverflow',
        amount: 9.9,
        currency: 'CNY',
        status: 'pending',
        userIp: '127.0.0.1',
        userCountry: 'CN',
        paymentProvider: 'test',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        metadata: {
          test: true,
          description: '测试订单 - 待支付'
        }
      },
      {
        orderId: 'test_order_003',
        slug: 'internup',
        amount: 4.99,
        currency: 'USD',
        status: 'expired',
        userIp: '8.8.8.8',
        userCountry: 'US',
        paymentProvider: 'test',
        expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1小时前过期
        metadata: {
          test: true,
          description: '测试订单 - 已过期'
        }
      }
    ]

    for (const order of testOrders) {
      const donation = await prisma.donation.create({
        data: order
      })

      // 为每个订单创建一些日志
      await prisma.paymentLog.createMany({
        data: [
          {
            orderId: order.orderId,
            action: 'create_order',
            status: 'success',
            message: '测试订单创建成功',
            metadata: { test: true }
          },
          ...(order.status === 'paid' ? [{
            orderId: order.orderId,
            action: 'payment_success',
            status: 'success',
            message: '测试支付成功',
            metadata: { test: true, transactionId: `test_txn_${Date.now()}` }
          }] : []),
          ...(order.status === 'expired' ? [{
            orderId: order.orderId,
            action: 'order_expired',
            status: 'info',
            message: '测试订单已过期',
            metadata: { test: true }
          }] : [])
        ]
      })
    }

    // 创建一些测试分析数据
    const testAnalytics = [
      {
        sessionId: 'test_session_001',
        userIp: '127.0.0.1',
        userCountry: 'CN',
        action: 'visit_unlock_page',
        slug: 'internup',
        metadata: { test: true }
      },
      {
        sessionId: 'test_session_001',
        userIp: '127.0.0.1',
        userCountry: 'CN',
        action: 'select_payment_method',
        slug: 'internup',
        metadata: { test: true, method: 'donation' }
      },
      {
        sessionId: 'test_session_002',
        userIp: '8.8.8.8',
        userCountry: 'US',
        action: 'visit_unlock_page',
        slug: 'snowoverflow',
        metadata: { test: true }
      }
    ]

    await prisma.userAnalytics.createMany({
      data: testAnalytics
    })

    console.log('✅ 测试数据创建完成')
  }

  console.log('🎉 数据库初始化完成！')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ 数据库初始化失败:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
