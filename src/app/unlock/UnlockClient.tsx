'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AdUnlock } from '@/components/AdUnlock'

export default function UnlockClient() {
  const [code, setCode] = useState('')
  const router = useRouter()
  const params = useSearchParams()
  const nextPath = params.get('next') || '/'

  const handleCode = async () => {
    const res = await fetch('/api/unlock/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    if (res.ok) router.push(nextPath)
    else alert('访问码错误')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">内容解锁</h1>
      <div className="mb-6">
        <input
          className="border p-2 w-full"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="请输入访问码"
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleCode}
        >
          提交访问码
        </button>
      </div>
      <div className="mb-6">
        <AdUnlock next={nextPath} />
      </div>
      <div>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => router.push('/api/unlock/payment')}
        >
          支付解锁（预留）
        </button>
      </div>
    </div>
  )
}
