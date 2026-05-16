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
    bio: "Explorando las fronteras de la tecnología y el desarrollo de software.", 
    topics: "PROGRAMACIÓN, CÁLCULO, UML, IA" 
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
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Atmósfera de fondo */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,1)_0%,_rgba(5,7,10,1)_100%)]" />
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">
            Mi <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500">Perfil</span>
          </h1>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="group relative px-8 py-3 overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all hover:border-pink-500/50"
          >
            <span className="relative z-10 text-[10px] font-black tracking-[0.2em] uppercase">
              {loading ? "PROCESANDO..." : isEditing ? "GUARDAR CAMBIOS" : "MODIFICAR DATOS"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Tarjeta Principal de Identidad */}
        <div className="relative mb-10 group">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded-[3rem]" />
          <div className="relative bg-[#0a0f1a]/60 backdrop-blur-2xl rounded-[3rem] p-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-pink-500 to-blue-500 rounded-[2.5rem] blur-xl opacity-20" />
              
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-black mb-4 tracking-tight">{user?.fullName}</h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{form.university}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos de Información y Temas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Módulo: Información */}
          <div className="group relative">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem]" />
            <div className="relative bg-[#0a0f1a]/80 backdrop-blur-xl p-10 rounded-[2.5rem] h-full transition-all group-hover:bg-[#0d1424]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-4 bg-pink-500 rounded-full" />
                <h3 className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400">Información</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-3">Mensaje Personal</p>
                  {isEditing ? (
                    <textarea 
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:border-pink-500/50 outline-none transition-all"
                      value={form.bio}
                      onChange={e => setForm({...form, bio: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm text-gray-300 leading-relaxed font-medium italic">"{form.bio}"</p>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5">
                  <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-3">Especialidad Académica</p>
                  {isEditing ? (
                    <input 
                      className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none focus:border-blue-500/50"
                      value={form.career}
                      onChange={e => setForm({...form, career: e.target.value})}
                    />
                  ) : (
                    <div className="inline-block px-5 py-2 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-sm font-bold text-gray-200">{form.career}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Módulo: Temas de Interés */}
          <div className="group relative">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem]" />
            <div className="relative bg-[#0a0f1a]/80 backdrop-blur-xl p-10 rounded-[2.5rem] h-full transition-all group-hover:bg-[#0d1424]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                <h3 className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400">Temas de Interés</h3>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <p className="text-[9px] text-gray-500 uppercase font-black">Editor de Nodos (Separa por comas)</p>
                  <input 
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xs font-black uppercase text-blue-400 outline-none"
                    value={form.topics}
                    onChange={e => setForm({...form, topics: e.target.value})}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {form.topics.split(",").map((t, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-2xl group/topic hover:border-blue-500/30 transition-all">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">{t.trim()}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-12 p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                <p className="text-[9px] text-gray-500 leading-tight">
                  La red utiliza estos parámetros para establecer puentes de compatibilidad con otros perfiles académicos.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}