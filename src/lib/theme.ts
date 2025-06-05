// src/lib/theme.ts
export interface ThemeColors {
  // 基础颜色
  background: string
  foreground: string
  
  // 卡片系统
  card: string
  cardForeground: string
  cardBorder: string
  cardShadow: string
  
  // 文本层级
  textPrimary: string
  textSecondary: string
  textMuted: string
  
  // 状态颜色
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  
  // 交互状态
  hover: string
  focus: string
  
  // 边框和分割线
  border: string
  ring: string
}

export interface Theme {
  name: string
  colors: ThemeColors
}

// 定义所有主题
export const themes: Record<string, Theme> = {
  light: {
    name: 'Light',
    colors: {
      background: 'rgb(255, 255, 255)',
      foreground: 'rgb(23, 23, 23)',
      
      card: 'rgb(255, 255, 255)',
      cardForeground: 'rgb(23, 23, 23)',
      cardBorder: 'rgb(229, 231, 235)',
      cardShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      
      textPrimary: 'rgb(23, 23, 23)',
      textSecondary: 'rgb(75, 85, 99)',
      textMuted: 'rgb(107, 114, 128)',
      
      primary: 'rgb(99, 102, 241)',
      primaryForeground: 'rgb(255, 255, 255)',
      secondary: 'rgb(249, 250, 251)',
      secondaryForeground: 'rgb(23, 23, 23)',
      accent: 'rgb(236, 254, 255)',
      accentForeground: 'rgb(23, 23, 23)',
      
      hover: 'rgb(243, 244, 246)',
      focus: 'rgb(99, 102, 241)',
      
      border: 'rgb(229, 231, 235)',
      ring: 'rgb(99, 102, 241)',
    }
  },
  
  dark: {
    name: 'Dark',
    colors: {
      background: 'rgb(17, 24, 39)',
      foreground: 'rgb(249, 250, 251)',
      
      card: 'rgb(31, 41, 55)',
      cardForeground: 'rgb(249, 250, 251)',
      cardBorder: 'rgb(75, 85, 99)',
      cardShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
      
      textPrimary: 'rgb(249, 250, 251)',
      textSecondary: 'rgb(209, 213, 219)',
      textMuted: 'rgb(156, 163, 175)',
      
      primary: 'rgb(129, 140, 248)',
      primaryForeground: 'rgb(17, 24, 39)',
      secondary: 'rgb(55, 65, 81)',
      secondaryForeground: 'rgb(249, 250, 251)',
      accent: 'rgb(17, 24, 39)',
      accentForeground: 'rgb(249, 250, 251)',
      
      hover: 'rgb(55, 65, 81)',
      focus: 'rgb(129, 140, 248)',
      
      border: 'rgb(75, 85, 99)',
      ring: 'rgb(129, 140, 248)',
    }
  },
  
  // 预留新主题示例
  ocean: {
    name: 'Ocean',
    colors: {
      background: 'rgb(8, 47, 73)',
      foreground: 'rgb(236, 254, 255)',
      
      card: 'rgb(14, 116, 144)',
      cardForeground: 'rgb(236, 254, 255)',
      cardBorder: 'rgb(34, 211, 238)',
      cardShadow: '0 4px 6px -1px rgb(8 47 73 / 0.3)',
      
      textPrimary: 'rgb(236, 254, 255)',
      textSecondary: 'rgb(165, 243, 252)',
      textMuted: 'rgb(103, 232, 249)',
      
      primary: 'rgb(34, 211, 238)',
      primaryForeground: 'rgb(8, 47, 73)',
      secondary: 'rgb(21, 94, 117)',
      secondaryForeground: 'rgb(236, 254, 255)',
      accent: 'rgb(6, 182, 212)',
      accentForeground: 'rgb(8, 47, 73)',
      
      hover: 'rgb(21, 94, 117)',
      focus: 'rgb(34, 211, 238)',
      
      border: 'rgb(34, 211, 238)',
      ring: 'rgb(34, 211, 238)',
    }
  }
}

// 获取当前主题
export function getCurrentTheme(): string {
  if (typeof window === 'undefined') return 'light'
  
  try {
    const saved = localStorage.getItem('theme')
    if (saved && themes[saved]) return saved
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

// 应用主题到 CSS 变量
export function applyTheme(themeName: string) {
  const theme = themes[themeName]
  if (!theme) return
  
  const root = document.documentElement
  
  // 应用所有颜色变量
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
  
  // 设置主题标识符
  root.setAttribute('data-theme', themeName)
  
  // 为了兼容现有的 dark class，保留这个逻辑
  if (themeName === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// 获取所有可用主题
export function getAvailableThemes() {
  return Object.values(themes)
}
