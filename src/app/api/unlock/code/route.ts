import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const VALID_CODES = (process.env.CODE_LIST || '').split(',')

export async function POST(req: Request) {
  const { code } = await req.json()
  if (!VALID_CODES.includes(code)) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }
  const token = await new SignJWT({ unlocked: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(JWT_SECRET)

  const res = NextResponse.json({ success: true })
  res.cookies.set('unlock_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  return res
}
