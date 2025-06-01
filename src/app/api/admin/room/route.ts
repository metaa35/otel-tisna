import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'

// Oda listesini getir
export async function GET() {
  try {
    const rooms = await prisma.room.findMany()
    return NextResponse.json(rooms)
  } catch (error) {
    return NextResponse.json({ error: "Odalar getirilemedi." }, { status: 500 })
  }
}

// Oda ekle veya güncelle
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
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `room-${Date.now()}.jpg`;
      const filePath = join(process.cwd(), 'public/images', fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/images/${fileName}`;
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
    return NextResponse.json({ error: "Oda kaydedilemedi." }, { status: 500 })
  }
}

// Oda silme
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    // Önce ilişkili RoomImage'ları sil
    await prisma.roomImage.deleteMany({ where: { roomId: id } });
    // Sonra odayı sil
    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Oda silinemedi." }, { status: 500 });
  }
} 