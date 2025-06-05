import { NextResponse } from 'next/server'

export async function POST() {
  // TODO: 后续集成支付 SDK
  return NextResponse.json({ message: 'Payment integration pending' }, { status: 501 })
}
