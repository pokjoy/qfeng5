'use client'

import { useEffect, useState } from 'react'
import ReportIssueModal from './ReportIssueModal'

export default function Footer() {
  const [sessionId, setSessionId] = useState<string>('')
  const [buildTime, setBuildTime] = useState<string>('')

  useEffect(() => {
    // 初始化或读取 sessionId
    let id = sessionStorage.getItem('sessionId')
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem('sessionId', id)
    }
    setSessionId(id)

    // 初始化构建时间
    setBuildTime(new Date().toLocaleString())
  }, [])

  return (
    <footer className="mt-auto py-6 flex flex-col items-center text-sm text-gray-500">
      {/* 原有 © 版权 与 Last build */}
      <div>© {new Date().getFullYear()} Qfeng5. All rights reserved.</div>
      {buildTime && (
        <div className="mt-1">
          Last build: <span className="font-mono">{buildTime}</span>
        </div>
      )}
      {/* 新增：Section ID 与报告故障按钮，放在版权和 Last build 下方 */}
      <div className="mt-2">
        Session ID: <span className="font-mono">{sessionId}</span>
      </div>
      <div className="mt-2">
        <ReportIssueModal sessionId={sessionId} />
      </div>
    </footer>
  )
}
