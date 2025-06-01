"use client"
import { useEffect, useState } from "react"
import toast from 'react-hot-toast';

interface Reservation {
  id: number
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: number
  message?: string
  createdAt: string
  status: string
}

export default function ReservationManager() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchReservations = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/reservation")
    const data = await res.json()
    setReservations(data)
    setLoading(false)
  }

  useEffect(() => { fetchReservations() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Rezervasyonu silmek istediğinize emin misiniz?")) return
    const res = await fetch("/api/admin/reservation", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    if (res.ok) {
      toast.success("Rezervasyon silindi!");
      fetchReservations()
    } else {
      toast.error("Bir hata oluştu.");
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    const res = await fetch("/api/admin/reservation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    if (res.ok) {
      toast.success("Durum güncellendi!");
      fetchReservations();
    } else {
      toast.error("Durum güncellenemedi.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-700">Rezervasyonlar</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-blue-50">
              <th className="py-2 px-4 text-left">Ad Soyad</th>
              <th className="py-2 px-4 text-left">E-posta</th>
              <th className="py-2 px-4 text-left">Telefon</th>
              <th className="py-2 px-4 text-left">Giriş</th>
              <th className="py-2 px-4 text-left">Çıkış</th>
              <th className="py-2 px-4 text-left">Kişi</th>
              <th className="py-2 px-4 text-left">Mesaj</th>
              <th className="py-2 px-4 text-left">Tarih</th>
              <th className="py-2 px-4 text-left">Durum</th>
              <th className="py-2 px-4 text-left">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-8">Yükleniyor...</td></tr>
            ) : reservations.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8 text-gray-400">Henüz rezervasyon yok.</td></tr>
            ) : reservations.map(r => (
              <tr key={r.id} className="border-b hover:bg-blue-50">
                <td className="py-2 px-4">{r.name}</td>
                <td className="py-2 px-4">{r.email}</td>
                <td className="py-2 px-4">{r.phone}</td>
                <td className="py-2 px-4">{r.checkIn.slice(0,10)}</td>
                <td className="py-2 px-4">{r.checkOut.slice(0,10)}</td>
                <td className="py-2 px-4">{r.guests}</td>
                <td className="py-2 px-4">{r.message}</td>
                <td className="py-2 px-4 text-xs text-gray-500">{new Date(r.createdAt).toLocaleString('tr-TR')}</td>
                <td className="py-2 px-4">
                  <select
                    value={r.status}
                    onChange={e => handleStatusChange(r.id, e.target.value)}
                    className={`px-2 py-1 rounded border ${r.status === 'approved' ? 'bg-green-100' : r.status === 'cancelled' ? 'bg-red-100' : 'bg-yellow-100'}`}
                  >
                    <option value="pending">Beklemede</option>
                    <option value="approved">Onaylandı</option>
                    <option value="cancelled">İptal</option>
                  </select>
                </td>
                <td className="py-2 px-4">
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(r.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 