import { NextRequest, NextResponse } from 'next/server'
import { DonationService } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()
    
    if (!orderId) {
      return NextResponse.json({ 
        success: false, 
        message: '缺少订单ID' 
      }, { status: 400 })
    }

    // 从数据库查询订单状态
    const donation = await DonationService.getDonationByOrderId(orderId)
    
    if (!donation) {
      return NextResponse.json({ 
        success: false, 
        message: '订单不存在' 
      }, { status: 404 })
    }

    // 根据订单状态返回结果
    if (donation.status === 'paid') {
      return NextResponse.json({ 
        success: true, 
        status: 'paid',
        redirectTo: `/work/${donation.slug}`,
        message: '支付成功' 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        status: donation.status,
        message: `订单状态: ${donation.status}` 
      })
    }
  } catch (error) {
    console.error('Check donation status error:', error)
    return NextResponse.json({ 
      success: false, 
      message: '查询订单状态失败' 
    }, { status: 500 })
  }
}