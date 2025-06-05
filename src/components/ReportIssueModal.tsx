// ========== 1. src/components/ReportIssueModal.tsx ==========
'use client'

import { useState } from 'react'

interface ReportIssueModalProps {
  sessionId: string
}

export default function ReportIssueModal({ sessionId }: ReportIssueModalProps) {
  const [open, setOpen] = useState(false)
  const [desc, setDesc] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function submit() {
    if (!desc && status !== 'sent') return
    if (status === 'sent') {
      // 关闭弹窗并重置状态
      setOpen(false)
      setDesc('')
      setStatus('idle')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/report-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          description: desc,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  function openModal() {
    // 每次打开时重置描述和状态
    setDesc('')
    setStatus('idle')
    setOpen(true)
  }

  return (
    <>
      <button
        onClick={openModal}
        className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
      >
        Report Issue
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-xl font-bold">Report an Issue</h3>
            <p className="text-sm">
              Session ID: <span className="font-mono">{sessionId}</span>
            </p>
            <textarea
              className="w-full h-32 border rounded-lg p-2"
              placeholder="Describe the issue..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              disabled={status === 'sent'}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                {status === 'sent' ? 'Close' : 'Cancel'}
              </button>
              <button
                onClick={submit}
                disabled={status === 'sending' || status === 'sent' || (status === 'idle' && !desc)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {status === 'sending'
                  ? 'Sending...'
                  : status === 'sent'
                  ? 'Sent'
                  : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
