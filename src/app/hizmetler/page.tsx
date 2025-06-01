'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import * as FaIcons from 'react-icons/fa';

interface Service {
  id: number;
  name: string;
  description: string;
  icon?: string;
}

interface ExtraService {
  icon: string;
  title: string;
  description: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('Hizmetler yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Hizmetler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-gray-900">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hizmetlerimiz</h1>
            <p className="text-xl">Size özel tasarlanmış hizmetler</p>
          </div>
        </div>
      </section>

      {/* Hizmetler Listesi */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon && FaIcons[service.icon as keyof typeof FaIcons];
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center justify-center"
                >
                  <div className="flex items-center justify-center h-32 w-full">
                    {IconComponent ? (
                      <IconComponent className="w-16 h-16 text-blue-600" />
                    ) : (
                      <FaIcons.FaConciergeBell className="w-16 h-16 text-blue-600" />
                    )}
                  </div>
                  <div className="p-6 w-full flex flex-col items-center">
                    <h3 className="text-xl font-bold mb-2 text-center">{service.name}</h3>
                    <p className="text-gray-600 mb-4 text-center">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
} 