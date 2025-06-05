// src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server'
import { PROJECTS } from '@/config/work'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://yourdomain.com'

export async function GET() {
  // 获取当前日期作为 lastmod
  const currentDate = new Date().toISOString().split('T')[0]
  
  // 基础页面
  const baseUrls = [
    {
      url: DOMAIN,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      url: `${DOMAIN}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    }
  ]
  
  // 项目页面 - 只包含非受保护的项目
  const projectUrls = Object.values(PROJECTS)
    .filter(project => !project.protected) // 只包含非受保护的项目
    .map(project => ({
      url: `${DOMAIN}/work/${project.slug}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.9'
    }))
  
  // 其他页面（如果需要的话）
  const otherUrls = [
    {
      url: `${DOMAIN}/unlock`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.1'
    }
  ]
  
  // 合并所有 URL
  const allUrls = [...baseUrls, ...projectUrls, ...otherUrls]
  
  // 生成 XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}