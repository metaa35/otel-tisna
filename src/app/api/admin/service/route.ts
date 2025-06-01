import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const services = await prisma.service.findMany()
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: "Hizmetler getirilemedi." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const icon = formData.get("icon") as string
    const image = formData.get("image") as File
    const id = formData.get("id") as string

    if (id) {
      const service = await prisma.service.update({
        where: { id: parseInt(id) },
        data: { name, description, icon }
      })
      return NextResponse.json(service)
    } else {
      const service = await prisma.service.create({
        data: { name, description, icon }
      })
      return NextResponse.json(service)
    }
  } catch (error) {
    return NextResponse.json({ error: "Hizmet kaydedilemedi." }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Hizmet silinemedi." }, { status: 500 })
  }
} 