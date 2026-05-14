"use client"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

export default function ProfilePage() {
  const { user } = useUser()
  const [saving, setSaving] = useState(false)

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header con gradiente */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 opacity-80" />
        
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <img src={user?.imageUrl} className="w-32 h-32 rounded-2xl border-4 border-[#05070a] shadow-xl" />
            <div className="absolute bottom-0 left-24 bg-green-500 w-6 h-6 rounded-full border-4 border-[#05070a]" />
          </div>

          <h1 className="text-3xl font-bold">{user?.fullName}</h1>
          <p className="text-blue-400 mb-8 font-mono tracking-widest">ESTUDIANTE VERIFICADO</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-xs font-bold text-gray-400 uppercase">Universidad</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-blue-500 outline-none transition-all" placeholder="Ej: UNdeC" />
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-bold text-gray-400 uppercase">Especialidad</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-blue-500 outline-none transition-all" placeholder="Ej: Ingeniería en Sistemas" />
            </div>
          </div>

          <button onClick={() => alert('Guardando...')} className="mt-10 w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all">
            ACTUALIZAR NODO CENTRAL
          </button>
        </div>
      </div>
    </div>
  )
}