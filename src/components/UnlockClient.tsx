// src/components/UnlockClient.tsx - 更新广告API调用
'use client'

import { useRouter } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { useState } from 'react'
import { AdPlayer } from './AdPlayer'
import { DonationModal } from './DonationModal'

interface Props {
  initialNext: string
}

function UnlockCore({ initialNext }: Props) {
  const router = useRouter()
  const next = initialNext
  const slug = next.split('/').pop()!

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAdPlayer, setShowAdPlayer] = useState(false)
  const [showDonationModal, setShowDonationModal] = useState(false)

  useEffect(() => {
    setCode('')
    setError('')
    setLoading(false)
  }, [])

  // 🔧 修复：更新为使用新的多广告 API
  const handleAd = async () => {
    setError('')
    setLoading(true)
    
    try {
      const res = await fetch('/api/get-ad-videos') // 使用新的多广告API
      const data = await res.json()
      
      if (res.ok && data.success && data.videos && data.videos.length > 0) {
        setShowAdPlayer(true)
      } else {
        setError(data.error || '暂无可用广告，请稍后再试')
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleCode = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!code.trim()) {
      setError('请输入访问码')
      return
    }
    
    setError('')
    setLoading(true)
    
    try {
      const res = await fetch('/api/code-unlock', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ code: code.trim(), slug }),
      })
      const data = await res.json()
      
      if (res.ok && data.success) {
        router.push(data.redirectTo)
      } else {
        setError(data.message || '访问码错误')
        setCode('')
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDonation = () => {
    setShowDonationModal(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCode()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value)
    if (error) {
      setError('')
    }
  }

  const handleCodeButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    handleCode()
  }

  const isCodeButtonDisabled = loading || !code.trim()

  // 如果正在播放广告，显示广告播放器
  if (showAdPlayer) {
    return <AdPlayer next={next} />
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* 标题区域 */}
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            高级内容需解锁
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            选择以下任一方式解锁此项目的完整内容
          </p>
        </div>

        {/* 解锁选项卡片 */}
        <div className="w-full max-w-md space-y-4">
          {/* 广告解锁 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  📺 观看广告
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  免费解锁1小时访问权限
                </p>
              </div>
              <div className="text-xl font-bold text-green-600">免费</div>
            </div>
            <button
              onClick={handleAd}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? '检查广告中...' : '观看广告解锁'}
            </button>
          </div>

          {/* 赞赏解锁 - 推荐 */}
          <div className="relative bg-white dark:bg-gray-800 border-2 border-red-500 rounded-xl p-6 shadow-lg">
            <div className="absolute -top-3 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              推荐
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  ❤️ 赞赏解锁
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  支持创作者，获得30天访问权限
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-600">随心赞赏</div>
              </div>
            </div>
            <button
              onClick={handleDonation}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              ❤️ 赞赏解锁
            </button>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              💝 您的支持是创作的动力
            </div>
          </div>

          {/* 访问码解锁 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-md">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                🔑 访问码解锁
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                已有访问码？输入即可解锁1小时
              </p>
            </div>
            <form onSubmit={handleCode} className="space-y-3">
              <input
                type="text"
                placeholder="输入访问码"
                value={code}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoComplete="off"
                className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-300 dark:focus:ring-red-600 focus:border-transparent disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                onClick={handleCodeButtonClick}
                disabled={isCodeButtonDisabled}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  isCodeButtonDisabled
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-90'
                }`}
              >
                {loading ? '验证中…' : '使用访问码解锁'}
              </button>
            </form>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="w-full max-w-md p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-center">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-2 text-red-900 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200"
            >
              ×
            </button>
          </div>
        )}

        {/* 底部说明 */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-md space-y-2">
          <p>• ❤️ 赞赏解锁支持创作者持续创作</p>
          <p>• 📺 广告解锁完全免费但时效有限</p>
          <p>• 🔑 访问码通常用于特殊活动</p>
        </div>
      </div>

      {/* 赞赏模态框 */}
      <DonationModal
        slug={slug}
        open={showDonationModal}
        onClose={() => setShowDonationModal(false)}
      />
    </>
  )
}

export default function UnlockClientWrapper(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中…</div>}>
      <UnlockCore {...props} />
    </Suspense>
  )
}