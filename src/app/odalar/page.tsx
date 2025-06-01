'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Room {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  images: string[];
  features: string;
  price: number;
  kapasite: number;
  yatakTipi: string;
  buyukluk: number;
  manzara: string;
  badge?: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-[40vh] bg-gray-900">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Odalarımız</h1>
            <p className="text-xl">Konfor ve şıklığın buluştuğu odalar</p>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map(room => (
              <div key={room.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative">
                {room.badge && (
                  <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow">
                    {room.badge}
                  </span>
                )}
                <div className="relative h-64">
                  <Link href={`/odalar/${room.id}`} className="block h-full w-full">
                    <Image src={room.imageUrl} alt={room.name} fill className="object-cover" />
                  </Link>
                </div>
                <div className="p-6">
                  <Link href={`/odalar/${room.id}`} className="hover:underline">
                    <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                  </Link>
                  <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-2">
                    <span>👥 {room.kapasite} Kişi</span>
                    <span>🛏️ {room.yatakTipi}</span>
                    <span>📏 {room.buyukluk} m²</span>
                    <span>🌅 {room.manzara}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{room.description}</p>
                  <ul className="space-y-2 mb-4">
                    {room.features.split(',').map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-blue-600">₺{room.price}</span>
                    <Link
                      href={`/rezervasyon?oda=${room.id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Rezervasyon Yap
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 