"use client"
import { useEffect, useState } from "react"

interface User {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchUsers = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/user")
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Kullanıcıyı silmek istediğinize emin misiniz?")) return
    const res = await fetch("/api/admin/user", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    if (res.ok) {
      setSuccess("Kullanıcı silindi!")
      fetchUsers()
    } else {
      setError("Bir hata oluştu.")
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    const res = await fetch("/api/admin/user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) {
      setSuccess("Kullanıcı eklendi!")
      setForm({ name: "", email: "", password: "", role: "admin" })
      fetchUsers()
    } else {
      setError("Bir hata oluştu.")
    }
    setSaving(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-700">Kullanıcılar</h2>
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6 shadow flex flex-col gap-3 max-w-lg">
        <div className="flex gap-2">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Ad Soyad" className="border rounded px-3 py-2 flex-1" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="E-posta" type="email" className="border rounded px-3 py-2 flex-1" required />
        </div>
        <div className="flex gap-2">
          <input name="password" value={form.password} onChange={handleChange} placeholder="Şifre" type="password" className="border rounded px-3 py-2 flex-1" required />
          <select name="role" value={form.role} onChange={handleChange} className="border rounded px-3 py-2 flex-1">
            <option value="admin">Admin</option>
            <option value="editor">Editör</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? "Kaydediliyor..." : "Ekle"}</button>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-blue-50">
              <th className="py-2 px-4 text-left">Ad Soyad</th>
              <th className="py-2 px-4 text-left">E-posta</th>
              <th className="py-2 px-4 text-left">Rol</th>
              <th className="py-2 px-4 text-left">Kayıt Tarihi</th>
              <th className="py-2 px-4 text-left">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8">Yükleniyor...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Henüz kullanıcı yok.</td></tr>
            ) : users.map(u => (
              <tr key={u.id} className="border-b hover:bg-blue-50">
                <td className="py-2 px-4">{u.name}</td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4">{u.role}</td>
                <td className="py-2 px-4 text-xs text-gray-500">{new Date(u.createdAt).toLocaleString('tr-TR')}</td>
                <td className="py-2 px-4">
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(u.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 