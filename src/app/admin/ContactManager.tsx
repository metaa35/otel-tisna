"use client"
import { useEffect, useState } from "react"

interface ContactInfo {
  id: number
  title: string
  value: string
  icon?: string
}

export default function ContactManager() {
  const [contacts, setContacts] = useState<ContactInfo[]>([])
  const [editing, setEditing] = useState<ContactInfo | null>(null)
  const [form, setForm] = useState({ title: "", value: "", icon: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchContacts = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/contact")
    const data = await res.json()
    setContacts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchContacts() }, [])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleEdit = (contact: ContactInfo) => {
    setEditing(contact)
    setForm({ title: contact.title, value: contact.value, icon: contact.icon || "" })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("İletişim bilgisini silmek istediğinize emin misiniz?")) return
    await fetch("/api/admin/contact", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    fetchContacts()
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    const payload: { title: string; value: string; icon?: string; id?: number } = { ...form }
    if (editing) payload.id = editing.id
    const res = await fetch("/api/admin/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    if (res.ok) {
      setSuccess(editing ? "İletişim bilgisi güncellendi!" : "İletişim bilgisi eklendi!")
      setForm({ title: "", value: "", icon: "" })
      setEditing(null)
      fetchContacts()
    } else {
      setError("Bir hata oluştu.")
    }
    setSaving(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-700">İletişim Bilgileri Yönetimi</h2>
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6 shadow flex flex-col gap-3">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Başlık" className="border rounded px-3 py-2" required />
        <input name="value" value={form.value} onChange={handleChange} placeholder="Değer" className="border rounded px-3 py-2" required />
        <input name="icon" value={form.icon} onChange={handleChange} placeholder="İkon (isteğe bağlı)" className="border rounded px-3 py-2" />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? "Kaydediliyor..." : (editing ? "Güncelle" : "Ekle")}</button>
          {editing && <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ title: "", value: "", icon: "" }) }}>Vazgeç</button>}
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </form>
      <div className="grid gap-4">
        {loading ? <div>Yükleniyor...</div> : (Array.isArray(contacts) ? contacts : []).map(contact => (
          <div key={contact.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="font-bold text-lg">{contact.title}</div>
            <div className="text-gray-600">{contact.value}</div>
            {contact.icon && <div className="text-gray-500">{contact.icon}</div>}
            <div className="flex gap-2 mt-2">
              <button className="text-blue-600 hover:underline" onClick={() => handleEdit(contact)}>Düzenle</button>
              <button className="text-red-600 hover:underline" onClick={() => handleDelete(contact.id)}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 