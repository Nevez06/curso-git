import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const response = NextResponse.next()

    // Security headers (convertido de SecurityHeadersMiddleware.cs)
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Rotas públicas
        const publicPaths = ['/', '/login-organizador', '/login-fornecedor', '/login-convidado',
          '/registro-organizador', '/registro-fornecedor', '/convite/confirmar', '/acesso-negado',
          '/api/auth', '/api/convites/confirmar']

        if (publicPaths.some(p => path.startsWith(p))) return true

        // Rotas protegidas precisam de token
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/eventos/:path*',
    '/organizador/:path*',
    '/fornecedor/:path*',
    '/administracao/:path*',
    '/ia/:path*',
    '/chat/:path*',
    '/template-convite/:path*',
    '/api/eventos/:path*',
    '/api/ia/:path*',
    '/api/administracao/:path*',
    '/api/chat/:path*',
    '/api/template-convite/:path*',
  ]
}
