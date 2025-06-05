import { prisma } from './prisma'
import { Prisma } from '@prisma/client'

// 订单相关操作
export class DonationService {
  
  // 创建新订单 - 使用Prisma原生类型
  static async createDonation(data: Prisma.DonationCreateInput) {
    try {
      const donation = await prisma.donation.create({
        data,
        include: {
          paymentLogs: true
        }
      })

      // 记录创建日志 - 不传递复杂对象，避免类型问题
      await this.addPaymentLog(
        data.orderId, 
        'create_order', 
        'success', 
        '订单创建成功'
      )

      return donation
    } catch (error) {
      // 记录错误日志
      await this.addPaymentLog(
        data.orderId, 
        'create_order', 
        'error', 
        error instanceof Error ? error.message : 'Unknown error'
      ).catch(console.error)
      
      throw error
    }
  }

  // 更新订单状态
  static async updateDonationStatus(
    orderId: string,
    data: Prisma.DonationUpdateInput
  ) {
    try {
      const donation = await prisma.donation.update({
        where: { orderId },
        data: {
          ...data,
          updatedAt: new Date()
        },
        include: {
          paymentLogs: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })

      // 记录状态更新日志
      await this.addPaymentLog(
        orderId, 
        'status_update', 
        'success', 
        `订单状态更新`
      )

      return donation
    } catch (error) {
      await this.addPaymentLog(
        orderId, 
        'status_update', 
        'error',
        error instanceof Error ? error.message : 'Unknown error'
      ).catch(console.error)
      
      throw error
    }
  }

  // 根据订单ID查询订单
  static async getDonationByOrderId(orderId: string) {
    return await prisma.donation.findUnique({
      where: { orderId },
      include: {
        paymentLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    })
  }

  // 查询用户的订单历史
  static async getDonationsByUserIp(userIp: string, limit: number = 10) {
    return await prisma.donation.findMany({
      where: { userIp },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        paymentLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })
  }

  // 查询指定项目的赞赏统计
  static async getDonationStats(slug: string) {
    const stats = await prisma.donation.aggregate({
      where: { 
        slug,
        status: 'paid'
      },
      _count: { id: true },
      _sum: { amount: true },
      _avg: { amount: true }
    })

    const currencyStats = await prisma.donation.groupBy({
      by: ['currency'],
      where: {
        slug,
        status: 'paid'
      },
      _count: { id: true },
      _sum: { amount: true }
    })

    return {
      totalDonations: stats._count.id || 0,
      totalAmount: stats._sum.amount || 0,
      averageAmount: stats._avg.amount || 0,
      currencyBreakdown: currencyStats
    }
  }

  // 清理过期订单
  static async cleanupExpiredOrders() {
    const expiredOrders = await prisma.donation.updateMany({
      where: {
        status: 'pending',
        expiresAt: {
          lt: new Date()
        }
      },
      data: {
        status: 'expired',
        updatedAt: new Date()
      }
    })

    console.log(`已清理 ${expiredOrders.count} 个过期订单`)
    return expiredOrders.count
  }

  // 添加支付日志 - 最简化版本
  static async addPaymentLog(
    orderId: string, 
    action: string, 
    status: string, 
    message?: string
  ) {
    return await prisma.paymentLog.create({
      data: {
        orderId,
        action,
        status,
        message
        // 不设置 metadata 字段，让 Prisma 使用默认值
      }
    })
  }
}

// Token相关操作
export class TokenService {
  
  // 记录生成的token
  static async recordToken(data: Prisma.UnlockTokenCreateInput) {
    return await prisma.unlockToken.create({
      data
    })
  }

  // 记录token使用
  static async recordTokenUsage(tokenId: string) {
    return await prisma.unlockToken.update({
      where: { tokenId },
      data: {
        lastUsedAt: new Date()
      }
    })
  }

  // 撤销token
  static async revokeToken(tokenId: string) {
    return await prisma.unlockToken.update({
      where: { tokenId },
      data: {
        revokedAt: new Date()
      }
    })
  }

  // 清理过期token
  static async cleanupExpiredTokens() {
    const deletedTokens = await prisma.unlockToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })

    console.log(`已清理 ${deletedTokens.count} 个过期token`)
    return deletedTokens.count
  }
}

// 分析相关操作
export class AnalyticsService {
  
  // 记录用户行为
  static async recordUserAction(data: Prisma.UserAnalyticsCreateInput) {
    return await prisma.userAnalytics.create({
      data
    })
  }

  // 获取项目访问统计
  static async getProjectStats(slug: string, days: number = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    const visits = await prisma.userAnalytics.count({
      where: {
        slug,
        action: 'visit_unlock_page',
        createdAt: { gte: since }
      }
    })

    const unlockAttempts = await prisma.userAnalytics.count({
      where: {
        slug,
        action: { in: ['select_payment_method', 'attempt_unlock'] },
        createdAt: { gte: since }
      }
    })

    const successfulUnlocks = await prisma.donation.count({
      where: {
        slug,
        status: 'paid',
        createdAt: { gte: since }
      }
    })

    return {
      visits,
      unlockAttempts,
      successfulUnlocks,
      conversionRate: visits > 0 ? (successfulUnlocks / visits * 100).toFixed(2) : '0.00'
    }
  }
}

// 系统配置操作
export class ConfigService {
  
  // 获取配置
  static async getConfig(key: string) {
    const config = await prisma.systemConfig.findUnique({
      where: { key }
    })
    
    if (!config) return null
    
    // 根据类型解析值
    switch (config.type) {
      case 'number':
        return parseFloat(config.value)
      case 'boolean':
        return config.value === 'true'
      case 'json':
        return JSON.parse(config.value)
      default:
        return config.value
    }
  }

  // 设置配置
  static async setConfig(
    key: string, 
    value: string | number | boolean | object, 
    type: string = 'string',
    category: string = 'system',
    description?: string,
    updatedBy?: string
  ) {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    
    return await prisma.systemConfig.upsert({
      where: { key },
      update: {
        value: stringValue,
        type,
        category,
        description,
        updatedBy,
        updatedAt: new Date()
      },
      create: {
        key,
        value: stringValue,
        type,
        category,
        description,
        updatedBy
      }
    })
  }
}

// 数据库健康检查
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { healthy: true, message: 'Database connection is healthy' }
  } catch (error) {
    return { 
      healthy: false, 
      message: error instanceof Error ? error.message : 'Database connection failed' 
    }
  }
}