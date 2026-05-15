"use client"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function MatchesPage() {
  const { user } = useUser()
  const [requests, setRequests] = useState([])
  const [activeMatches, setActiveMatches] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. CARGAR DATOS DEL PANEL
  const loadData = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch(`https://unimatch-backend-vy3b.onrender.com/api/matches/panel/${user.id}`)
      const data = await res.json()
      setRequests(data.requests || [])
      setActiveMatches(data.active || [])
    } catch (e) {
      console.error("Error cargando matches:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [user])

  // 2. LÓGICA PARA ACEPTAR SOLICITUD
  const handleAccept = async (fromId: string) => {
    try {
      const res = await fetch("https://unimatch-backend-vy3b.onrender.com/api/matches/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromId, toId: user?.id })
      })
      if (res.ok) {
        alert("¡Enlace Confirmado! Ya puedes enviar mensajes.")
        loadData() // Recargamos para que pase a la lista de activos
      }
    } catch (e) { console.error(e) }
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-8 md:p-12 relative overflow-hidden font-sans">
      {/* Glows de fondo */}
      <div className="absolute top-[-10%] left-[-5%] w-80 h-80 bg-pink-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-16">
          Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Enlaces</span>
        </h1>

        {/* SECCIÓN A: SOLICITUDES RECIBIDAS (NUEVAS) */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-pink-500">Solicitudes Entrantes</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-pink-500/30 to-transparent" />
            <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-lg text-[10px] font-black">{requests.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.length > 0 ? requests.map((req: any) => (
              <div key={req.id} className="bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center">
                <img src={req.imageUrl} className="w-20 h-20 rounded-2xl object-cover mb-4 border border-white/10 shadow-lg" />
                <h3 className="font-black text-lg">{req.name}</h3>
                <p className="text-[9px] text-gray-500 font-bold uppercase mb-6 tracking-widest">{req.career}</p>
                <button 
                  onClick={() => handleAccept(req.id)}
                  className="w-full py-4 bg-gradient-to-r from-pink-600 to-violet-600 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-pink-900/20"
                >
                  Confirmar Enlace
                </button>
              </div>
            )) : (
              <div className="col-span-full py-12 border-2 border-dashed border-white/5 rounded-[3rem] flex items-center justify-center opacity-30 text-[10px] font-black uppercase tracking-widest">
                Sin solicitudes pendientes
              </div>
            )}
          </div>
        </section>

        {/* SECCIÓN B: MATCHES CONFIRMADOS (ACTIVOS) */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400">Nodos Confirmados</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-400/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMatches.length > 0 ? activeMatches.map((match: any) => (
              <div key={match.id} className="group relative bg-[#0a0f1a]/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-6 flex items-center gap-5 hover:border-blue-500/30 transition-all">
                <img src={match.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{match.name}</h3>
                  <p className="text-[8px] text-blue-400 font-black uppercase tracking-tighter mb-2">{match.career}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[7px] font-black text-gray-500 uppercase">Enlace Activo</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 border-2 border-dashed border-white/5 rounded-[3rem] flex items-center justify-center opacity-30 text-[10px] font-black uppercase tracking-widest text-center leading-relaxed">
                No tienes matches activos.<br/>Usa el buscador para conectar.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}