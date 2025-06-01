import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const id = formData.get("id") as string

    // Görsel yükleme kaldırıldı
    let imageUrl = null;

    if (id) {
      const galleryImage = await prisma.galleryImage.update({
        where: { id: parseInt(id) },
        data: { title }
      })
      return NextResponse.json(galleryImage)
    } else {
      const galleryImage = await prisma.galleryImage.create({
        data: { title, image: imageUrl }
      })
      return NextResponse.json(galleryImage)
    }
  } catch (error) {
    console.error('API Hatası:', error)
    return NextResponse.json({ error: "Görsel kaydedilemedi." }, { status: 500 })
  }
} 