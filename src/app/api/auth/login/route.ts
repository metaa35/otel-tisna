import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sign } from 'jsonwebtoken'

// Gerçek uygulamada bu bilgiler veritabanında saklanmalı
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'
const JWT_SECRET = 'gizli-anahtar-123'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Gelen istek:', body)
    
    const { username, password } = body

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      console.log('Giriş başarılı')
      // JWT token oluştur
      const token = sign({ username }, JWT_SECRET, { expiresIn: '1h' })
      
      const response = NextResponse.json({ success: true })
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: false, // localde her zaman false
        sameSite: 'lax',
        maxAge: 3600 // 1 saat
      })
      
      return response
    }

    console.log('Giriş başarısız')
    return NextResponse.json(
      { error: 'Geçersiz kullanıcı adı veya şifre' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Hata:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
} 