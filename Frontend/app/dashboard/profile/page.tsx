"use client"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

export default function ProfilePage() {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    university: "UNDEC",
    career: "Ingeniería en Sistemas",
    bio: "¡Hola! Estoy configurando mi perfil.",
    topics: "PROGRAMACIÓN, CÁLCULO, UML"
  })

  const handleSave = async () => {
    setLoading(true)
    const topicsArray = form.topics.split(",").map(t => t.trim().toUpperCase())
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
          topics: topicsArray,
          bio: form.bio
        }),
      })
      setIsEditing(false)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto flex justify-between items-end mb-10">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-blue-400 font-black mb-2">🛡️ PERFIL VERIFICADO UNIMATCH</p>
          <h1 className="text-5xl font-black italic">Mi <span className="text-blue-500">Perfil</span></h1>
        </div>
        <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="bg-blue-600 px-8 py-2 rounded-xl font-bold uppercase text-xs tracking-widest">
          {loading ? "GUARDANDO..." : isEditing ? "GUARDAR" : "EDITAR DATOS"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-[#0a0f1a] rounded-[2rem] p-10 border border-white/5 mb-8 flex flex-col md:flex-row gap-10 items-center">
        <img src={user?.imageUrl} className="w-40 h-40 rounded-[2rem] border border-blue-500/30 shadow-xl" />
        <div className="flex-1 space-y-4">
          <h2 className="text-4xl font-bold">{user?.fullName}</h2>
          <div className="flex gap-3">
            <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-[10px] font-bold text-blue-400">
              {isEditing ? <input className="bg-transparent outline-none" value={form.university} onChange={e => setForm({...form, university: e.target.value})} /> : form.university}
            </span>
            <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Nivel 1 Estudiante</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-[#0a0f1a] rounded-[2rem] p-10 border border-white/5 mb-8">
        <h3 className="text-blue-400 text-[10px] font-black tracking-widest mb-6 uppercase">Protocolo de Información</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Mensaje</p>
            {isEditing ? <textarea className="w-full bg-white/5 border border-white/10 p-3 rounded-lg" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} /> : <p className="text-gray-300 italic">"{form.bio}"</p>}
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Id Estudiantil</p>
              <p className="text-sm font-bold">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Carrera</p>
              {isEditing ? <input className="w-full bg-white/5 border border-white/10 p-2 rounded-lg" value={form.career} onChange={e => setForm({...form, career: e.target.value})} /> : <p className="text-sm font-bold">{form.career}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-[#0a0f1a] rounded-[2rem] p-10 border border-white/5">
        <h3 className="text-blue-400 text-[10px] font-black tracking-widest mb-6 uppercase">Nodos de Interés</h3>
        {isEditing ? <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-blue-400 font-bold" value={form.topics} onChange={e => setForm({...form, topics: e.target.value})} /> : 
          <div className="flex flex-wrap gap-4">
            {form.topics.split(",").map((t, i) => <span key={i} className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl text-[10px] font-black text-blue-400 tracking-widest uppercase">{t.trim()}</span>)}
          </div>
        }
      </div>
    </div>
  )
}