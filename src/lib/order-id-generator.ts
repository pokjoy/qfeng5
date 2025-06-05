// src/lib/order-id-generator.ts
// 自定义订单号生成器

// 自定义字符集（排除易混淆字符：0, O, I, 1, l）
const CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

// 业务前缀定义
const BUSINESS_PREFIXES = {
  DONATION: 'DONA',  // 赞赏订单
  AD_UNLOCK: 'ADUN',  // 广告解锁
  CODE_UNLOCK: 'COUN', // 访问码解锁
  SUBSCRIPTION: 'SUBS', // 订阅服务（预留）
} as const

/**
 * 生成指定长度的随机字符串
 */
function generateRandomString(length: number): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += CHARSET[Math.floor(Math.random() * CHARSET.length)]
  }
  return result
}

/**
 * 计算校验位（使用Luhn算法变种）
 */
function calculateChecksum(input: string): string {
  let sum = 0
  let isEven = false
  
  // 从右到左遍历
  for (let i = input.length - 1; i >= 0; i--) {
    const char = input[i]
    let value = CHARSET.indexOf(char)
    
    if (value === -1) {
      // 如果字符不在字符集中，使用ASCII值
      value = char.charCodeAt(0) % CHARSET.length
    }
    
    if (isEven) {
      value *= 2
      if (value >= CHARSET.length) {
        value = Math.floor(value / CHARSET.length) + (value % CHARSET.length)
      }
    }
    
    sum += value
    isEven = !isEven
  }
  
  // 生成3位校验位
  const checksum = sum % (CHARSET.length * CHARSET.length * CHARSET.length)
  
  return [
    CHARSET[Math.floor(checksum / (CHARSET.length * CHARSET.length))],
    CHARSET[Math.floor((checksum % (CHARSET.length * CHARSET.length)) / CHARSET.length)],
    CHARSET[checksum % CHARSET.length]
  ].join('')
}

/**
 * 验证订单号校验位
 */
function validateOrderId(orderId: string): boolean {
  if (orderId.length !== 28) {
    return false
  }
  
  const prefix = orderId.substring(0, 4)
  const timestamp = orderId.substring(4, 13)
  const random = orderId.substring(13, 25)
  const checksum = orderId.substring(25, 28)
  
  const expectedChecksum = calculateChecksum(prefix + timestamp + random)
  return checksum === expectedChecksum
}

/**
 * 生成赞赏订单号
 */
export function generateDonationOrderId(): string {
  const prefix = BUSINESS_PREFIXES.DONATION
  
  // 9位时间戳（基于2024年1月1日的偏移，可用到2051年）
  const baseTime = new Date('2024-01-01').getTime()
  const currentTime = Date.now()
  const offset = Math.floor((currentTime - baseTime) / 1000) // 秒级精度
  
  // 转换为自定义字符集表示
  let timeStr = ''
  let remaining = offset
  for (let i = 0; i < 9; i++) {
    timeStr = CHARSET[remaining % CHARSET.length] + timeStr
    remaining = Math.floor(remaining / CHARSET.length)
  }
  
  // 12位随机字符
  const randomStr = generateRandomString(12)
  
  // 计算校验位
  const baseString = prefix + timeStr + randomStr
  const checksum = calculateChecksum(baseString)
  
  return baseString + checksum
}

/**
 * 生成其他类型订单号
 */
export function generateOrderId(type: keyof typeof BUSINESS_PREFIXES): string {
  const prefix = BUSINESS_PREFIXES[type]
  
  const baseTime = new Date('2024-01-01').getTime()
  const currentTime = Date.now()
  const offset = Math.floor((currentTime - baseTime) / 1000)
  
  let timeStr = ''
  let remaining = offset
  for (let i = 0; i < 9; i++) {
    timeStr = CHARSET[remaining % CHARSET.length] + timeStr
    remaining = Math.floor(remaining / CHARSET.length)
  }
  
  const randomStr = generateRandomString(12)
  const baseString = prefix + timeStr + randomStr
  const checksum = calculateChecksum(baseString)
  
  return baseString + checksum
}

/**
 * 解析订单号信息
 */
export function parseOrderId(orderId: string) {
  if (!validateOrderId(orderId)) {
    throw new Error('Invalid order ID format or checksum')
  }
  
  const prefix = orderId.substring(0, 4)
  const timeStr = orderId.substring(4, 13)
  const randomStr = orderId.substring(13, 25)
  const checksum = orderId.substring(25, 28)
  
  // 解析时间戳
  let timeValue = 0
  for (let i = 0; i < timeStr.length; i++) {
    timeValue = timeValue * CHARSET.length + CHARSET.indexOf(timeStr[i])
  }
  
  const baseTime = new Date('2024-01-01').getTime()
  const timestamp = baseTime + timeValue * 1000
  
  // 确定业务类型
  let businessType = 'UNKNOWN'
  for (const [key, value] of Object.entries(BUSINESS_PREFIXES)) {
    if (value === prefix) {
      businessType = key
      break
    }
  }
  
  return {
    prefix,
    businessType,
    timestamp: new Date(timestamp),
    randomPart: randomStr,
    checksum,
    isValid: true
  }
}

/**
 * 从货币获取适当的订单类型（兼容旧版本）
 */
export function getOrderTypeFromCurrency(): keyof typeof BUSINESS_PREFIXES {
  // 所有货币的赞赏订单都使用 DONATION 类型
  return 'DONATION'
}

// 导出工具函数
export { validateOrderId, BUSINESS_PREFIXES, CHARSET }