import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Rezervasyonları listele
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(reservations)
  } catch (error) {
    return NextResponse.json({ error: 'Rezervasyonlar alınamadı', detail: String(error) }, { status: 500 })
  }
}

// Rezervasyon ekle
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const reservation = await prisma.reservation.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: Number(data.guests),
        message: data.message,
        status: data.status || 'pending',
      }
    })
    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Rezervasyon oluşturma hatası:', error)
    return NextResponse.json(
      { error: 'Rezervasyon oluşturulamadı', detail: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    )
  }
}

// Rezervasyon sil
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.reservation.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Rezervasyon silinemedi', detail: String(error) }, { status: 500 })
  }
}

// Rezervasyon durumunu güncelle
export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const updated = await prisma.reservation.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Rezervasyon güncellenemedi', detail: String(error) }, { status: 500 });
  }
} 