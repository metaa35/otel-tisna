import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const infos = await prisma.contactInfo.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(infos);
}

export async function POST(req: Request) {
  const data = await req.json();
  const info = await prisma.contactInfo.create({
    data: {
      address: data.address,
      phone: data.phone,
      email: data.email,
      instagram: data.instagram,
      facebook: data.facebook,
      twitter: data.twitter,
      mapUrl: data.mapUrl,
    },
  });
  return NextResponse.json(info);
} 