'use client'

import { useState, useEffect } from 'react'
import HotelInfoForm from './HotelInfoForm'
import RoomManager from './RoomManager'
import GalleryManager from './GalleryManager'
import ReservationManager from './ReservationManager'
import UserManager from './UserManager'
import ServiceManager from "./ServiceManager"
import FAQManager from "./FAQManager"
import ContactManager from "./ContactManager"

const MENU = [
  { key: 'rooms', label: 'Odalar', icon: '🛏️' },
  { key: 'services', label: 'Hizmetler', icon: '🛠️' },
  { key: 'gallery', label: 'Galeri', icon: '🖼️' },
  { key: 'faq', label: 'SSS', icon: '❓' },
  { key: 'contact', label: 'İletişim', icon: '📞' },
  { key: 'reservation', label: 'Rezervasyonlar', icon: '📅' },
  { key: 'user', label: 'Kullanıcılar', icon: '👤' },
  { key: 'upload', label: 'Görsel Yükle', icon: '⬆️' }
]

const tabs = [
  { key: 'rooms', label: 'Odalar' },
  { key: 'services', label: 'Hizmetler' },
  { key: 'gallery', label: 'Galeri' },
  { key: 'faq', label: 'SSS' },
  { key: 'contact', label: 'İletişim' },
  { key: 'reservation', label: 'Rezervasyonlar' },
];

export default function AdminPanel() {
  const [selectedMenu, setSelectedMenu] = useState('hotel')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageType, setImageType] = useState('hero')
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('')
  const [dashboard, setDashboard] = useState({
    rooms: 0,
    reservations: 0,
    approved: 0,
    pending: 0,
    users: 0
  });

  useEffect(() => {
    async function fetchDashboard() {
      const [roomRes, resRes, userRes] = await Promise.all([
        fetch('/api/admin/room'),
        fetch('/api/admin/reservation'),
        fetch('/api/admin/user'),
      ]);
      const rooms = await roomRes.json();
      const reservations = await resRes.json();
      const users = await userRes.json();
      setDashboard({
        rooms: rooms.length,
        reservations: reservations.length,
        approved: reservations.filter((r:any) => r.status === 'approved').length,
        pending: reservations.filter((r:any) => r.status === 'pending').length,
        users: users.length
      });
    }
    fetchDashboard();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('type', imageType)
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        alert('Görsel başarıyla yüklendi!')
        setSelectedFile(null)
      } else {
        alert('Görsel yüklenirken bir hata oluştu.')
      }
    } catch (error) {
      alert('Bir hata oluştu.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Paneli</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{dashboard.rooms}</div>
            <div className="text-gray-700">Oda</div>
          </div>
          <div className="bg-green-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{dashboard.reservations}</div>
            <div className="text-gray-700">Toplam Rezervasyon</div>
          </div>
          <div className="bg-yellow-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">{dashboard.pending}</div>
            <div className="text-gray-700">Bekleyen</div>
          </div>
          <div className="bg-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-800">{dashboard.approved}</div>
            <div className="text-gray-700">Onaylı</div>
          </div>
          <div className="bg-purple-100 rounded-lg p-4 text-center col-span-2 md:col-span-1">
            <div className="text-2xl font-bold text-purple-700">{dashboard.users}</div>
            <div className="text-gray-700">Kullanıcı</div>
          </div>
        </div>
        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded border transition-colors text-lg font-medium ${activeTab === tab.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-6 min-h-[400px]">
          <div className="p-4">
            {activeTab === 'rooms' && <RoomManager />}
            {activeTab === 'services' && <ServiceManager />}
            {activeTab === 'gallery' && <GalleryManager />}
            {activeTab === 'faq' && <FAQManager />}
            {activeTab === 'contact' && <ContactManager />}
            {activeTab === 'reservation' && <ReservationManager />}
          </div>
        </div>
      </div>
    </div>
  )
} 