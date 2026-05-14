"use client"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Estado con tu estructura original
  const [formData, setFormData] = useState({
    university: "UNDEC",
    career: "Ingeniería en Sistemas",
    bio: "¡Hola! Estoy configurando mi perfil.",
    topics: "PROGRAMACIÓN, CÁLCULO, UML"
  })

  const handleSave = async () => {
    setLoading(true)
    const topicsArray = formData.topics.split(",").map(t => t.trim().toUpperCase())
    
    try {
      await fetch("https://unimatch-backend-vy3b.onrender.com/api/profile/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id,
          name: user?.fullName,
          imageUrl: user?.imageUrl,
          university: formData.university,
          career: formData.career,
          topics: topicsArray,
          bio: formData.bio
        }),
      })
      setIsEditing(false)
    } catch (error) {
      alert("Error al sincronizar datos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6 md:p-12 font-sans">
      
      {/* HEADER: MI PERFIL */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-cyan-400 font-bold mb-1">🛡️ PERFIL VERIFICADO UNIMATCH</p>
          <h1 className="text-5xl font-black italic">
            Mi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Perfil</span>
          </h1>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="bg-[#1e3a8a] hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold transition-all text-sm uppercase tracking-widest"
        >
          {loading ? "GUARDANDO..." : isEditing ? "ACEPTAR CAMBIOS" : "EDITAR DATOS"}
        </button>
      </div>

      {/* TARJETA CENTRAL: DATOS DE USUARIO */}
      <div className="max-w-4xl mx-auto bg-[#0a0f1a] rounded-[2rem] p-10 border border-white/5 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <img 
            src={user?.imageUrl} 
            className="w-40 h-40 rounded-[2rem] border-2 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
          />
          <div className="space-y-4 text-center md:text-left flex-1">
            <h2 className="text-4xl font-bold text-gray-200">{user?.fullName}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-xs font-bold text-cyan-300">
                📘 {isEditing ? <input className="bg-transparent outline-none" value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} /> : formData.university}
              </span>
              <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-xs font-bold text-gray-400">
                🌐 NIVEL 1 ESTUDIANTE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN: PROTOCOLO DE INFORMACIÓN */}
      <div className="max-w-4xl mx-auto bg-[#0a0f1a] rounded-[2rem] p-10 border border-white/5 mb-8">
        <h3 className="text-cyan-400 text-xs font-black tracking-[0.2em] mb-6 flex items-center gap-2">
          🎛️ PROTOCOLO DE INFORMACIÓN
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Bio / Mensaje</p>
            {isEditing ? 
              <textarea className="w-full bg-white/5 p-3 rounded-lg border border-white/10" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} /> 
              : <p className="text-gray-300 italic font-medium">"{formData.bio}"</p>
            }
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mb-1">Id Estudiantil</p>
              <p className="text-white font-bold">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <div>
              <p className="text-xs text-cyan-500 font-bold uppercase tracking-widest mb-1">Especialidad (Carrera)</p>
              {isEditing ? 
                <input className="w-full bg-white/5 p-2 rounded-lg border border-white/10" value={formData.career} onChange={e => setFormData({...formData, career: e.target.value})} /> 
                : <p className="text-white font-bold">🎓 {formData.career}</p>
              }
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN: NODOS DE INTERÉS */}
      <div className="max-w-4xl mx-auto bg-[#0a0f1a] rounded-[2rem] p-10 border border-white/5">
        <h3 className="text-cyan-400 text-xs font-black tracking-[0.2em] mb-6 flex items-center gap-2">
          📖 NODOS DE INTERÉS
        </h3>
        {isEditing ? (
          <input 
            className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-cyan-400 font-bold" 
            value={formData.topics} 
            onChange={e => setFormData({...formData, topics: e.target.value})}
            placeholder="EJ: PROGRAMACIÓN, CÁLCULO..."
          />
        ) : (
          <div className="flex flex-wrap gap-4">
            {formData.topics.split(",").map((topic, index) => (
              <span key={index} className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl text-xs font-black text-cyan-400 tracking-widest uppercase">
                {topic.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}