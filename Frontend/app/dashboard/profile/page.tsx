"use client"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

export default function ProfilePage() {
  const { user } = useUser()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ university: '', career: '', topics: '' })

  const handleSave = async () => {
    setSaving(true)
    const topicsArray = form.topics.split(",").map(t => t.trim())
    try {
      await fetch("https://unimatch-backend-vy3b.onrender.com/api/profile/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id,
          name: user?.fullName,
          imageUrl: user?.imageUrl,
          university: form.university,
          career: form.career,
          topics: topicsArray
        })
      })
      alert("✅ Datos sincronizados")
    } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-4 md:p-10 flex justify-center items-center">
      <div className="relative w-full max-w-5xl bg-[#0a0f1a]/80 backdrop-blur-2xl border border-blue-500/30 rounded-[2.5rem] shadow-[0_0_80px_-15px_rgba(59,130,246,0.3)] overflow-hidden">
        
        {/* Efectos de Luces de Neón */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />

        <div className="relative z-10 flex flex-col md:flex-row">
          <div className="md:w-1/3 p-10 flex flex-col items-center border-b md:border-b-0 md:border-r border-white/5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
              <img src={user?.imageUrl} className="relative w-44 h-44 rounded-3xl object-cover border border-white/10" />
            </div>
            <h2 className="mt-8 text-2xl font-black tracking-tight">{user?.fullName}</h2>
            <div className="mt-4 px-4 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold rounded-full tracking-widest uppercase">
              Sistema Activo
            </div>
          </div>

          <div className="md:w-2/3 p-10 md:p-14 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Campus / Universidad</label>
                <input onChange={e => setForm({...form, university: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all shadow-inner" placeholder="UNdeC" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Cortex / Especialidad</label>
                <input onChange={e => setForm({...form, career: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all" placeholder="Sistemas" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Módulos de Conocimiento</label>
              <textarea onChange={e => setForm({...form, topics: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-32 focus:border-blue-500 outline-none transition-all resize-none" placeholder="IA, React, UI/UX..." />
            </div>

            <button onClick={handleSave} disabled={saving} className="relative w-full group py-4 rounded-2xl font-black tracking-[0.3em] text-xs transition-all overflow-hidden bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              {saving ? "SINCRONIZANDO..." : "GUARDAR CAMBIOS"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}