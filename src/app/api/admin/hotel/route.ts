import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Otel bilgilerini getir
export async function GET() {
  const hotel = await prisma.hotelInfo.findFirst()
  return NextResponse.json(hotel)
}

// Otel bilgilerini güncelle veya oluştur
export async function POST(request: Request) {
  const data = await request.json()
  let hotel = await prisma.hotelInfo.findFirst()
  if (hotel) {
    hotel = await prisma.hotelInfo.update({
      where: { id: hotel.id },
      data,
    })
  } else {
    hotel = await prisma.hotelInfo.create({ data })
  }
  return NextResponse.json(hotel)
} 