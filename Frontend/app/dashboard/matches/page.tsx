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

  if (loading) return <div className="p-20 text-center text-cyan-400 font-black tracking-widest">CARGANDO RED DE NODOS...</div>

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6 md:p-12">
      <h1 className="text-4xl font-black italic mb-10 tracking-tighter">
        Panel de <span className="text-cyan-400">Matches</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA 1: MATCHES ACTIVOS */}
        <section className="bg-[#0a0f1a] border border-white/5 rounded-[2rem] p-6">
          <h3 className="text-green-400 text-[10px] font-black tracking-[0.3em] mb-6 uppercase">● Matches Activos</h3>
          <div className="space-y-4">
            {data.active.length > 0 ? data.active.map((m: any) => (
              <div key={m.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <img src={m.imageUrl} className="w-12 h-12 rounded-xl" />
                <div>
                  <p className="font-bold text-sm">{m.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase">{m.career}</p>
                </div>
              </div>
            )) : <p className="text-gray-600 text-xs italic">No hay conexiones activas.</p>}
          </div>
        </section>

        {/* COLUMNA 2: SOLICITUDES */}
        <section className="bg-[#0a0f1a] border border-white/5 rounded-[2rem] p-6">
          <h3 className="text-yellow-400 text-[10px] font-black tracking-[0.3em] mb-6 uppercase">▲ Solicitudes Recibidas</h3>
          <div className="space-y-4">
            {data.requests.length > 0 ? data.requests.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <img src={m.imageUrl} className="w-10 h-10 rounded-xl" />
                  <p className="font-bold text-sm">{m.name}</p>
                </div>
                <button className="bg-cyan-600 text-[10px] font-bold px-3 py-1 rounded-lg">ACEPTAR</button>
              </div>
            )) : <p className="text-gray-600 text-xs italic">Sin solicitudes pendientes.</p>}
          </div>
        </section>

        {/* COLUMNA 3: SUGERENCIAS */}
        <section className="bg-[#0a0f1a] border border-white/5 rounded-[2rem] p-6 shadow-[0_0_30px_rgba(34,211,238,0.05)]">
          <h3 className="text-cyan-400 text-[10px] font-black tracking-[0.3em] mb-6 uppercase">✧ Sugerencias de Red</h3>
          <div className="space-y-4">
            {data.suggestions.length > 0 ? data.suggestions.map((m: any) => (
              <div key={m.id} className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <img src={m.imageUrl} className="w-12 h-12 rounded-xl" />
                  <div>
                    <p className="font-bold text-sm">{m.name}</p>
                    <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-tighter">{m.career}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {m.commonTopics?.slice(0, 3).map((t: string) => (
                    <span key={t} className="text-[8px] bg-cyan-400/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-400/20 uppercase font-black">
                      {t}
                    </span>
                  ))}
                </div>
                <button className="w-full py-2 bg-white/5 hover:bg-cyan-600 border border-white/10 text-[10px] font-black rounded-xl transition-all">
                  ENVIAR SOLICITUD
                </button>
              </div>
            )) : <p className="text-gray-600 text-xs italic">Buscando nuevos nodos...</p>}
          </div>
        </section>

      </div>
    </div>
  )
}