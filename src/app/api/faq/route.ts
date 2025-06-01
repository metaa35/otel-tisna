import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(faqs);
}

export async function POST(req: Request) {
  const data = await req.json();
  const faq = await prisma.fAQ.create({
    data: {
      question: data.question,
      answer: data.answer,
    },
  });
  return NextResponse.json(faq);
} 