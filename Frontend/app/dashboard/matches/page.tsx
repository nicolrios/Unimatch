"use client"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function MatchesPage() {
  const { user } = useUser()
  const [requests, setRequests] = useState([])
  const [activeMatches, setActiveMatches] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!user) return
    try {
      const res = await fetch(`https://unimatch-backend-vy3b.onrender.com/api/matches/panel/${user.id}`)
      const data = await res.json()
      setRequests(data.requests || [])
      setActiveMatches(data.active || [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [user])

  const handleAccept = async (fromId: string) => {
    const res = await fetch("https://unimatch-backend-vy3b.onrender.com/api/matches/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromId, toId: user?.id })
    })
    if (res.ok) loadData()
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-10 relative overflow-hidden">
      {/* Luces de fondo originales */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/5 rounded-full blur-[120px]" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* HEADER ORIGINAL */}
        <div className="mb-16">
          <p className="text-[10px] font-black text-pink-500 tracking-[0.4em] uppercase mb-2">Panel de Sincronización</p>
          <h1 className="text-6xl font-black italic tracking-tighter">Mis <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Matches</span></h1>
        </div>

        {/* SECCIÓN SOLICITUDES - ESTÉTICA CAPSULA */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Solicitudes Recibidas</h2>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.length > 0 ? requests.map((req: any) => (
              <div key={req.id} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-violet-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative bg-[#0a0f1a] border border-white/10 rounded-[2.5rem] p-8 flex items-center gap-6">
                  <img src={req.imageUrl} className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
                  <div className="flex-1">
                    <h3 className="text-xl font-black">{req.name}</h3>
                    <p className="text-[9px] text-pink-500 font-black uppercase tracking-widest mb-4">{req.career}</p>
                    <button 
                      onClick={() => handleAccept(req.id)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      Aceptar Enlace
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full border-2 border-dashed border-white/5 rounded-[3rem] py-16 flex items-center justify-center opacity-30 text-[10px] font-black uppercase tracking-widest">
                Sin solicitudes pendientes
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN CONFIRMADOS - ESTÉTICA CAPSULA */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Enlaces Confirmados</h2>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeMatches.length > 0 ? activeMatches.map((match: any) => (
              <div key={match.id} className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 flex flex-col items-center text-center hover:border-blue-500/30 transition-all">
                <img src={match.imageUrl} className="w-16 h-16 rounded-xl object-cover mb-4 grayscale hover:grayscale-0 transition-all" />
                <h4 className="font-bold text-sm">{match.name}</h4>
                <p className="text-[8px] text-blue-400 font-black uppercase tracking-tighter mb-4">{match.career}</p>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-[7px] font-black text-blue-400 uppercase">Activo</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full border-2 border-dashed border-white/5 rounded-[3rem] py-16 flex items-center justify-center opacity-30 text-[10px] font-black uppercase tracking-widest text-center">
                No tienes matches activos.<br/>Usa el buscador para conectar.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}