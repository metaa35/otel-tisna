"use client"
import { useEffect, useState } from "react"

interface Room {
  id: number
  name: string
  description: string
  price: number
  capacity: number
  bedType: string
  size: number
  view: string
  features: string
  badge?: string
  image?: string
}

export default function RoomManager() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [editing, setEditing] = useState<Room | null>(null)
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "",
    bedType: "",
    size: "",
    view: "",
    features: "",
    badge: "",
    image: null as File | null
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchRooms = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/room")
      const data = await res.json()
      if (Array.isArray(data)) {
        setRooms(data)
      } else {
        setError("Odalar yüklenemedi.")
        setRooms([])
      }
    } catch (e) {
      setError("Odalar yüklenemedi.")
      setRooms([])
    }
    setLoading(false)
  }

  useEffect(() => { fetchRooms() }, [])

  const handleChange = (e: any) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] })
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
  }

  const handleEdit = (room: Room) => {
    setEditing(room)
    setForm({
      name: room.name,
      description: room.description,
      price: room.price.toString(),
      capacity: room.capacity?.toString() || "",
      bedType: room.bedType || "",
      size: room.size?.toString() || "",
      view: room.view || "",
      features: room.features || "",
      badge: room.badge || "",
      image: null
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Odayı silmek istediğinize emin misiniz?")) return
    await fetch("/api/admin/room", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    fetchRooms()
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("description", form.description)
    formData.append("price", form.price)
    formData.append("capacity", form.capacity)
    formData.append("bedType", form.bedType)
    formData.append("size", form.size)
    formData.append("view", form.view)
    formData.append("features", form.features)
    formData.append("badge", form.badge)
    if (form.image) {
      formData.append("image", form.image)
    }
    if (editing) {
      formData.append("id", editing.id.toString())
    }
    const res = await fetch("/api/admin/room", { method: "POST", body: formData })
    const result = await res.json()
    if (res.ok) {
      setSuccess(editing ? "Oda güncellendi!" : "Oda eklendi!")
      setForm({ name: "", description: "", price: "", capacity: "", bedType: "", size: "", view: "", features: "", badge: "", image: null })
      setEditing(null)
      fetchRooms()
    } else {
      setError(result.error || "Bir hata oluştu.")
    }
    setSaving(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-700">Oda Yönetimi</h2>
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6 shadow flex flex-col gap-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Oda Adı" className="border rounded px-3 py-2" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Açıklama" className="border rounded px-3 py-2" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Fiyat" type="number" min="0" step="0.01" className="border rounded px-3 py-2" required />
        <input name="capacity" value={form.capacity} onChange={handleChange} placeholder="Kapasite (Kişi Sayısı)" type="number" min="1" className="border rounded px-3 py-2" required />
        <input name="bedType" value={form.bedType} onChange={handleChange} placeholder="Yatak Tipi (örn: Double, King)" className="border rounded px-3 py-2" required />
        <input name="size" value={form.size} onChange={handleChange} placeholder="Oda Büyüklüğü (m²)" type="number" min="1" className="border rounded px-3 py-2" required />
        <input name="view" value={form.view} onChange={handleChange} placeholder="Manzara (örn: Garden, Sea)" className="border rounded px-3 py-2" required />
        <input name="features" value={form.features} onChange={handleChange} placeholder="Özellikler (virgülle ayır: WiFi,TV,Minibar)" className="border rounded px-3 py-2" required />
        <input name="badge" value={form.badge} onChange={handleChange} placeholder="Rozet (örn: Popüler, Yeni)" className="border rounded px-3 py-2" />
        <input name="image" type="file" onChange={handleChange} className="border rounded px-3 py-2" />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? "Kaydediliyor..." : (editing ? "Güncelle" : "Ekle")}</button>
          {editing && <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ name: "", description: "", price: "", capacity: "", bedType: "", size: "", view: "", features: "", badge: "", image: null }) }}>Vazgeç</button>}
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </form>
      <div className="grid md:grid-cols-2 gap-4">
        {loading ? <div>Yükleniyor...</div> : error ? (
          <div className="text-red-600">{error}</div>
        ) : rooms.length > 0 ? (
          rooms.map(room => (
            <div key={room.id} className="bg-white rounded-lg shadow overflow-hidden">
              {room.image && <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />}
              <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-lg">{room.name}</div>
                  <div className="text-blue-700 font-semibold">{room.price} ₺</div>
                </div>
                <div className="text-gray-600 text-sm">{room.description}</div>
                <div className="flex gap-2 mt-2">
                  <button className="text-blue-600 hover:underline" onClick={() => handleEdit(room)}>Düzenle</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(room.id)}>Sil</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Henüz oda bulunmuyor.</div>
        )}
      </div>
    </div>
  )
} 