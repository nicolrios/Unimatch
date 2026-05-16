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
    <div className="min-h-screen bg-[#05070a] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(236,72,153,0.05),transparent_70%)]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="relative mb-20 text-center md:text-left">
          <div className="inline-block px-6 py-2 mb-6 rounded-2xl border border-pink-500/30 bg-pink-500/5 backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.2)]">
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-pink-400">Encuentra tu match perfecto</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black text-gray-500 tracking-[0.8em] uppercase ml-1">Panel de Sincronización</p>
            <h1 className="text-7xl font-black italic tracking-tighter leading-none">
              Mis <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]">Matches</span>
            </h1>
          </div>
        </div>

        {/* MATCHES PENDIENTES */}
        <div className="mb-24">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-pink-500">Matches Pendientes</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-pink-500/50 via-pink-500/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-10"><div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin inline-block"></div></div>
            ) : requests.length > 0 ? requests.map((req: any) => (
              <div key={req.id} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-violet-600 rounded-[3rem] blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
                <div className="relative bg-[#0a0f1a]/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 flex items-center gap-8 overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-pink-600/5 rounded-full blur-3xl group-hover:bg-pink-600/10 transition-all"></div>
                  
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl uppercase text-pink-500 shadow-inner">{req.name?.charAt(0)}</div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-1 group-hover:text-pink-400 transition-colors">{req.name}</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{req.career}</p>
                    <p className="text-[9px] text-pink-500/70 font-black uppercase tracking-wider mb-4">{req.university}</p>
                    <button onClick={() => handleAccept(req.id)} className="relative px-8 py-3 bg-pink-600/10 hover:bg-pink-600 border border-pink-500/30 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500">Aceptar Enlace</button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full border border-white/5 bg-white/[0.02] rounded-[4rem] py-24 flex flex-col items-center justify-center gap-6 opacity-40 italic"><p className="text-[11px] font-black uppercase tracking-[0.5em]">Sin solicitudes en este sector de la red</p></div>
            )}
          </div>
        </div>

        {/* MATCHES CONFIRMADOS */}
        <div>
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-blue-400">Matches Confirmados</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/50 via-blue-500/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-10"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin inline-block"></div></div>
            ) : activeMatches.length > 0 ? activeMatches.map((match: any) => (
              <div key={match.id} className="relative group bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 flex flex-col items-center text-center transition-all duration-700 hover:bg-blue-600/5 hover:border-blue-500/30">
                
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl uppercase text-blue-400 mb-4">{match.name?.charAt(0)}</div>
                
                <h4 className="text-lg font-black mb-1">{match.name}</h4>
                <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest">{match.career}</p>
                <p className="text-[8px] text-gray-500 font-bold uppercase mb-6 tracking-wider">{match.university}</p>
                
                <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_5px_#3b82f6]" />
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">Enlace Activo</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full border border-white/5 rounded-[4rem] py-20 flex flex-col items-center justify-center opacity-30"><p className="text-[10px] font-black uppercase tracking-[0.4em] text-center leading-loose">No tienes matches activos.<br/>Usa el buscador para conectar con la red.</p></div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}