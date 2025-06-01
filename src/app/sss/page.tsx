'use client';
import { useState, useEffect } from 'react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function SSSPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/faq')
      .then(res => res.json())
      .then(data => setFaqs(Array.isArray(data) ? data : []))
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sıkça Sorulan Sorular</h1>
            <p className="text-xl">Otelimiz hakkında merak edilenler</p>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 max-w-2xl mt-12 py-16">
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={faq.id} className="border rounded-lg overflow-hidden">
              <button
                type="button"
                className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold focus:outline-none flex justify-between items-center"
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
              >
                <span>{faq.question}</span>
                <span>{faqOpen === idx ? '−' : '+'}</span>
              </button>
              {faqOpen === idx && (
                <div className="px-4 py-3 bg-white border-t text-gray-700 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 