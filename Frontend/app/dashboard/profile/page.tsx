"use client"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

export default function ProfilePage() {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ university: "UNDEC", career: "Ingeniería en Sistemas", bio: "¡Hola! Configurando nodo...", topics: "UML, CÁLCULO" })

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-10 flex justify-center items-center relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-pink-600/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px]" />

      <div className="w-full max-w-5xl bg-[#0a0f1a]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 relative z-10 shadow-2xl">
        <div className="flex justify-between items-start mb-12">
          <div>
            <span className="text-[10px] font-black text-pink-500 tracking-[0.4em] uppercase">Módulo de Usuario</span>
            <h1 className="text-5xl font-black italic tracking-tighter mt-2">Mi <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-400">Perfil</span></h1>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className="bg-gradient-to-r from-pink-600 to-violet-600 px-8 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-lg shadow-pink-900/20">
            {isEditing ? "Aceptar Cambios" : "Editar Nodo"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-blue-500 rounded-[2.5rem] blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <img src={user?.imageUrl} className="relative w-56 h-56 rounded-[2.5rem] object-cover border border-white/10" />
          </div>

          <div className="flex-1 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Universidad</p>
                {isEditing ? <input className="w-full bg-white/5 border border-white/10 p-3 rounded-xl" value={form.university} /> : <p className="text-xl font-bold">{form.university}</p>}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Carrera</p>
                {isEditing ? <input className="w-full bg-white/5 border border-white/10 p-3 rounded-xl" value={form.career} /> : <p className="text-xl font-bold">{form.career}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocolo de Información</p>
              <p className="text-gray-400 italic font-medium leading-relaxed">"{form.bio}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}