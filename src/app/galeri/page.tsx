'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  title: string;
  image?: string;
}

export default function GaleriPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<null | number>(null);

  useEffect(() => {
    fetch('/api/admin/gallery')
      .then(res => res.json())
      .then(data => setImages(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-gray-900">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Galeri</h1>
            <p className="text-xl">Otelimizin en güzel kareleri</p>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <button
              key={img.id}
              className="relative group focus:outline-none"
              onClick={() => setLightbox(idx)}
            >
              <div className="aspect-[4/3] relative w-full overflow-hidden rounded-lg shadow hover:shadow-lg">
                <Image
                  src={img.image || '/images/placeholder.jpg'}
                  alt={img.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                />
              </div>
              <span className="block mt-2 text-center text-gray-700 text-sm">{img.title}</span>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {lightbox !== null && images[lightbox] && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <button
              className="absolute top-8 right-8 text-white text-3xl font-bold focus:outline-none"
              onClick={() => setLightbox(null)}
              aria-label="Kapat"
            >
              ×
            </button>
            <div className="relative w-[90vw] max-w-2xl aspect-[4/3]">
              <Image
                src={images[lightbox].image || '/images/placeholder.jpg'}
                alt={images[lightbox].title}
                fill
                className="object-contain rounded-lg"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
              />
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-lg bg-black/60 px-4 py-2 rounded">
              {images[lightbox].title}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 