"use client"
import { useState } from "react"

export default function ReservationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guests: form.guests,
      message: form.message
    }

    try {
      const res = await fetch("/api/admin/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || data.error || "Rezervasyon işlemi başarısız oldu.")
      }

      setSuccess("Rezervasyon talebiniz başarıyla iletildi!")
      setForm({ name: "", email: "", phone: "", checkIn: "", checkOut: "", guests: 1, message: "" })
    } catch (err) {
      setError("Hata: " + (err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu."))
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl max-w-2xl mx-auto flex flex-col gap-4">
      <h3 className="text-2xl font-bold mb-2 text-white">Rezervasyon Yap</h3>
      {success && <div className="text-green-400 font-semibold">{success}</div>}
      {error && <div className="text-red-400 font-semibold">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Ad Soyad" className="px-4 py-3 rounded bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-blue-400" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="E-posta" type="email" className="px-4 py-3 rounded bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-blue-400" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefon" className="px-4 py-3 rounded bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-blue-400" required />
        <input name="guests" value={form.guests} onChange={handleChange} placeholder="Kişi Sayısı" type="number" min={1} max={10} className="px-4 py-3 rounded bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-blue-400" required />
        <input name="checkIn" value={form.checkIn} onChange={handleChange} placeholder="Giriş Tarihi" type="date" className="px-4 py-3 rounded bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-blue-400" required />
        <input name="checkOut" value={form.checkOut} onChange={handleChange} placeholder="Çıkış Tarihi" type="date" className="px-4 py-3 rounded bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-blue-400" required />
      </div>
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Eklemek istediğiniz not..." className="px-4 py-3 rounded bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-blue-400" rows={3} />
      <button type="submit" disabled={loading} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all">
        {loading ? "Gönderiliyor..." : "Rezervasyon Yap"}
      </button>
    </form>
  )
} 