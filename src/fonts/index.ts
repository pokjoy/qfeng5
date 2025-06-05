// src/fonts/index.ts
import localFont from 'next/font/local'

export const satoshi = localFont({
  src: [
    {
      path: './satoshi/Satoshi-Variable.woff2',
      weight: '300 900',
      style: 'normal',
    },
    {
      path: './satoshi/Satoshi-VariableItalic.woff2',
      weight: '300 900',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
  preload: true,
})

// 如果需要其他字体，也可以在这里定义
export const mono = localFont({
  src: './jetbrains-mono/JetBrainsMono-Variable.woff2',
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'monospace'],
  preload: false,
})
