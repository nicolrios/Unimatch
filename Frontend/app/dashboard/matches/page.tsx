"use client"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function MatchesPage() {
  const { user } = useUser()
  const [data, setData] = useState({ suggestions: [], requests: [], active: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch(`https://unimatch-backend-vy3b.onrender.com/api/matches/panel/${user.id}`)
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  if (loading) return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-t-pink-500 border-r-violet-500 border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 md:p-10 relative overflow-hidden">
      
      {/* LUCES AMBIENTALES DE LA PÁGINA */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* HEADER ESTÉTICO */}
        <div className="mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/20 mb-4">
            <p className="text-[10px] tracking-[0.4em] text-pink-400 font-black uppercase">Localizador de Conexiones Académicas</p>
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter">
            Mis <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-500 to-blue-400">Matches</span>
          </h1>
        </div>

        {/* SECCIONES DE ESTADO (COLAPSABLES O COMPACTAS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-3xl group hover:border-pink-500/30 transition-all">
            <h3 className="text-pink-500 text-[10px] font-black tracking-widest mb-2 uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]"></span> Matches Confirmados
            </h3>
            <p className="text-xs text-gray-500 italic">No hay conexiones activas en este nodo.</p>
          </div>
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-3xl group hover:border-violet-500/30 transition-all">
            <h3 className="text-violet-500 text-[10px] font-black tracking-widest mb-2 uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_8px_#8b5cf6]"></span> Solicitudes Recibidas
            </h3>
            <p className="text-xs text-gray-500 italic">Sin solicitudes entrantes.</p>
          </div>
        </div>

        {/* GRILLA DE SUGERENCIAS DE RED (INTERACTIVA) */}
        <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
          Sugerencias de <span className="text-blue-400">Red</span>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-blue-400/50 to-transparent"></div>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data.suggestions.length > 0 ? data.suggestions.map((m: any) => (
            <div key={m.id} className="group relative bg-[#0a0f1a] rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
              
              {/* Fondo decorativo interno */}
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="p-8 flex flex-col items-center relative z-10">
                {/* Avatar con Glow */}
                <div className="relative mb-6">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-pink-500 to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <img src={m.imageUrl || "/avatar-placeholder.png"} className="relative w-28 h-28 rounded-3xl object-cover border-2 border-white/10" />
                </div>

                <h3 className="text-xl font-black text-center mb-1 group-hover:text-blue-400 transition-colors">{m.name}</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">{m.career}</p>

                {/* Temas de interés como Tags */}
                <div className="w-full space-y-4 mb-8">
                   <p className="text-[9px] text-gray-600 font-black uppercase text-center tracking-tighter">Temas de Interés</p>
                   <div className="flex flex-wrap justify-center gap-2">
                      {m.commonTopics?.length > 0 ? m.commonTopics.map((t: string) => (
                        <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-blue-300 uppercase">
                          {t}
                        </span>
                      )) : <span className="text-[9px] text-gray-700">Explorando...</span>}
                   </div>
                </div>

                {/* Botón Acción */}
                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-pink-600 hover:to-violet-600 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all duration-500 shadow-lg shadow-blue-900/40 uppercase">
                  Establecer Conexión
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
              <p className="text-gray-600 font-mono tracking-widest">NO SE DETECTARON NODOS COMPATIBLES</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}