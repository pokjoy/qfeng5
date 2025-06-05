import { PrismaClient, Prisma } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 优雅关闭连接
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// 导出类型定义
export type {
  Donation,
  PaymentLog,
  UnlockToken,
  UserAnalytics,
  SystemConfig,
} from '@prisma/client'

// 导出常用的查询类型
import type { Donation, PaymentLog } from '@prisma/client'

export type DonationWithLogs = Donation & {
  paymentLogs: PaymentLog[]
}

export type CreateDonationInput = {
  orderId: string
  slug: string
  amount: number
  currency: string
  userIp?: string
  userCountry?: string
  paymentUrl?: string
  paymentProvider?: string
  expiresAt?: Date
  metadata?: Prisma.InputJsonValue
}

export type UpdateDonationStatusInput = {
  orderId: string
  status: string
  paidAt?: Date
  transactionId?: string
  paymentMethod?: string
  metadata?: Prisma.InputJsonValue
}