// src/lib/user-agent.ts
// User-Agent 解析工具

export interface UserAgentInfo {
  isMobile: boolean
  isDesktop: boolean
  isTablet: boolean
  browser: string
  os: string
  device: string
  isWechat: boolean
  isAlipay: boolean
  isBot: boolean
  raw: string
}

/**
 * 解析 User-Agent 字符串
 */
export function parseUserAgent(userAgent: string | null): UserAgentInfo {
  const ua = userAgent || ''
  
  // 移动设备检测
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(ua)
  const isDesktop = !isMobile && !isTablet
  
  // 浏览器检测
  let browser = 'Unknown'
  if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Edge')) browser = 'Edge'
  else if (ua.includes('Opera')) browser = 'Opera'
  
  // 操作系统检测
  let os = 'Unknown'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  
  // 设备类型
  let device = 'Unknown'
  if (isMobile) {
    if (ua.includes('iPhone')) device = 'iPhone'
    else if (ua.includes('Android')) device = 'Android Phone'
    else device = 'Mobile'
  } else if (isTablet) {
    if (ua.includes('iPad')) device = 'iPad'
    else device = 'Tablet'
  } else {
    device = 'Desktop'
  }
  
  // 特殊环境检测
  const isWechat = ua.includes('MicroMessenger')
  const isAlipay = ua.includes('AlipayClient')
  const isBot = /bot|crawler|spider|crawling/i.test(ua)
  
  return {
    isMobile,
    isDesktop,
    isTablet,
    browser,
    os,
    device,
    isWechat,
    isAlipay,
    isBot,
    raw: ua
  }
}

/**
 * 生成用户设备的简短描述
 */
export function getUserDeviceDescription(userAgent: string | null): string {
  const info = parseUserAgent(userAgent)
  
  if (info.isBot) return 'Bot/Crawler'
  if (info.isWechat) return `微信内 ${info.device}`
  if (info.isAlipay) return `支付宝内 ${info.device}`
  
  return `${info.device} ${info.browser}/${info.os}`
}

/**
 * 检查是否为支付友好的环境
 */
export function isPaymentFriendlyEnvironment(userAgent: string | null): {
  suitable: boolean
  reason?: string
  recommendations?: string[]
} {
  const info = parseUserAgent(userAgent)
  
  if (info.isBot) {
    return {
      suitable: false,
      reason: '检测到爬虫/机器人访问',
      recommendations: ['请使用正常浏览器访问']
    }
  }
  
  if (info.isWechat) {
    return {
      suitable: true,
      reason: '微信内置浏览器环境，支持微信支付',
      recommendations: ['推荐使用微信支付', '可能需要授权登录']
    }
  }
  
  if (info.isAlipay) {
    return {
      suitable: true,
      reason: '支付宝内置浏览器环境，支持支付宝支付',
      recommendations: ['推荐使用支付宝支付']
    }
  }
  
  if (info.isMobile) {
    return {
      suitable: true,
      reason: '移动设备环境，支持多种支付方式',
      recommendations: ['支持微信支付、支付宝、Apple Pay等']
    }
  }
  
  return {
    suitable: true,
    reason: '桌面浏览器环境',
    recommendations: ['支持银行卡支付、PayPal等']
  }
}

/**
 * 获取推荐的支付方式
 */
export function getRecommendedPaymentMethods(userAgent: string | null): string[] {
  const info = parseUserAgent(userAgent)
  
  if (info.isWechat) return ['wechat', 'card']
  if (info.isAlipay) return ['alipay', 'card']
  if (info.isMobile && info.os === 'iOS') return ['apple_pay', 'card', 'wechat', 'alipay']
  if (info.isMobile && info.os === 'Android') return ['google_pay', 'card', 'wechat', 'alipay']
  if (info.isDesktop) return ['card', 'paypal', 'wechat', 'alipay']
  
  return ['card'] // 默认支持银行卡
}
