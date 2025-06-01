"use client"
import { useEffect, useState } from "react"
import { FaWifi, FaParking, FaSwimmer, FaUtensils, FaSpa, FaShuttleVan, FaDumbbell, FaTv, FaCoffee, FaConciergeBell } from 'react-icons/fa'

interface Service {
  id: number
  name: string
  description: string
  image?: string
  icon?: string
}

const ICON_OPTIONS = [
  { value: 'FaWifi', label: 'WiFi', icon: <FaWifi /> },
  { value: 'FaParking', label: 'Otopark', icon: <FaParking /> },
  { value: 'FaSwimmer', label: 'Havuz', icon: <FaSwimmer /> },
  { value: 'FaUtensils', label: 'Restoran', icon: <FaUtensils /> },
  { value: 'FaSpa', label: 'Spa', icon: <FaSpa /> },
  { value: 'FaShuttleVan', label: 'Servis', icon: <FaShuttleVan /> },
  { value: 'FaDumbbell', label: 'Fitness', icon: <FaDumbbell /> },
  { value: 'FaTv', label: 'TV', icon: <FaTv /> },
  { value: 'FaCoffee', label: 'Kahve', icon: <FaCoffee /> },
  { value: 'FaConciergeBell', label: 'Oda Servisi', icon: <FaConciergeBell /> },
]

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState({ name: "", description: "", image: null as File | null, icon: "FaWifi" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchServices = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/service")
    const data = await res.json()
    setServices(data)
    setLoading(false)
  }

  useEffect(() => { fetchServices() }, [])

  const handleChange = (e: any) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] })
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
  }

  const handleEdit = (service: Service) => {
    setEditing(service)
    setForm({ name: service.name, description: service.description, image: null, icon: service.icon || "FaWifi" })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Hizmeti silmek istediğinize emin misiniz?")) return
    await fetch("/api/admin/service", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    fetchServices()
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("description", form.description)
    formData.append("icon", form.icon)
    if (form.image) {
      formData.append("image", form.image)
    }
    if (editing) {
      formData.append("id", editing.id.toString())
    }
    const res = await fetch("/api/admin/service", { method: "POST", body: formData })
    if (res.ok) {
      setSuccess(editing ? "Hizmet güncellendi!" : "Hizmet eklendi!")
      setForm({ name: "", description: "", image: null, icon: "FaWifi" })
      setEditing(null)
      fetchServices()
    } else {
      setError("Bir hata oluştu.")
    }
    setSaving(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-700">Hizmet Yönetimi</h2>
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6 shadow flex flex-col gap-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Hizmet Adı" className="border rounded px-3 py-2" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Açıklama" className="border rounded px-3 py-2" required />
        <select name="icon" value={form.icon} onChange={handleChange} className="border rounded px-3 py-2" required>
          {ICON_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="flex gap-2 items-center mb-2">
          {ICON_OPTIONS.find(opt => opt.value === form.icon)?.icon}
          <span className="text-gray-500 text-sm">Seçili ikon</span>
        </div>
        <input name="image" type="file" onChange={handleChange} className="border rounded px-3 py-2" />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? "Kaydediliyor..." : (editing ? "Güncelle" : "Ekle")}</button>
          {editing && <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ name: "", description: "", image: null, icon: "FaWifi" }) }}>Vazgeç</button>}
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </form>
      <div className="grid md:grid-cols-2 gap-4">
        {loading ? <div>Yükleniyor...</div> : (Array.isArray(services) ? services.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow overflow-hidden">
            {service.image && <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />}
            <div className="p-4 flex flex-col gap-2">
              <div className="font-bold text-lg">{service.name}</div>
              <div className="text-gray-600 text-sm">{service.description}</div>
              <div className="flex gap-2 mt-2">
                <button className="text-blue-600 hover:underline" onClick={() => handleEdit(service)}>Düzenle</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(service.id)}>Sil</button>
              </div>
            </div>
          </div>
        )) : <div>Servisler bulunamadı.</div>)}
      </div>
    </div>
  )
} 