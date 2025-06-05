// src/app/layout.tsx
import './globals.css';
import Header from '@/components/Header';
import BackToTop from '@/components/BackToTop'
import BackHomeButton from '@/components/BackHomeButton'
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { satoshi } from '@/fonts';

export default function Qfeng5Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={satoshi.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* 极简的防闪烁脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased transition-all duration-300">
        <ThemeProvider>
          {/* 固定导航 */}
          <Header />

          {/* 主内容 */}
          <main className="pt-20">
            {children}
          </main>

          {/* 页脚和辅助组件 */}
          <BackHomeButton />
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}