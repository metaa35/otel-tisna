import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany();
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: "İletişim verileri getirilemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message } = data;
    const contact = await prisma.contact.create({
      data: { name, email, message }
    });
    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json({ error: "İletişim verisi kaydedilemedi." }, { status: 500 });
  }
} 