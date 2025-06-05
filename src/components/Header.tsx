// src/components/Header.tsx - 外围环绕式进度指示器 + 主题系统
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 导航项配置
const navItems = [
  { label: 'HOME', href: '#home', icon: '🏠' },
  { label: 'WORK', href: '#work', icon: '💼' },
  { label: 'ABOUT', href: '#about', icon: '👤' },
  { label: 'FUN', href: '#fun', icon: '🎨' },
  { label: 'CONNECT', href: '#connect', icon: '🤝' },
]

// 主题图标映射
const themeIcons = {
  light: '☀️',
  dark: '🌙',
  ocean: '🌊'
} as const

// 安全的主题 Hook
function useSafeTheme() {
  const [currentTheme, setCurrentTheme] = useState('light')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // 检查当前主题
    const saved = localStorage.getItem('theme')
    if (saved) {
      setCurrentTheme(saved)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setCurrentTheme('dark')
    }
  }, [])

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'ocean']
    const currentIndex = themes.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    
    setCurrentTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
    
    // 应用主题
    const root = document.documentElement
    root.setAttribute('data-theme', nextTheme)
    
    if (nextTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // 应用 CSS 变量（简化版）
    if (nextTheme === 'dark') {
      root.style.setProperty('--color-background', 'rgb(17, 24, 39)')
      root.style.setProperty('--color-foreground', 'rgb(249, 250, 251)')
      root.style.setProperty('--color-card', 'rgb(31, 41, 55)')
      root.style.setProperty('--color-cardForeground', 'rgb(249, 250, 251)')
      root.style.setProperty('--color-cardBorder', 'rgb(75, 85, 99)')
      root.style.setProperty('--color-textPrimary', 'rgb(249, 250, 251)')
      root.style.setProperty('--color-textSecondary', 'rgb(209, 213, 219)')
      root.style.setProperty('--color-primary', 'rgb(129, 140, 248)')
      root.style.setProperty('--color-primaryForeground', 'rgb(17, 24, 39)')
      root.style.setProperty('--color-border', 'rgb(75, 85, 99)')
    } else if (nextTheme === 'ocean') {
      root.style.setProperty('--color-background', 'rgb(8, 47, 73)')
      root.style.setProperty('--color-foreground', 'rgb(236, 254, 255)')
      root.style.setProperty('--color-card', 'rgb(14, 116, 144)')
      root.style.setProperty('--color-cardForeground', 'rgb(236, 254, 255)')
      root.style.setProperty('--color-cardBorder', 'rgb(34, 211, 238)')
      root.style.setProperty('--color-textPrimary', 'rgb(236, 254, 255)')
      root.style.setProperty('--color-textSecondary', 'rgb(165, 243, 252)')
      root.style.setProperty('--color-primary', 'rgb(34, 211, 238)')
      root.style.setProperty('--color-primaryForeground', 'rgb(8, 47, 73)')
      root.style.setProperty('--color-border', 'rgb(34, 211, 238)')
    } else {
      root.style.setProperty('--color-background', 'rgb(255, 255, 255)')
      root.style.setProperty('--color-foreground', 'rgb(23, 23, 23)')
      root.style.setProperty('--color-card', 'rgb(255, 255, 255)')
      root.style.setProperty('--color-cardForeground', 'rgb(23, 23, 23)')
      root.style.setProperty('--color-cardBorder', 'rgb(229, 231, 235)')
      root.style.setProperty('--color-textPrimary', 'rgb(23, 23, 23)')
      root.style.setProperty('--color-textSecondary', 'rgb(75, 85, 99)')
      root.style.setProperty('--color-primary', 'rgb(99, 102, 241)')
      root.style.setProperty('--color-primaryForeground', 'rgb(255, 255, 255)')
      root.style.setProperty('--color-border', 'rgb(229, 231, 235)')
    }
  }

  return {
    currentTheme,
    toggleTheme,
    isMounted,
    availableThemes: [
      { name: 'Light' },
      { name: 'Dark' },
      { name: 'Ocean' }
    ]
  }
}

