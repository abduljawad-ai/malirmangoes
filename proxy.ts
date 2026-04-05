import { NextRequest, NextResponse } from 'next/server'

const adminPaths = ['/admin']
const customerPaths = ['/customer']
const protectedApiPaths = ['/api/upload', '/api/chat-upload']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('session')?.value

  if (adminPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (customerPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (protectedApiPaths.includes(pathname)) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/customer/:path*',
    '/api/upload',
    '/api/chat-upload',
  ],
}
