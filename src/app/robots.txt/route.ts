// src/app/robots.txt/route.ts
import { NextResponse } from 'next/server'
import { PROJECTS } from '@/config/work'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://yourdomain.com'

export async function GET() {
  // 获取受保护的项目路径
  const protectedPaths = Object.values(PROJECTS)
    .filter(project => project.protected)
    .map(project => `/work/${project.slug}`)
  
  // 获取非受保护的项目路径
  const allowedPaths = Object.values(PROJECTS)
    .filter(project => !project.protected)
    .map(project => `/work/${project.slug}`)
  
  const robots = `User-agent: *
Allow: /
Allow: /about
${allowedPaths.map(path => `Allow: ${path}`).join('\n')}

# 不允许搜索引擎索引受保护的内容和解锁页面
${protectedPaths.map(path => `Disallow: ${path}`).join('\n')}
Disallow: /unlock
Disallow: /api/

# Sitemap 位置
Sitemap: ${DOMAIN}/sitemap.xml`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}