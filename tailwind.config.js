/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Satoshi"', 'ui-sans-serif', 'system-ui'],
      },
      // 添加 3D 变换相关的工具类
      perspective: {
        '1000': '1000px',
        '500': '500px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
        'visible': 'visible',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // 添加自定义 3D 工具类
    function({ addUtilities }) {
      const newUtilities = {
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.perspective-500': {
          perspective: '500px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
          '-webkit-backface-visibility': 'hidden',
          '-moz-backface-visibility': 'hidden',
        },
        '.backface-visible': {
          backfaceVisibility: 'visible',
          '-webkit-backface-visibility': 'visible',
          '-moz-backface-visibility': 'visible',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}