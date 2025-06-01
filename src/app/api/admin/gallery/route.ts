import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { writeFile } from 'fs/promises'
import { join } from 'path'

// Galeri fotoğraflarını getir
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany()
    return NextResponse.json(images)
  } catch (error) {
    return NextResponse.json({ error: "Görseller getirilemedi." }, { status: 500 })
  }
}

// Galeri fotoğrafı ekle
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const image = formData.get("image") as File
    const id = formData.get("id") as string

    let imageUrl = null;
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `gallery-${Date.now()}.jpg`;
      const filePath = join(process.cwd(), 'public/images/gallery', fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/images/gallery/${fileName}`;
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
    return NextResponse.json({ error: "Görsel kaydedilemedi." }, { status: 500 })
  }
}

// Galeri fotoğrafı sil
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.galleryImage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Görsel silinemedi." }, { status: 500 })
  }
} 