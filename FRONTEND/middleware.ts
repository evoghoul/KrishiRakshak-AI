import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only intercept requests to /api/ (backend routes)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    
    // Only proxy if NEXT_PUBLIC_API_URL is set
    if (apiUrl) {
      const requestHeaders = new Headers(request.headers)
      
      // Inject the ngrok skip warning header for all backend requests
      // This is crucial for local testing with ngrok and avoids CORS preflight nightmares
      requestHeaders.set('ngrok-skip-browser-warning', 'true')
      
      // Construct the target URL for the backend
      const targetUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, apiUrl)
      
      return NextResponse.rewrite(targetUrl, {
        request: {
          headers: requestHeaders,
        },
      })
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
