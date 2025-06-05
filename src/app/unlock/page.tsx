// src/app/unlock/page.tsx
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import UnlockClient from '@/components/UnlockClient'

export const metadata = {
  title: '内容解锁',
}

interface Props {
  searchParams: Promise<{ next?: string }>
}

export default async function UnlockPage({ searchParams }: Props) {
  const { next } = await searchParams
  
  if (!next) {
    // 如果没有 next 参数，重定向到首页
    redirect('/')
  }

  return (
    <Suspense fallback={<div>加载中…</div>}>
      <UnlockClient initialNext={next} />
    </Suspense>
  )
}
