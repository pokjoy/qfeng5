const { testPaymentService } = require('./src/lib/payment-service.ts')

async function test() {
  console.log('🧪 测试支付服务模块...')
  
  try {
    const result = await testPaymentService()
    console.log('✅ 测试结果:', result)
  } catch (error) {
    console.error('❌ 测试失败:', error)
  }
}

test()
