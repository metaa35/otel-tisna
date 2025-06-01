"use client"
import { useEffect, useState } from "react"

interface GalleryImage {
  id: number
  title: string
  image: string
}

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [editing, setEditing] = useState<GalleryImage | null>(null)
  const [form, setForm] = useState({ title: "", image: null as File | null })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchImages = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/gallery")
      const data = await res.json()
      if (Array.isArray(data)) {
        setImages(data)
      } else {
        setError("Görseller yüklenemedi.")
        setImages([])
      }
    } catch (e) {
      setError("Görseller yüklenemedi.")
      setImages([])
    }
    setLoading(false)
  }

  useEffect(() => { fetchImages() }, [])

  const handleChange = (e: any) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] })
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setEditing(image)
    setForm({ title: image.title, image: null })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Görseli silmek istediğinize emin misiniz?")) return
    await fetch("/api/admin/gallery", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    fetchImages()
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    const formData = new FormData()
    formData.append("title", form.title)
    if (form.image) {
      formData.append("image", form.image)
    }
    if (editing) {
      formData.append("id", editing.id.toString())
    }
    const res = await fetch("/api/admin/gallery", { method: "POST", body: formData })
    if (res.ok) {
      setSuccess(editing ? "Görsel güncellendi!" : "Görsel eklendi!")
      setForm({ title: "", image: null })
      setEditing(null)
      fetchImages()
    } else {
      setError("Bir hata oluştu.")
    }
    setSaving(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-700">Galeri Yönetimi</h2>
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6 shadow flex flex-col gap-3">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Görsel Başlığı" className="border rounded px-3 py-2" required />
        <input name="image" type="file" onChange={handleChange} className="border rounded px-3 py-2" required />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? "Kaydediliyor..." : (editing ? "Güncelle" : "Ekle")}</button>
          {editing && <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ title: "", image: null }) }}>Vazgeç</button>}
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </form>
      <div className="grid md:grid-cols-3 gap-4">
        {loading ? <div>Yükleniyor...</div> : error ? (
          <div className="text-red-600">{error}</div>
        ) : images.length > 0 ? (
          images.map(image => (
            <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={image.image} alt={image.title} className="w-full h-48 object-cover" />
              <div className="p-4 flex flex-col gap-2">
                <div className="font-bold text-lg">{image.title}</div>
                <div className="flex gap-2 mt-2">
                  <button className="text-blue-600 hover:underline" onClick={() => handleEdit(image)}>Düzenle</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(image.id)}>Sil</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Henüz görüntü bulunmuyor.</div>
        )}
      </div>
    </div>
  )
} 