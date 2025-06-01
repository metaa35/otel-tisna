import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isValidAdminToken(token: string | undefined): boolean {
  if (!token) return false
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded.username === 'admin'
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  console.log('Middleware çalıştı:', request.nextUrl.pathname)
  
  // Sadece admin sayfalarını koru
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Login sayfasına erişime izin ver
    if (request.nextUrl.pathname === '/admin/login') {
      console.log('Login sayfasına erişim izni verildi')
      return NextResponse.next()
    }

    const token = request.cookies.get('admin_token')?.value
    console.log('Token:', token ? 'Var' : 'Yok')

    if (!isValidAdminToken(token)) {
      console.log('Token geçersiz, login sayfasına yönlendiriliyor')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 