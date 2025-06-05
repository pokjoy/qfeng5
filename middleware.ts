// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { PROJECTS } from '@/config/work'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  if (pathname.startsWith('/work/')) {
    const slug = pathname.replace(/^\/work\//, '').split('/')[0]
    const project = PROJECTS[slug]
    
    if (project && project.protected) {
      const authCookie = req.cookies.get(process.env.COOKIE_NAME!)?.value
      
      if (!authCookie) {
        const url = req.nextUrl.clone()
        url.pathname = '/unlock'
        url.searchParams.set('next', pathname)
        return NextResponse.redirect(url)
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/work/:path*'
}
