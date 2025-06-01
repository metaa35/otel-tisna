import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany()
    return NextResponse.json(faqs)
  } catch (error) {
    return NextResponse.json({ error: "SSS getirilemedi." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { question, answer, id } = data

    if (id) {
      const faq = await prisma.fAQ.update({
        where: { id: parseInt(id) },
        data: { question, answer }
      })
      return NextResponse.json(faq)
    } else {
      const faq = await prisma.fAQ.create({
        data: { question, answer }
      })
      return NextResponse.json(faq)
    }
  } catch (error) {
    return NextResponse.json({ error: "SSS kaydedilemedi." }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.fAQ.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "SSS silinemedi." }, { status: 500 })
  }
} 