import React from 'react'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

interface Room {
  id: number
  name: string
  description: string
  price: number
  image?: string | null
}

interface Service {
  id: number
  name: string
  description: string
  image?: string | null
}

interface GalleryImage {
  id: number
  title: string
  image?: string | null
}

export default async function Home() {
  const rooms = await prisma.room.findMany() as Room[]
  const services = await prisma.service.findMany() as Service[]
  const galleryImages = await prisma.galleryImage.findMany() as GalleryImage[]

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0">
          <Image
            src="/images/hero-image.jpg"
            alt="Otel Tisna"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 text-center">
          <h1 className="text-5xl font-bold mb-4">Otel Tisna</h1>
          <p className="text-xl">Lüks ve konforun adresi</p>
        </div>
      </section>

      {/* Odalar Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Odalarımız</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {room.image && (
                  <Image
                    src={room.image}
                    alt={room.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                  <p className="text-gray-600 mb-4">{room.description}</p>
                  <div className="text-blue-600 font-bold">{room.price} ₺</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hizmetler Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Hizmetlerimiz</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {service.image && (
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Galeri</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <div key={image.id} className="relative group overflow-hidden rounded-lg">
                {image.image && (
                  <Image
                    src={image.image}
                    alt={image.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-center px-4">{image.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
