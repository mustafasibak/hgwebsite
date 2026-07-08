import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  if (request.cookies.get('payload-lng')?.value !== 'de') {
    response.cookies.set({
      name: 'payload-lng',
      value: 'de',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
