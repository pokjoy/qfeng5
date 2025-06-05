// src/components/BackToTop.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUpIcon } from '@heroicons/react/24/solid'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  // 监听页面滚动，超过 300px 时显示按钮
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-8 right-8 z-40"
    >
      <button
        onClick={scrollToTop}
        className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
        aria-label="Back to top"
      >
        <ChevronUpIcon className="h-6 w-6" />
      </button>
    </motion.div>
  )
}
