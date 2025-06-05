// src/app/api/create-donation/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateDonationOrderId } from '@/lib/order-id-generator'

export async function POST(request: NextRequest) {
  try {
    const { slug, amount, currency = 'CNY' } = await request.json()
    
    if (!slug || !amount || amount < 0.5 || amount > 9999) {
      return NextResponse.json({ 
        error: '无效的参数' 
      }, { status: 400 })
    }

    // 生成新格式的订单ID
    const orderId = generateDonationOrderId()
    const timestamp = Math.floor(Date.now() / 1000)

    // 这里简化处理，实际项目中应该存储到数据库
    console.log('创建赞赏订单:', { 
      orderId, 
      slug, 
      amount, 
      currency, 
      timestamp,
      orderIdFormat: '28位自定义格式'
    })

    // 构建支付页面URL参数
    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/donation/callback`
    const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/unlock?next=/work/${slug}`
    
    // 构建完整的支付URL
    const paymentBaseUrl = process.env.EXTERNAL_PAYMENT_URL || 'https://pay.example.com'
    const paymentUrl = new URL(paymentBaseUrl)
    
    // 添加参数
    paymentUrl.searchParams.set('order_id', orderId)
    paymentUrl.searchParams.set('amount', amount.toFixed(2))
    paymentUrl.searchParams.set('currency', currency)
    paymentUrl.searchParams.set('subject', `解锁内容：${slug}`)
    paymentUrl.searchParams.set('return_url', returnUrl)
    paymentUrl.searchParams.set('cancel_url', cancelUrl)
    paymentUrl.searchParams.set('timestamp', timestamp.toString())

    console.log('生成支付URL:', paymentUrl.toString())

    return NextResponse.json({ 
      success: true,
      orderId,
      currency,
      paymentUrl: paymentUrl.toString()
    })
  } catch (error) {
    console.error('Create donation error:', error)
    return NextResponse.json({ 
      error: '创建赞赏订单失败' 
    }, { status: 500 })
  }
}