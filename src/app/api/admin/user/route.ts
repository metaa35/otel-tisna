import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Kullanıcıları listele
export async function GET() {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, role: true, createdAt: true } })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Kullanıcılar alınamadı', detail: String(error) }, { status: 500 })
  }
}

// Kullanıcı ekle
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const created = await prisma.user.create({ data: { ...data, password: hashedPassword } })
    return NextResponse.json({ id: created.id, name: created.name, email: created.email, role: created.role, createdAt: created.createdAt })
  } catch (error) {
    return NextResponse.json({ error: 'Kullanıcı eklenemedi', detail: String(error) }, { status: 500 })
  }
}

// Kullanıcı sil
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Kullanıcı silinemedi', detail: String(error) }, { status: 500 })
  }
} 