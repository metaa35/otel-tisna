import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinaryUpload'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const image = formData.get("image") as File
    const id = formData.get("id") as string

    let imageUrl = null;
    if (image && image.size > 0) {
      imageUrl = await uploadToCloudinary(image);
      if (!imageUrl) {
        return NextResponse.json({ error: "Cloudinary yükleme hatası." }, { status: 500 })
      }
    }

    if (id) {
      const galleryImage = await prisma.galleryImage.update({
        where: { id: parseInt(id) },
        data: { title, ...(imageUrl && { image: imageUrl }) }
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