export default function Header() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [componentMounted, setComponentMounted] = useState(false)
  
  const { currentTheme, toggleTheme, isMounted: themeLoaded, availableThemes } = useSafeTheme()

  // 确保组件已挂载
  useEffect(() => {
    setComponentMounted(true)
  }, [])

  // 监听滚动位置，更新当前活动区块和滚动进度
  useEffect(() => {
    // 确保在客户端环境中运行
    if (typeof window === 'undefined' || !componentMounted) return

    const handleScroll = () => {
      // 更新滚动进度
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)

      // 如果正在程序化滚动，暂时不更新活动区块
      if (isScrolling) return

      const sections = ['home', 'work', 'about', 'fun', 'connect']
      const scrollPosition = scrollTop + 200 // 增加偏移量，提前触发

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始化时调用一次
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isScrolling, componentMounted])

  // 平滑滚动到指定区块
  const scrollToSection = (sectionId: string) => {
    // 确保在客户端环境中运行
    if (typeof window === 'undefined') return

    const element = document.getElementById(sectionId)
    if (!element) return

    setIsScrolling(true)
    setActiveSection(sectionId) // 立即更新活动状态
    setIsExpanded(false) // 点击后关闭菜单

    // 计算目标位置
    const targetPosition = element.offsetTop
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    const duration = Math.min(Math.abs(distance) / 2, 1000) // 动态调整时长，最大1秒

    let startTime: number | null = null

    // 自定义缓动函数 - ease-in-out-cubic
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    }

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const easedProgress = easeInOutCubic(progress)

      window.scrollTo(0, startPosition + distance * easedProgress)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      } else {
        // 滚动完成
        setTimeout(() => {
          setIsScrolling(false)
        }, 100) // 延迟重新启用滚动检测
      }
    }

    requestAnimationFrame(animateScroll)
  }

  // 鼠标离开时的延迟关闭
  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsExpanded(false)
    }, 300)
  }

  // 如果还未挂载，返回简化版本
  if (!componentMounted || !themeLoaded) {
    return (
      <header className="fixed top-8 left-8 z-50">
        <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 w-14 h-14">
          <div className="p-4">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">Q</span>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <div className="fixed top-8 left-8 z-50">
      {/* 圆形外围进度环 - 只在收缩时显示 */}
      {!isExpanded && componentMounted && (
        <div 
          className="absolute pointer-events-none"
          style={{
            top: '-4px',
            left: '-4px',
            width: '64px',
            height: '64px',
          }}
        >
          {/* 使用 SVG 绘制圆形进度环 */}
          <svg 
            width="64" 
            height="64"
            viewBox="0 0 64 64"
            className="transform -rotate-90"
          >
            {/* 背景圆环 */}
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="2"
              opacity="0.3"
            />
            
            {/* 进度圆环 */}
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(scrollProgress / 100) * 188.5} 188.5`}
              style={{
                transition: 'stroke-dasharray 0.2s ease',
              }}
            />
            
            {/* 渐变定义 */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="25%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="75%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="var(--color-primary)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* 主 Header 容器 - 圆形收缩，圆角矩形展开 */}
      <motion.div
        className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl border border-white/30 dark:border-gray-700/30"
        animate={{
          width: isExpanded ? 160 : 56,
          height: isExpanded ? 'auto' : 56,
          borderRadius: isExpanded ? '16px' : '50%',
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
        whileHover={{ 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="p-4 relative z-10">
          {/* Logo */}
          <motion.div
            className="w-6 h-6 flex items-center justify-center cursor-pointer mb-0"
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ 
              scale: 1.2,
              rotate: 180,
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20 
            }}
          >
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">Q</span>
          </motion.div>

          {/* 导航菜单 */}
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  duration: 0.3,
                  ease: 'easeInOut'
                }}
                className="mt-6 space-y-1 overflow-hidden"
              >
                {navItems.map((item) => {
                  const sectionId = item.href.replace('#', '')
                  const isActive = activeSection === sectionId
                  
                  return (
                    <motion.button
                      key={item.href}
                      onClick={() => scrollToSection(sectionId)}
                      className={`
                        w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium
                        transition-all duration-300 flex items-center gap-3
                        relative overflow-hidden group
                        ${isActive 
                          ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-lg' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                        }
                      `}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* 背景动画 */}
                      {!isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      
                      {/* 图标 */}
                      <span className={`text-base ${isActive ? 'grayscale-0' : 'opacity-70 group-hover:opacity-100'}`}>
                        {item.icon}
                      </span>
                      
                      {/* 文字 - 添加悬停动画 */}
                      <motion.span 
                        className="relative z-10"
                        whileHover={{ 
                          x: [0, 4, 2],
                        }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 400, 
                          damping: 10,
                          duration: 0.6
                        }}
                      >
                        {item.label}
                      </motion.span>
                      
                      {/* 活动状态指示器 */}
                      {isActive && (
                        <motion.div
                          className="absolute right-2 w-2 h-2 bg-white dark:bg-gray-900 rounded-full"
                          layoutId="activeIndicator"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  )
                })}

                {/* 主题切换按钮 */}
                <motion.div 
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <motion.button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                             text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80
                             transition-all duration-300 group relative"
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* 背景动画 */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-blue-500/10 rounded-xl"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* 主题图标 */}
                    <span className="text-base opacity-70 group-hover:opacity-100 relative z-10">
                      {themeIcons[currentTheme as keyof typeof themeIcons] || '🎨'}
                    </span>
                    
                    {/* 文字 - 添加悬停动画 */}
                    <motion.span 
                      className="relative z-10 capitalize"
                      whileHover={{ 
                        x: [0, 4, 2],
                      }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 400, 
                        damping: 10,
                        duration: 0.6
                      }}
                    >
                      {availableThemes.find(t => t.name.toLowerCase() === currentTheme)?.name || 'Theme'}
                    </motion.span>
                    
                    {/* 主题指示器 */}
                    <motion.div
                      className="ml-auto relative z-10 flex gap-1"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {availableThemes.map((theme, index) => (
                        <motion.div
                          key={theme.name}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            theme.name.toLowerCase() === currentTheme 
                              ? 'ring-2 ring-offset-1 ring-blue-500' 
                              : 'opacity-50'
                          }`}
                          style={{
                            backgroundColor: index === 0 ? '#f59e0b' : 
                                           index === 1 ? '#3b82f6' : '#06b6d4',
                          }}
                          animate={{
                            scale: theme.name.toLowerCase() === currentTheme ? 1.2 : 1,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 400
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.button>
                </motion.div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}