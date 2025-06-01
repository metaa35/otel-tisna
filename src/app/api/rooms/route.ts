import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        images: true
      }
    });

    const formattedRooms = rooms.map(room => ({
      id: room.id,
      name: room.name,
      description: room.description,
      price: room.price,
      imageUrl: room.image || room.images[0]?.url || '/images/placeholder.jpg',
      images: room.images.map(img => img.url),
      features: room.features,
      kapasite: room.capacity,
      yatakTipi: room.bedType,
      buyukluk: room.size,
      manzara: room.view,
      badge: room.badge
    }));

    return NextResponse.json(formattedRooms);
  } catch (error) {
    console.error('Odalar getirilirken hata oluştu:', error);
    return NextResponse.json({ error: 'Odalar getirilemedi' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const room = await prisma.room.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      capacity: data.capacity,
      bedType: data.bedType,
      size: data.size,
      view: data.view,
      features: data.features,
      badge: data.badge,
      images: {
        create: (data.images || []).map((url: string) => ({ url })),
      },
    },
    include: { images: true },
  });
  return NextResponse.json(room);
} 