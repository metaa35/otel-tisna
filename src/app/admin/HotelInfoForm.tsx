"use client"

import { useEffect, useState } from "react"

export default function HotelInfoForm() {
  const [hotel, setHotel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetch("/api/admin/hotel")
      .then((res) => res.json())
      .then((data) => {
        setHotel(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHotel({ ...hotel, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/admin/hotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hotel),
      })
      if (res.ok) {
        setSuccess("Başarıyla kaydedildi!")
      } else {
        setError("Bir hata oluştu.")
      }
    } catch {
      setError("Bir hata oluştu.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Otel Bilgileri</h2>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <div>
        <label className="block font-medium">Otel Adı</label>
        <input name="name" value={hotel?.name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div>
        <label className="block font-medium">Açıklama</label>
        <textarea name="description" value={hotel?.description || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div>
        <label className="block font-medium">Adres</label>
        <input name="address" value={hotel?.address || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div>
        <label className="block font-medium">Telefon</label>
        <input name="phone" value={hotel?.phone || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div>
        <label className="block font-medium">E-posta</label>
        <input name="email" value={hotel?.email || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div>
        <label className="block font-medium">Instagram</label>
        <input name="instagram" value={hotel?.instagram || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label className="block font-medium">Facebook</label>
        <input name="facebook" value={hotel?.facebook || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label className="block font-medium">WhatsApp</label>
        <input name="whatsapp" value={hotel?.whatsapp || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? "Kaydediliyor..." : "Kaydet"}</button>
    </form>
  )
} 