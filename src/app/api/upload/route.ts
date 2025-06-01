import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Dosya adını oluştur
    let fileName = ''
    if (type === 'hero') {
      fileName = 'hero-image.jpg'
    } else if (type === 'room') {
      fileName = 'room-3d.jpg'
    } else if (type === 'gallery') {
      // Galeri görselleri için benzersiz isim oluştur
      const timestamp = Date.now()
      fileName = `gallery-${timestamp}.jpg`
    }

    // Dosyayı kaydet
    const path = join(process.cwd(), 'public/images', fileName)
    await writeFile(path, buffer)

    return NextResponse.json(
      { message: 'Dosya başarıyla yüklendi', filename: fileName },
      { status: 200 }
    )
  } catch (error) {
    console.error('Dosya yükleme hatası:', error)
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 