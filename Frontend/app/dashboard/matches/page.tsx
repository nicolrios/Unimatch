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
      <p className="text-blue-500 font-black tracking-[0.5em] animate-pulse uppercase text-xs">Sincronizando Nodos...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6 md:p-12">
      
      {/* HEADER ESTILO PERFIL */}
      <div className="max-w-6xl mx-auto mb-12">
        <p className="text-[10px] tracking-[0.3em] text-blue-400 font-black mb-2 uppercase">Conexiones de Red Activas</p>
        <h1 className="text-5xl font-black italic">
          Mis <span className="text-blue-500">Matches</span>
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA 1: MATCHES ACTIVOS */}
        <section className="bg-[#0a0f1a] border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="text-green-500 text-[10px] font-black tracking-widest mb-8 uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Matches Confirmados
          </h3>
          <div className="space-y-4">
            {data.active.length > 0 ? data.active.map((m: any) => (
              <div key={m.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:border-green-500/30 transition-all">
                <img src={m.imageUrl} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                <div>
                  <p className="font-bold text-sm">{m.name}</p>
                  <p className="text-[9px] text-gray-500 uppercase font-black">{m.career}</p>
                </div>
              </div>
            )) : <p className="text-gray-600 text-xs italic text-center py-4">No hay conexiones activas en este nodo.</p>}
          </div>
        </section>

        {/* COLUMNA 2: SOLICITUDES */}
        <section className="bg-[#0a0f1a] border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="text-yellow-500 text-[10px] font-black tracking-widest mb-8 uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span> Solicitudes Recibidas
          </h3>
          <div className="space-y-4">
            {data.requests.length > 0 ? data.requests.map((m: any) => (
              <div key={m.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={m.imageUrl} className="w-10 h-10 rounded-xl" />
                  <p className="font-bold text-xs">{m.name}</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-[9px] font-black px-3 py-2 rounded-lg transition-all uppercase">Aceptar</button>
              </div>
            )) : <p className="text-gray-600 text-xs italic text-center py-4">Sin solicitudes pendientes de enlace.</p>}
          </div>
        </section>

        {/* COLUMNA 3: SUGERENCIAS (LA MÁS ESTÉTICA) */}
        <section className="bg-[#0a0f1a] border border-blue-500/10 rounded-[2.5rem] p-8 shadow-[0_0_40px_rgba(37,99,235,0.05)] relative overflow-hidden">
          {/* Luz de fondo sutil solo para sugerencias */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-[50px] pointer-events-none" />
          
          <h3 className="text-blue-400 text-[10px] font-black tracking-widest mb-8 uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span> Sugerencias de Red
          </h3>
          <div className="space-y-6">
            {data.suggestions.length > 0 ? data.suggestions.map((m: any) => (
              <div key={m.id} className="group bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:border-blue-500/40 transition-all duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img src={m.imageUrl} className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 border-2 border-[#0a0f1a] rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight">{m.name}</p>
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">{m.career}</p>
                  </div>
                </div>
                
                {/* Etiquetas de temas en común */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {m.commonTopics && m.commonTopics.length > 0 ? m.commonTopics.slice(0, 2).map((t: string) => (
                    <span key={t} className="text-[8px] bg-blue-500/10 text-blue-300 px-2 py-1 rounded-md border border-blue-500/20 font-black uppercase">
                      #{t}
                    </span>
                  )) : <span className="text-[8px] text-gray-600 uppercase font-black">Sin temas vinculados</span>}
                </div>

                <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl transition-all shadow-lg shadow-blue-900/20 uppercase tracking-widest">
                  Establecer Conexión
                </button>
              </div>
            )) : <p className="text-gray-600 text-xs italic text-center py-4">Escaneando nuevos nodos...</p>}
          </div>
        </section>

      </div>
    </div>
  )
}