// src/app/about/layout.tsx
import type { ReactNode } from 'react'

export const metadata = {
  title: 'About Me',
  description: 'Meet Qiuzi: an UI/UX designer, market researcher, and technology enthusiast.',
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  // 这里不要 'use client' —— 它是服务端组件
  return <>{children}</>
}
