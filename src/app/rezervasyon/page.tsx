'use client';
import { useState } from 'react';

const odaTipleri = [
  { id: 1, ad: 'Standart Oda', fiyat: 2000 },
  { id: 2, ad: 'Deluxe Oda', fiyat: 3000 },
  { id: 3, ad: 'Suit Oda', fiyat: 4000 },
];

const adimlar = ['Oda Seçimi', 'Bilgiler', 'Onay'];

export default function RezervasyonPage() {
  const [adim, setAdim] = useState(0);
  const [form, setForm] = useState({
    oda: odaTipleri[0].id,
    giris: '',
    cikis: '',
    yetiskin: 2,
    cocuk: 0,
    ad: '',
    email: '',
    telefon: '',
    not: '',
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const ileri = () => setAdim((a) => Math.min(a + 1, adimlar.length - 1));
  const geri = () => setAdim((a) => Math.max(a - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.ad,
        email: form.email,
        phone: form.telefon,
        checkIn: form.giris,
        checkOut: form.cikis,
        guests: Number(form.yetiskin) + Number(form.cocuk),
        message: form.not,
        // oda tipi vs. eklemek istersen buraya ekle
      }),
    });
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const seciliOda = odaTipleri.find((o) => o.id === Number(form.oda));
  const geceSayisi = form.giris && form.cikis ? Math.max(1, Math.ceil((new Date(form.cikis).getTime() - new Date(form.giris).getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const toplamFiyat = seciliOda && geceSayisi ? seciliOda.fiyat * geceSayisi : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-gray-900">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Rezervasyon</h1>
            <p className="text-xl">Unutulmaz bir tatil için hemen rezervasyon yapın</p>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 max-w-4xl py-16">
        {/* Stepper */}
        <div className="flex justify-center mb-10">
          {adimlar.map((ad, idx) => (
            <div key={ad} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${adim === idx ? 'bg-blue-600' : 'bg-gray-400'}`}>{idx + 1}</div>
              {idx < adimlar.length - 1 && <div className="w-10 h-1 bg-gray-300 mx-2 rounded" />}
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form Alanı */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div className="text-2xl font-bold text-green-600 mb-2">Rezervasyonunuz alındı!</div>
                <div className="text-gray-600">En kısa sürede sizinle iletişime geçeceğiz.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {adim === 0 && (
                  <>
                    <div>
                      <label htmlFor="oda" className="block mb-1 font-medium">Oda Tipi</label>
                      <select
                        id="oda"
                        name="oda"
                        value={form.oda}
                        onChange={handleChange}
                        className="w-full border rounded px-4 py-2"
                        required
                      >
                        {odaTipleri.map((oda) => (
                          <option key={oda.id} value={oda.id}>{oda.ad} - ₺{oda.fiyat}/gece</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label htmlFor="giris" className="block mb-1 font-medium">Giriş Tarihi</label>
                        <input
                          type="date"
                          id="giris"
                          name="giris"
                          value={form.giris}
                          onChange={handleChange}
                          className="w-full border rounded px-4 py-2"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="cikis" className="block mb-1 font-medium">Çıkış Tarihi</label>
                        <input
                          type="date"
                          id="cikis"
                          name="cikis"
                          value={form.cikis}
                          onChange={handleChange}
                          className="w-full border rounded px-4 py-2"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label htmlFor="yetiskin" className="block mb-1 font-medium">Yetişkin</label>
                        <input
                          type="number"
                          id="yetiskin"
                          name="yetiskin"
                          min={1}
                          max={6}
                          value={form.yetiskin}
                          onChange={handleChange}
                          className="w-full border rounded px-4 py-2"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="cocuk" className="block mb-1 font-medium">Çocuk</label>
                        <input
                          type="number"
                          id="cocuk"
                          name="cocuk"
                          min={0}
                          max={6}
                          value={form.cocuk}
                          onChange={handleChange}
                          className="w-full border rounded px-4 py-2"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
                {adim === 1 && (
                  <>
                    <div>
                      <label htmlFor="ad" className="block mb-1 font-medium">Ad Soyad</label>
                      <input
                        type="text"
                        id="ad"
                        name="ad"
                        value={form.ad}
                        onChange={handleChange}
                        className="w-full border rounded px-4 py-2"
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
                        className="w-full border rounded px-4 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="telefon" className="block mb-1 font-medium">Telefon</label>
                      <input
                        type="tel"
                        id="telefon"
                        name="telefon"
                        value={form.telefon}
                        onChange={handleChange}
                        className="w-full border rounded px-4 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="not" className="block mb-1 font-medium">Özel İstekler</label>
                      <textarea
                        id="not"
                        name="not"
                        value={form.not}
                        onChange={handleChange}
                        className="w-full border rounded px-4 py-2"
                        rows={3}
                      />
                    </div>
                  </>
                )}
                {adim === 2 && (
                  <div className="text-center py-8">
                    <div className="text-2xl font-bold mb-4">Bilgilerinizi kontrol edin</div>
                    <div className="text-gray-700 mb-2">Oda: <span className="font-semibold">{seciliOda?.ad}</span></div>
                    <div className="text-gray-700 mb-2">Giriş: <span className="font-semibold">{form.giris}</span></div>
                    <div className="text-gray-700 mb-2">Çıkış: <span className="font-semibold">{form.cikis}</span></div>
                    <div className="text-gray-700 mb-2">Yetişkin: <span className="font-semibold">{form.yetiskin}</span></div>
                    <div className="text-gray-700 mb-2">Çocuk: <span className="font-semibold">{form.cocuk}</span></div>
                    <div className="text-gray-700 mb-2">Ad Soyad: <span className="font-semibold">{form.ad}</span></div>
                    <div className="text-gray-700 mb-2">E-posta: <span className="font-semibold">{form.email}</span></div>
                    <div className="text-gray-700 mb-2">Telefon: <span className="font-semibold">{form.telefon}</span></div>
                    <div className="text-gray-700 mb-2">Özel İstekler: <span className="font-semibold">{form.not || '-'}</span></div>
                  </div>
                )}
                <div className="flex gap-4 justify-between pt-4">
                  {adim > 0 && !sent && (
                    <button type="button" onClick={geri} className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition">Geri</button>
                  )}
                  {adim < adimlar.length - 1 && !sent && (
                    <button type="button" onClick={ileri} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">İleri</button>
                  )}
                  {adim === adimlar.length - 1 && !sent && (
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Rezervasyonu Tamamla</button>
                  )}
                </div>
              </form>
            )}
          </div>
          {/* Özet Kutusu */}
          <div className="bg-blue-50 rounded-lg shadow p-6 h-fit">
            <h3 className="text-xl font-bold mb-4 text-blue-700">Rezervasyon Özeti</h3>
            <div className="space-y-2 text-gray-700">
              <div><span className="font-semibold">Oda:</span> {seciliOda?.ad}</div>
              <div><span className="font-semibold">Giriş:</span> {form.giris || '-'}</div>
              <div><span className="font-semibold">Çıkış:</span> {form.cikis || '-'}</div>
              <div><span className="font-semibold">Gece:</span> {geceSayisi || '-'}</div>
              <div><span className="font-semibold">Yetişkin:</span> {form.yetiskin}</div>
              <div><span className="font-semibold">Çocuk:</span> {form.cocuk}</div>
              <div><span className="font-semibold">Toplam Fiyat:</span> <span className="text-blue-700 font-bold">₺{toplamFiyat || 0}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 