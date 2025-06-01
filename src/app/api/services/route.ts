import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Örnek veri - Daha sonra veritabanından gelecek
const services = [
  {
    id: 1,
    title: 'Restoran & Bar',
    description: 'Yerel ve dünya mutfağından seçkin lezzetler sunan restoranımız ve keyifli vakit geçirebileceğiniz barlarımız.',
    imageUrl: '/images/services/restaurant.jpg',
    features: [
      'A La Carte Restoran',
      'Pool Bar',
      'Beach Bar',
      'Lobby Bar',
      'Room Service',
    ],
  },
  {
    id: 2,
    title: 'Spa & Wellness',
    description: 'Profesyonel ekibimiz ve modern ekipmanlarımızla yenilenme ve rahatlama imkanı.',
    imageUrl: '/images/services/spa.jpg',
    features: [
      'Masaj Hizmetleri',
      'Cilt Bakımı',
      'Sauna',
      'Türk Hamamı',
      'Jakuzi',
    ],
  },
  {
    id: 3,
    title: 'Havuz & Plaj',
    description: 'Deniz manzaralı havuzlarımız ve özel plajımızda unutulmaz bir tatil deneyimi.',
    imageUrl: '/images/services/pool.jpg',
    features: [
      'Ana Havuz',
      'Çocuk Havuzu',
      'Özel Plaj',
      'Şezlong & Şemsiye',
      'Plaj Barı',
    ],
  },
  {
    id: 4,
    title: 'Spor & Aktiviteler',
    description: 'Sağlıklı bir tatil için spor ve aktivite imkanları.',
    imageUrl: '/images/services/sports.jpg',
    features: [
      'Fitness Center',
      'Tenis Kortu',
      'Su Sporları',
      'Yoga Dersleri',
      'Animasyon Programı',
    ],
  },
  {
    id: 5,
    title: 'Toplantı & Etkinlik',
    description: 'İş toplantıları ve özel etkinlikler için profesyonel çözümler.',
    imageUrl: '/images/services/meeting.jpg',
    features: [
      'Toplantı Salonları',
      'Konferans Odaları',
      'Düğün Organizasyonu',
      'Özel Etkinlikler',
      'Catering Hizmeti',
    ],
  },
  {
    id: 6,
    title: 'Çocuk Kulübü',
    description: 'Çocuklarınız için eğlenceli ve güvenli bir ortam.',
    imageUrl: '/images/services/kids.jpg',
    features: [
      'Mini Club',
      'Çocuk Havuzu',
      'Oyun Alanı',
      'Animasyon',
      'Çocuk Menüsü',
    ],
  },
];

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const data = await req.json();
  const service = await prisma.service.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      features: data.features,
    },
  });
  return NextResponse.json(service);
} 