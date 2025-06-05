// src/components/ThemeSwitcher.tsx
'use client'

import { useState } from 'react'
import { useTheme } from '@/components/ThemeProvider'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeSwitcher() {
  const { currentTheme, setTheme, availableThemes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg theme-card theme-border hover:opacity-80 transition-all duration-200"
        aria-label="切换主题"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {currentTheme === 'light' && '☀️'}
          {currentTheme === 'dark' && '🌙'}
          {currentTheme === 'ocean' && '🌊'}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 min-w-[120px] theme-card theme-border rounded-lg shadow-lg overflow-hidden z-50"
          >
            {availableThemes.map((theme) => (
              <button
                key={theme.name.toLowerCase()}
                onClick={() => {
                  setTheme(theme.name.toLowerCase())
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left theme-text-primary hover:bg-opacity-80 transition-colors flex items-center gap-2 ${
                  currentTheme === theme.name.toLowerCase() 
                    ? 'theme-button-primary' 
                    : 'theme-card-hover'
                }`}
              >
                <span className="w-4 text-center">
                  {theme.name === 'Light' && '☀️'}
                  {theme.name === 'Dark' && '🌙'}
                  {theme.name === 'Ocean' && '🌊'}
                </span>
                <span className="text-sm font-medium">{theme.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 点击外部关闭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
