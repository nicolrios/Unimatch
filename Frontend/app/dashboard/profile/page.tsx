"use client"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

export default function ProfilePage() {
  const { user } = useUser()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    university: "",
    career: "",
    topics: "" // Manejaremos esto como string separado por comas
  })

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    
    // Convertimos el string de temas a un array limpio
    const topicsArray = formData.topics.split(",").map(t => t.trim()).filter(t => t !== "")

    try {
      const res = await fetch("https://unimatch-backend-vy3b.onrender.com/api/profile/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          name: user.fullName,
          imageUrl: user.imageUrl,
          university: formData.university,
          career: formData.career,
          topics: topicsArray
        })
      })

      if (res.ok) alert("✅ Perfil sincronizado en la red UniMatch")
      else alert("❌ Error en el servidor")
    } catch (error) {
      alert("❌ No se pudo conectar con el servidor")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-400">Mi Perfil Universitario</h1>
      <input 
        className="w-full p-3 bg-gray-900 border border-blue-500/30 rounded" 
        placeholder="Universidad" 
        onChange={(e) => setFormData({...formData, university: e.target.value})}
      />
      <input 
        className="w-full p-3 bg-gray-900 border border-blue-500/30 rounded" 
        placeholder="Carrera" 
        onChange={(e) => setFormData({...formData, career: e.target.value})}
      />
      <textarea 
        className="w-full p-3 bg-gray-900 border border-blue-500/30 rounded" 
        placeholder="Temas de interés (separados por coma)" 
        onChange={(e) => setFormData({...formData, topics: e.target.value})}
      />
      <button 
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
      >
        {saving ? "SINCRONIZANDO..." : "GUARDAR CAMBIOS"}
      </button>
    </div>
  )
}