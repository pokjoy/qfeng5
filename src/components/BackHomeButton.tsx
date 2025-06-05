// src/components/BackHomeButton.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'

export default function BackHomeButton() {
  const path = usePathname()
  if (path === '/') return null

  return (
    <Link
      href="/"
      className="
        fixed bottom-6 left-6 z-50
        flex items-center gap-2
        bg-black text-white
        px-4 py-2 rounded-full
        shadow-lg hover:shadow-2xl
        transition
      "
    >
      <ArrowUturnLeftIcon className="w-5 h-5" />
      <span className="font-medium">Home</span>
    </Link>
  )
}

