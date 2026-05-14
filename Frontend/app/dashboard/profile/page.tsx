"use client"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Estado con tus datos y los TEMAS DE INTERÉS
  const [form, setForm] = useState({ 
    university: "UNDEC", 
    career: "Ingeniería en Sistemas", 
    bio: "¡Hola! Configurando mi nodo en la red UniMatch.", 
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
    } catch (error) {
      console.error("Error al sincronizar:", error)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Luces de fondo dinámicas */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-pink-500 font-black mb-2 uppercase">Identidad de Red Verificada</p>
            <h1 className="text-6xl font-black italic tracking-tighter">Mi <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500">Perfil</span></h1>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
            className="bg-gradient-to-r from-pink-600 to-violet-600 hover:from-blue-600 hover:to-blue-500 px-10 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all duration-500 shadow-lg shadow-pink-900/20"
          >
            {loading ? "Sincronizando..." : isEditing ? "Aceptar Cambios" : "Editar Nodo"}
          </button>
        </div>

        {/* TARJETA PRINCIPAL */}
        <div className="bg-[#0a0f1a]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 mb-8 flex flex-col md:flex-row gap-12 items-center hover:border-pink-500/20 transition-all duration-500">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-pink-500 to-blue-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
            <img src={user?.imageUrl} className="relative w-48 h-48 rounded-[2.5rem] object-cover border-2 border-white/10" />
          </div>
          
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-4xl font-black">{user?.fullName}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="bg-white/5 border border-white/10 px-5 py-2 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-widest">
                {isEditing ? <input className="bg-transparent outline-none border-b border-blue-500/50" value={form.university} onChange={e => setForm({...form, university: e.target.value})} /> : form.university}
              </span>
              <span className="bg-white/5 border border-white/10 px-5 py-2 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">Nivel 1 Estudiante</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PROTOCOLO DE INFORMACIÓN */}
          <div className="bg-[#0a0f1a] border border-white/5 rounded-[2.5rem] p-10">
            <h3 className="text-violet-400 text-[10px] font-black tracking-widest mb-8 uppercase">Protocolo de Información</h3>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] text-gray-600 font-black uppercase mb-2">Mensaje / Bio</p>
                {isEditing ? 
                  <textarea className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} /> 
                  : <p className="text-gray-300 italic leading-relaxed text-sm">"{form.bio}"</p>
                }
              </div>
              <div>
                <p className="text-[10px] text-gray-600 font-black uppercase mb-2">Especialidad Académica</p>
                {isEditing ? 
                  <input className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm" value={form.career} onChange={e => setForm({...form, career: e.target.value})} /> 
                  : <p className="text-sm font-bold text-pink-500 uppercase">{form.career}</p>
                }
              </div>
            </div>
          </div>

          {/* TEMAS DE INTERÉS (Aquí están de vuelta, socio) */}
          <div className="bg-[#0a0f1a] border border-white/5 rounded-[2.5rem] p-10 shadow-[0_0_40px_rgba(37,99,235,0.03)]">
            <h3 className="text-blue-400 text-[10px] font-black tracking-widest mb-8 uppercase">Nodos de Interés Académico</h3>
            {isEditing ? (
              <div className="space-y-4">
                <p className="text-[9px] text-gray-600 uppercase font-black">Separa los temas por comas</p>
                <input 
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-blue-400 font-black uppercase text-xs" 
                  value={form.topics} 
                  onChange={e => setForm({...form, topics: e.target.value})}
                  placeholder="EJ: CÁLCULO, SQL, JAVA..."
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {form.topics.split(",").map((t, i) => (
                  <span key={i} className="px-5 py-2 bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-300 uppercase tracking-widest">
                    {t.trim()}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-10 text-[9px] text-gray-700 font-medium leading-tight">
              * Estos nodos determinan tu posición en la red y optimizan tus sugerencias de match.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}