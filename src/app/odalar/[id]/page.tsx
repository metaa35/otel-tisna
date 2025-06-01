'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
}

interface Comment {
  id: number;
  user: string;
  rating: number;
  text: string;
  date: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function RoomDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: 'Ayşe K.',
      rating: 5,
      text: 'Oda çok temiz ve ferah, manzarası harikaydı! Kesinlikle tekrar geleceğim.',
      date: '2024-05-01',
    },
    {
      id: 2,
      user: 'Mehmet T.',
      rating: 4,
      text: 'Personel çok ilgiliydi, oda konforluydu. Kahvaltı daha iyi olabilirdi.',
      date: '2024-04-20',
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const faqs: FAQ[] = [
    {
      question: 'Odalarda sigara içilebilir mi?',
      answer: 'Hayır, tüm odalarımızda sigara içmek yasaktır. Sigara içme alanları otelimizin dışında mevcuttur.',
    },
    {
      question: 'Odalarda evcil hayvan kabul ediliyor mu?',
      answer: 'Maalesef, odalarımıza evcil hayvan kabul edilmemektedir.',
    },
    {
      question: 'Odalarda ücretsiz Wi-Fi var mı?',
      answer: 'Evet, tüm odalarımızda ücretsiz yüksek hızlı Wi-Fi hizmeti sunulmaktadır.',
    },
    {
      question: 'Odalarda ekstra yatak eklenebilir mi?',
      answer: 'Bazı oda tiplerimizde ek yatak imkanı bulunmaktadır. Detaylı bilgi için lütfen resepsiyon ile iletişime geçin.',
    },
  ];

  useEffect(() => {
    if (!id) return;
    fetch('/api/rooms')
      .then(res => res.json())
      .then((data: Room[]) => {
        const found = data.find(r => r.id === id);
        setRoom(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Yükleniyor...</div>;
  }
  if (!room) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Oda bulunamadı.</div>;
  }

  // Galeri ileri/geri fonksiyonları
  const prevImage = () => setActiveIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1));
  const nextImage = () => setActiveIndex((prev) => (prev === room.images.length - 1 ? 0 : prev + 1));

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      {
        id: comments.length + 1,
        user: 'Ziyaretçi',
        rating: newRating,
        text: newComment,
        date: new Date().toISOString().slice(0, 10),
      },
      ...comments,
    ]);
    setNewComment('');
    setNewRating(5);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Galeri/Slider */}
      <section className="relative h-[50vh] bg-gray-900 flex items-center justify-center">
        {room.images && room.images.length > 0 && (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image src={room.images[activeIndex]} alt={room.name} fill className="object-cover opacity-80 transition-all duration-300" />
            {/* Slider okları */}
            {room.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition">
                  &#8592;
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition">
                  &#8594;
                </button>
              </>
            )}
            {/* Küçük görsel göstergeleri */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-3 h-3 rounded-full ${activeIndex === idx ? 'bg-blue-500' : 'bg-white/60'} border border-white`}
                />
              ))}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white pointer-events-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{room.name}</h1>
            <span className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-lg font-semibold mb-2">₺{room.price} / gece</span>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-6">
            <span>👥 {room.kapasite} Kişi</span>
            <span>🛏️ {room.yatakTipi}</span>
            <span>📏 {room.buyukluk} m²</span>
            <span>🌅 {room.manzara}</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Açıklama</h2>
          <p className="text-gray-700 mb-8">{room.description}</p>
          <h3 className="text-xl font-semibold mb-2">Oda Özellikleri</h3>
          <ul className="space-y-2 mb-8">
            {room.features.split(',').map((feature, idx) => (
              <li key={idx} className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {feature.trim()}
              </li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold mb-4 mt-12">Kullanıcı Yorumları</h3>
          <div className="space-y-6 mb-8">
            {comments.length === 0 && <div className="text-gray-500">Henüz yorum yok.</div>}
            {comments.map((c) => (
              <div key={c.id} className="bg-white rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{c.user}</span>
                    <span className="text-yellow-500">{'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}</span>
                  </div>
                  <div className="text-gray-700">{c.text}</div>
                </div>
                <div className="text-gray-400 text-sm mt-2 md:mt-0 md:ml-4">{c.date}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="bg-gray-100 rounded-lg p-4 mb-8">
            <div className="mb-2 font-semibold">Yorumunuzu bırakın:</div>
            <textarea
              className="w-full p-2 rounded border border-gray-300 mb-2"
              rows={3}
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Yorumunuz..."
              required
            />
            <div className="flex items-center gap-2 mb-2">
              <span>Puan:</span>
              <select
                className="border rounded px-2 py-1"
                value={newRating}
                onChange={e => setNewRating(Number(e.target.value))}
              >
                {[5,4,3,2,1].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <span className="text-yellow-500">{'★'.repeat(newRating)}</span>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Gönder</button>
          </form>
          <Link
            href={`/rezervasyon?oda=${room.id}`}
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Rezervasyon Yap
          </Link>
        </div>
      </section>
    </div>
  );
} 