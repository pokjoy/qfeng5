// src/app/api/get-currency/route.ts
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

// 货币配置类型定义
interface CurrencyConfig {
  currency: string
  symbol: string
  amounts: number[]
  descriptions: string[]
}

// 地区货币配置
const REGION_CURRENCY_CONFIG: Record<string, CurrencyConfig | string> = {
  CN: {
    currency: 'CNY',
    symbol: '¥',
    amounts: [9.9, 19.9, 49.9, 99.9],
    descriptions: ['一杯咖啡☕', '一份午餐🍜', '支持创作💪', '深度支持🎯']
  },
  US: {
    currency: 'USD', 
    symbol: '$',
    amounts: [1.99, 4.99, 9.99, 19.99],
    descriptions: ['咖啡☕', '午餐🍜', '支持💪', '深度支持🎯']
  },
  JP: {
    currency: 'JPY',
    symbol: '¥',
    amounts: [200, 500, 1000, 2000], 
    descriptions: ['咖啡☕', '午餐🍜', '支持💪', '深度支持🎯']
  },
  GB: {
    currency: 'GBP',
    symbol: '£',
    amounts: [1.99, 3.99, 7.99, 15.99],
    descriptions: ['咖啡☕', '午餐🍜', '支持💪', '深度支持🎯']
  },
  HK: {
    currency: 'HKD', 
    symbol: 'HK$',
    amounts: [15, 30, 75, 150],
    descriptions: ['咖啡☕', '午餐🍜', '支持💪', '深度支持🎯']
  },
  SG: {
    currency: 'SGD',
    symbol: 'S$', 
    amounts: [2.99, 6.99, 13.99, 27.99],
    descriptions: ['咖啡☕', '午餐🍜', '支持💪', '深度支持🎯']
  },
  AU: {
    currency: 'AUD',
    symbol: 'A$',
    amounts: [2.99, 6.99, 13.99, 27.99], 
    descriptions: ['咖啡☕', '午餐🍜', '支持💪', '深度支持🎯']
  },
  CA: {
    currency: 'CAD',
    symbol: 'C$',
    amounts: [2.99, 6.99, 13.99, 27.99],
    descriptions: ['咖啡☕', '午餐🍜', '支持💪', '深度支持🎯']
  },
  // 欧盟国家映射
  DE: 'EU',
  FR: 'EU', 
  IT: 'EU', 
  ES: 'EU', 
  NL: 'EU', 
  BE: 'EU',
  EU: {
    currency: 'EUR',
    symbol: '€', 
    amounts: [1.99, 4.99, 9.99, 19.99],
    descriptions: ['咖啡☕', '午餐🍜', '支持💪', '深度支持🎯']
  }
}

// 默认配置
const DEFAULT_CONFIG: CurrencyConfig = {
  currency: 'CNY',
  symbol: '¥',
  amounts: [9.9, 19.9, 49.9, 99.9],
  descriptions: ['一杯咖啡☕', '一份午餐🍜', '支持创作💪', '深度支持🎯']
}

// 获取真实IP地址
function getRealIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const connectionIP = request.headers.get('x-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP.trim()
  }
  
  if (connectionIP) {
    return connectionIP.trim()
  }
  
  return '127.0.0.1'
}

// 使用GeoIP数据库查询国家代码
async function getCountryFromIP(ip: string): Promise<string> {
  try {
    // 检查是否为本地IP
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return 'CN'
    }

    // 动态导入MaxMind库
    const { Reader } = await import('@maxmind/geoip2-node')
    const dbPath = path.join(process.cwd(), 'src', 'data', 'geoip', 'GeoLite2-Country.mmdb')
    
    // 检查数据库文件是否存在
    if (!fs.existsSync(dbPath)) {
      console.warn('GeoIP数据库文件不存在:', dbPath)
      return 'CN'
    }

    // 打开数据库并查询
    const reader = await Reader.open(dbPath)
    const result = reader.country(ip)
    
    const countryCode = result.country?.isoCode
    console.log('IP地理查询结果:', { ip, country: countryCode })
    
    return countryCode || 'CN'
  } catch (error) {
    console.error('GeoIP查询失败:', error)
    return 'CN'
  }
}

// 使用Accept-Language推断地区（降级方案）
function fallbackDetection(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') || ''
  
  if (acceptLanguage.includes('zh-CN') || acceptLanguage.includes('zh-Hans')) {
    return 'CN'
  }
  if (acceptLanguage.includes('zh-TW') || acceptLanguage.includes('zh-Hant')) {
    return 'HK'
  }
  if (acceptLanguage.includes('en-US')) {
    return 'US'
  }
  if (acceptLanguage.includes('en-GB')) {
    return 'GB'
  }
  if (acceptLanguage.includes('ja')) {
    return 'JP'
  }
  if (acceptLanguage.includes('de')) {
    return 'DE'
  }
  if (acceptLanguage.includes('fr')) {
    return 'FR'
  }
  
  return 'CN'
}

// 根据国家代码获取货币配置
function getCurrencyConfig(countryCode: string): CurrencyConfig & { country: string } {
  let config = REGION_CURRENCY_CONFIG[countryCode]
  
  // 如果是欧盟国家的映射，获取实际的EU配置
  if (typeof config === 'string') {
    config = REGION_CURRENCY_CONFIG[config]
  }
  
  // 如果没有找到配置或配置是字符串，使用默认配置
  if (!config || typeof config === 'string') {
    config = DEFAULT_CONFIG
  }
  
  return {
    country: countryCode,
    ...(config as CurrencyConfig)
  }
}

// GET 方法：自动检测用户IP并返回货币配置
export async function GET(request: NextRequest) {
  try {
    // 获取真实IP地址
    const clientIP = getRealIP(request)
    console.log('检测到用户IP:', clientIP)
    
    let countryCode: string
    
    try {
      // 使用GeoIP数据库查询
      countryCode = await getCountryFromIP(clientIP)
    } catch (error) {
      console.warn('GeoIP查询失败，使用降级方案:', error)
      // 使用降级检测方案
      countryCode = fallbackDetection(request)
    }
    
    // 获取对应的货币配置
    const currencyConfig = getCurrencyConfig(countryCode)
    
    console.log('货币配置结果:', currencyConfig)
    
    return NextResponse.json({
      success: true,
      ip: clientIP,
      ...currencyConfig
    })
  } catch (error) {
    console.error('获取货币配置失败:', error)
    
    // 返回默认配置
    return NextResponse.json({
      success: true,
      ip: 'unknown',
      country: 'CN',
      ...DEFAULT_CONFIG
    })
  }
}

// POST 方法：用于测试指定IP的地理位置检测
export async function POST(request: NextRequest) {
  try {
    const { testIP } = await request.json()
    
    if (!testIP) {
      return NextResponse.json({ 
        error: '缺少testIP参数' 
      }, { status: 400 })
    }
    
    const countryCode = await getCountryFromIP(testIP)
    const currencyConfig = getCurrencyConfig(countryCode)
    
    return NextResponse.json({
      success: true,
      ip: testIP,
      ...currencyConfig
    })
  } catch (error) {
    console.error('测试IP检测失败:', error)
    return NextResponse.json({ 
      error: '检测失败' 
    }, { status: 500 })
  }
}