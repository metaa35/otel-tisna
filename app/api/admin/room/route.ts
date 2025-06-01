import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinaryUpload'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const capacity = parseInt(formData.get("capacity") as string)
    const bedType = formData.get("bedType") as string
    const size = parseInt(formData.get("size") as string)
    const view = formData.get("view") as string
    const features = formData.get("features") as string
    const badge = formData.get("badge") as string | null
    const image = formData.get("image") as File
    const id = formData.get("id") as string

    let imageUrl = null;
    if (image && image.size > 0) {
      imageUrl = await uploadToCloudinary(image);
      if (!imageUrl) {
        return NextResponse.json({ error: "Cloudinary yükleme hatası." }, { status: 500 })
      }
    }

    const data = {
      name,
      description,
      price,
      capacity,
      bedType,
      size,
      view,
      features,
      badge,
      ...(imageUrl && { image: imageUrl })
    }

    if (id) {
      const room = await prisma.room.update({
        where: { id: parseInt(id) },
        data
      })
      return NextResponse.json(room)
    } else {
      const room = await prisma.room.create({
        data
      })
      return NextResponse.json(room)
    }
  } catch (error) {
    console.error('API Hatası:', error)
    return NextResponse.json({ error: "Oda kaydedilemedi." }, { status: 500 })
  }
} 