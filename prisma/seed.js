const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Örnek odalar
  const rooms = [
    {
      name: 'Deluxe Oda',
      description: 'Lüks ve konforlu bir deneyim için tasarlanmış deluxe oda.',
      price: 1500,
      capacity: 2,
      bedType: 'King Size',
      size: 35,
      view: 'Deniz Manzarası',
      features: 'WiFi,TV,Minibar,Klima,Saç Kurutma Makinesi',
      badge: 'Popüler',
      images: {
        create: [
          { url: '/images/room-3d.jpg' }
        ]
      }
    },
    {
      name: 'Standart Oda',
      description: 'Rahat ve ekonomik bir konaklama için ideal standart oda.',
      price: 1000,
      capacity: 2,
      bedType: 'Queen Size',
      size: 30,
      view: 'Şehir Manzarası',
      features: 'WiFi,TV,Klima',
      images: {
        create: [
          { url: '/images/room-3d.jpg' }
        ]
      }
    }
  ]

  for (const room of rooms) {
    await prisma.room.create({
      data: room
    })
  }

  console.log('Örnek veriler başarıyla eklendi.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 