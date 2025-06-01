'use client';
import { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

export default function IletisimPage() {
  const [form, setForm] = useState({ ad: '', email: '', mesaj: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-gray-900">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">İletişim</h1>
            <p className="text-xl">Bizimle iletişime geçin</p>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 max-w-4xl mt-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Bilgi ve harita */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Otel Bilgileri</h2>
              <ul className="text-gray-700 space-y-4">
                <li className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <span>Tisna, Muğla, Türkiye</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaPhoneAlt className="text-blue-600" />
                  <span>+90 252 123 45 67</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-blue-600" />
                  <span>info@oteltisna.com</span>
                </li>
              </ul>
              <div className="flex gap-4 mt-6">
                <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="Instagram"><FaInstagram size={24} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="Facebook"><FaFacebookF size={24} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="Twitter"><FaTwitter size={24} /></a>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow aspect-video">
              <iframe
                src="https://www.google.com/maps?q=Muğla&output=embed"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Otel Konumu"
              ></iframe>
            </div>
          </div>
          {/* Form */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-center">
            <h2 className="text-xl font-semibold mb-4">Bize Ulaşın</h2>
            {sent && <div className="mb-4 text-green-600 font-semibold">Mesajınız gönderildi!</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="ad" className="block mb-1 font-medium">Adınız</label>
                <input
                  type="text"
                  id="ad"
                  name="ad"
                  value={form.ad}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">E-posta</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="mesaj" className="block mb-1 font-medium">Mesajınız</label>
                <textarea
                  id="mesaj"
                  name="mesaj"
                  value={form.mesaj}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 