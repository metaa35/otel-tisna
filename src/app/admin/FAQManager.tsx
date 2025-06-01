"use client"
import { useEffect, useState } from "react"

interface FAQ {
  id: number
  question: string
  answer: string
}

export default function FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [form, setForm] = useState({ question: "", answer: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchFaqs = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/faq")
      const data = await res.json()
      if (Array.isArray(data)) {
        setFaqs(data)
      } else {
        setError("SSS verileri yüklenemedi.")
        setFaqs([])
      }
    } catch (e) {
      setError("SSS verileri yüklenemedi.")
      setFaqs([])
    }
    setLoading(false)
  }

  useEffect(() => { fetchFaqs() }, [])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleEdit = (faq: FAQ) => {
    setEditing(faq)
    setForm({ question: faq.question, answer: faq.answer })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("SSS öğesini silmek istediğinize emin misiniz?")) return
    await fetch("/api/admin/faq", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    fetchFaqs()
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    const payload: { question: string; answer: string; id?: number } = { ...form }
    if (editing) payload.id = editing.id
    const res = await fetch("/api/admin/faq", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    if (res.ok) {
      setSuccess(editing ? "SSS güncellendi!" : "SSS eklendi!")
      setForm({ question: "", answer: "" })
      setEditing(null)
      fetchFaqs()
    } else {
      setError("Bir hata oluştu.")
    }
    setSaving(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-700">SSS Yönetimi</h2>
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6 shadow flex flex-col gap-3">
        <input name="question" value={form.question} onChange={handleChange} placeholder="Soru" className="border rounded px-3 py-2" required />
        <textarea name="answer" value={form.answer} onChange={handleChange} placeholder="Cevap" className="border rounded px-3 py-2" required />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? "Kaydediliyor..." : (editing ? "Güncelle" : "Ekle")}</button>
          {editing && <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ question: "", answer: "" }) }}>Vazgeç</button>}
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </form>
      <div className="grid gap-4">
        {loading ? <div>Yükleniyor...</div> : error ? (
          <div className="text-red-600">{error}</div>
        ) : faqs.length > 0 ? (
          faqs.map(faq => (
            <div key={faq.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
              <div className="font-bold text-lg">{faq.question}</div>
              <div className="text-gray-600">{faq.answer}</div>
              <div className="flex gap-2 mt-2">
                <button className="text-blue-600 hover:underline" onClick={() => handleEdit(faq)}>Düzenle</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(faq.id)}>Sil</button>
              </div>
            </div>
          ))
        ) : (
          <div>Henüz SSS bulunmuyor.</div>
        )}
      </div>
    </div>
  )
} 