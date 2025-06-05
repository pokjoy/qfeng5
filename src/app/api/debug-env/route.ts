// src/app/api/debug-env/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    COOKIE_NAME: process.env.COOKIE_NAME || '未设置',
    ACCESS_CODE: process.env.ACCESS_CODE ? '已设置' : '未设置',
    JWT_SECRET: process.env.JWT_SECRET ? '已设置' : '未设置',
    CODE_UNLOCK_EXP: process.env.CODE_UNLOCK_EXP || '未设置',
    NODE_ENV: process.env.NODE_ENV,
    // 显示实际值用于调试（生产环境不要这样做）
    actual_COOKIE_NAME: process.env.COOKIE_NAME,
    actual_ACCESS_CODE: process.env.ACCESS_CODE,
    actual_CODE_UNLOCK_EXP: process.env.CODE_UNLOCK_EXP,
  })
}
