// src/components/ThemeProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { applyTheme, getCurrentTheme, getAvailableThemes, Theme } from '@/lib/theme'

interface ThemeContextType {
  currentTheme: string
  setTheme: (theme: string) => void
  availableThemes: Theme[]
  isLoaded: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<string>('light')
  const [isLoaded, setIsLoaded] = useState(false)
  const [availableThemes] = useState<Theme[]>(getAvailableThemes())

  useEffect(() => {
    const initializeTheme = () => {
      try {
        const theme = getCurrentTheme()
        setCurrentTheme(theme)
        applyTheme(theme)
      } catch (error) {
        console.warn('Failed to initialize theme:', error)
        applyTheme('light')
      } finally {
        setIsLoaded(true)
      }
    }

    initializeTheme()

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('theme')
      if (!saved) {
        const newTheme = e.matches ? 'dark' : 'light'
        setCurrentTheme(newTheme)
        applyTheme(newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [])

  const setTheme = (theme: string) => {
    try {
      setCurrentTheme(theme)
      applyTheme(theme)
      localStorage.setItem('theme', theme)
    } catch (error) {
      console.warn('Failed to set theme:', error)
    }
  }

  // 防止水合不匹配
  if (!isLoaded) {
    return (
      <div className="opacity-0 pointer-events-none">
        {children}
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      availableThemes, 
      isLoaded 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
