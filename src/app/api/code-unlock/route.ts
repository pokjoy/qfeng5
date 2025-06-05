// src/app/api/code-unlock/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/lib/jwt'

function isValidCode(input: string): boolean {
  const env = process.env.ACCESS_CODE
  return input === env
}

export async function POST(request: NextRequest) {
  const { code, slug } = await request.json()
  
  if (!slug) {
    return NextResponse.json({ success: false, message: '缺少 slug' }, { status: 400 })
  }
  
  if (!isValidCode(code)) {
    return NextResponse.json({ success: false, message: '访问码错误' }, { status: 401 })
  }
  
  const exp = Number(process.env.CODE_UNLOCK_EXP)
  const token = await signToken({ type: 'code', slug, exp })
  const res = NextResponse.json({ success: true, redirectTo: `/work/${slug}` })
  
  res.cookies.set({
    name: process.env.COOKIE_NAME!,
    value: token,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: exp,
    sameSite: 'lax',
  })
  
  return res
}
