// src/fonts.ts
import localFont from 'next/font/local';

export const satoshi = localFont({
  variable: '--font-satoshi',
  display: 'swap',
  src: [
    {
      path: './assets/fonts/Satoshi/Satoshi-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './assets/fonts/Satoshi/Satoshi-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: './assets/fonts/Satoshi/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './assets/fonts/Satoshi/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
});

