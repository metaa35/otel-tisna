import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const images = await prisma.galleryImage.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(images);
}

export async function POST(req: Request) {
  const data = await req.json();
  const image = await prisma.galleryImage.create({
    data: {
      url: data.url,
      alt: data.alt,
      category: data.category,
    },
  });
  return NextResponse.json(image);
} 