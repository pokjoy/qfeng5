// src/components/DonationModal.tsx
'use client'
import { useState, useEffect } from 'react'

interface DonationModalProps {
  slug: string
  open: boolean
  onClose: () => void
}

interface CurrencyConfig {
  country: string
  currency: string
  symbol: string
  amounts: number[]
  descriptions: string[]
}

export function DonationModal({ slug, open, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig | null>(null)
  const [detecting, setDetecting] = useState(true)

  // 组件打开时检测货币
  useEffect(() => {
    if (open) {
      detectCurrency()
    }
  }, [open])

  const detectCurrency = async () => {
    setDetecting(true)
    try {
      const response = await fetch('/api/get-currency')
      const data = await response.json()
      
      if (data.success) {
        setCurrencyConfig({
          country: data.country,
          currency: data.currency,
          symbol: data.symbol,
          amounts: data.amounts,
          descriptions: data.descriptions
        })
        console.log('检测到货币配置:', data)
      } else {
        throw new Error('货币检测失败')
      }
    } catch (error) {
      console.error('货币检测失败:', error)
      // 使用默认的人民币配置
      setCurrencyConfig({
        country: 'CN',
        currency: 'CNY',
        symbol: '¥',
        amounts: [9.9, 19.9, 49.9, 99.9],
        descriptions: ['一杯咖啡☕', '一份午餐🍜', '支持创作💪', '深度支持🎯']
      })
    } finally {
      setDetecting(false)
    }
  }

  const handlePresetAmount = (value: string) => {
    setAmount(value)
    setCustomAmount('')
    setError('')
  }

  const handleCustomAmountChange = (value: string) => {
    // 只允许数字和小数点，最多两位小数
    const regex = /^\d*\.?\d{0,2}$/
    if (regex.test(value) || value === '') {
      setCustomAmount(value)
      setAmount(value)
      setError('')
    }
  }

  const handleDonate = async () => {
    if (!currencyConfig) {
      setError('货币信息加载失败，请重试')
      return
    }

    const finalAmount = customAmount || amount
    const numAmount = parseFloat(finalAmount)
    
    if (!finalAmount || numAmount < 0.5) {
      setError(`最低赞赏金额为 ${currencyConfig.symbol}0.5`)
      return
    }
    
    if (numAmount > 9999) {
      setError(`单次赞赏不能超过 ${currencyConfig.symbol}9999`)
      return
    }

    setLoading(true)
    setError('')

    try {
      // 创建赞赏订单，包含货币信息
      const res = await fetch('/api/create-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          slug, 
          amount: numAmount,
          currency: currencyConfig.currency
        })
      })

      const data = await res.json()

      if (res.ok && data.paymentUrl) {
        // 在新窗口打开支付页面
        const paymentWindow = window.open(
          data.paymentUrl,
          'donation_payment',
          'width=600,height=700,scrollbars=yes,resizable=yes,status=yes'
        )

        if (!paymentWindow) {
          setError('请允许弹出窗口以完成支付')
          return
        }

        // 监听支付结果
        const checkPaymentResult = () => {
          try {
            // 检查窗口是否关闭（用户可能手动关闭）
            if (paymentWindow.closed) {
              // 窗口关闭时检查支付状态
              checkDonationStatus(data.orderId)
              return
            }
            
            // 每秒检查一次
            setTimeout(checkPaymentResult, 1000)
          } catch (error) {
            console.log('检查支付窗口状态时出错:', error)
          }
        }

        checkPaymentResult()
        
        // 关闭当前模态框
        onClose()
        
      } else {
        setError(data.error || '创建赞赏订单失败')
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const checkDonationStatus = async (orderId: string) => {
    try {
      const res = await fetch('/api/check-donation-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      })

      const data = await res.json()

      if (data.success && data.redirectTo) {
        // 支付成功，跳转到内容页面
        window.location.href = data.redirectTo
      }
    } catch (error) {
      console.log('检查赞赏状态时出错:', error)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="text-center">
          <div className="text-4xl mb-3">❤️</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            赞赏解锁
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            您的赞赏是对创作者最大的支持
          </p>
        </div>

        {/* 货币检测加载状态 */}
        {detecting && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent mx-auto mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">正在检测您的地区...</p>
          </div>
        )}

        {/* 货币配置加载完成后显示内容 */}
        {!detecting && currencyConfig && (
          <>
            {/* 显示检测到的货币信息 */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              为您显示 {currencyConfig.currency} 价格
            </div>

            {/* 预设金额选项 */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                选择赞赏金额
              </label>
              <div className="grid grid-cols-2 gap-3">
                {currencyConfig.amounts.map((presetAmount, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetAmount(presetAmount.toString())}
                    className={`p-4 border rounded-xl text-left transition hover:scale-105 ${
                      amount === presetAmount.toString()
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {currencyConfig.symbol}{presetAmount}
                      </span>
                      <span className="text-xl">
                        {index === 0 ? '☕' : index === 1 ? '🍜' : index === 2 ? '💪' : '🎯'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {currencyConfig.descriptions[index]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义金额 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                或输入自定义金额
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 text-lg">
                    {currencyConfig.symbol}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-300 dark:focus:ring-red-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                最低 {currencyConfig.symbol}0.50，最高 {currencyConfig.symbol}9999.00
              </p>
            </div>

            {/* 赞赏说明 */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>赞赏后立即获得 <strong>30天</strong> 访问权限</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>支持创作者持续输出优质内容</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>安全支付，多种支付方式可选</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>跨设备同步，随时随地访问</span>
                </div>
              </div>
            </div>

            {/* 按钮区域 */}
            <div className="space-y-3">
              <button
                onClick={handleDonate}
                disabled={loading || !amount || parseFloat(amount) < 0.5}
                className={`w-full py-4 rounded-lg font-medium text-lg transition-all duration-200 ${
                  loading || !amount || parseFloat(amount) < 0.5
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    创建订单中...
                  </div>
                ) : (
                  `❤️ 赞赏 ${currencyConfig.symbol}${amount || '0'} 解锁内容`
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition py-2"
              >
                取消
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-2 text-red-900 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* 底部说明 */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>💝 赞赏是自愿行为，感谢您的支持</p>
          <p>🔒 支付安全由第三方平台保障</p>
        </div>
      </div>
    </div>
  )
}