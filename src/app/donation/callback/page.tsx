// src/app/donation/callback/page.tsx
'use client'
import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function DonationCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing')
  const [message, setMessage] = useState('正在处理赞赏结果...')

  const handleSuccessPayment = useCallback(async (orderId: string, slug: string | null) => {
    try {
      // 这里应该验证支付并生成解锁token
      // 临时模拟成功
      setStatus('success')
      setMessage('赞赏成功！感谢您的支持')
      
      // 3秒后跳转到内容页面
      setTimeout(() => {
        if (slug) {
          router.push(`/work/${slug}`)
        } else {
          router.push('/')
        }
      }, 3000)
    } catch {
      setStatus('failed')
      setMessage('验证赞赏时发生错误')
    }
  }, [router])

  const checkOrderStatus = useCallback(async (orderId: string) => {
    try {
      const res = await fetch('/api/check-donation-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setMessage('赞赏成功！')
        setTimeout(() => {
          router.push(data.redirectTo)
        }, 3000)
      } else {
        setStatus('failed')
        setMessage(data.message || '支付状态未知')
      }
    } catch {
      setStatus('failed')
      setMessage('查询支付状态失败')
    }
  }, [router])

  const handleCallback = useCallback(async () => {
    try {
      // 从URL参数获取支付结果
      const orderId = searchParams.get('order_id')
      const payStatus = searchParams.get('status')
      const amount = searchParams.get('amount')
      const slug = searchParams.get('slug')
      const paymentMethod = searchParams.get('payment_method')
      const transactionId = searchParams.get('transaction_id')
      
      console.log('支付回调参数:', { 
        orderId, payStatus, amount, slug, paymentMethod, transactionId 
      })

      if (!orderId) {
        setStatus('failed')
        setMessage('缺少订单信息')
        return
      }

      if (payStatus === 'success') {
        // 支付成功，验证并生成解锁token
        await handleSuccessPayment(orderId, slug)
      } else if (payStatus === 'failed') {
        setStatus('failed')
        setMessage('支付失败，请重试')
      } else if (payStatus === 'cancelled') {
        setStatus('failed')
        setMessage('支付已取消')
      } else {
        // 未知状态，查询订单
        await checkOrderStatus(orderId)
      }
    } catch (error) {
      console.error('处理支付回调时出错:', error)
      setStatus('failed')
      setMessage('处理支付结果时发生错误')
    }
  }, [searchParams, handleSuccessPayment, checkOrderStatus])

  useEffect(() => {
    handleCallback()
  }, [handleCallback])

  const handleRetry = () => {
    const slug = searchParams.get('slug')
    if (slug) {
      router.push(`/unlock?next=/work/${slug}`)
    } else {
      router.back()
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-6 max-w-md">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              处理中
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl">❤️</div>
            <h1 className="text-2xl font-bold text-red-600">赞赏成功！</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {message}，即将为您跳转到内容页面...
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              感谢您对创作者的支持！
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="text-6xl">😞</div>
            <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              赞赏失败
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{message}</p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="block w-full px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                重试赞赏
              </button>
              <button
                onClick={handleGoHome}
                className="block w-full px-6 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
              >
                返回首页
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function DonationCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent" />
      </div>
    }>
      <DonationCallbackContent />
    </Suspense>
  )
}