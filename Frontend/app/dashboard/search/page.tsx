"use client"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function SearchPage() {
  const { user } = useUser()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<string | null>(null); // Para el estado de carga del botón

  useEffect(() => {
    if (!user) return
    fetch(`https://unimatch-backend-vy3b.onrender.com/api/matches/panel/${user.id}`)
      .then(res => res.json())
      .then(json => {
        setSuggestions(json.suggestions || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  // FUNCIÓN PARA ENVIAR SOLICITUD DE MATCH
  const handleMatchRequest = async (targetId: string) => {
    if (!user) return;
    setSendingId(targetId);
    
    try {
      const response = await fetch("https://unimatch-backend-vy3b.onrender.com/api/matches/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromId: user.id,
          toId: targetId
        }),
      });

      if (response.ok) {
        // Filtramos la sugerencia de la lista una vez enviado el match
        setSuggestions(prev => prev.filter((item: any) => item.id !== targetId));
        alert("¡Solicitud de Match enviada con éxito!");
      }
    } catch (error) {
      console.error("Error al enviar match:", error);
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            <p className="text-[10px] tracking-[0.4em] text-gray-400 font-black uppercase">Localizador de Nodos</p>
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter leading-tight mb-4">
            Explorar <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-500 to-blue-400">Red</span>
          </h1>
          <p className="text-gray-500 font-medium tracking-wide text-lg">En busca de tu nuevo match de estudio</p>
        </div>

        <div className="relative group mb-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-violet-600 to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
          <div className="relative flex items-center bg-[#0a0f1a]/80 backdrop-blur-2xl rounded-[2.5rem] p-3 border border-white/10 shadow-2xl">
            <div className="ml-8 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
              type="text"
              placeholder="Materia, carrera o nombre del compañero..." 
              className="w-full bg-transparent p-6 outline-none text-sm font-bold placeholder:text-gray-700 tracking-tight"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-900/30">
              Buscar
            </button>
          </div>
        </div>

        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">Sugerencias de Red Actualizadas</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
               <div className="col-span-full py-20 text-center">
                  <div className="inline-block w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((m: any) => (
                <div key={m.id} className="group relative bg-[#0a0f1a]/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 hover:border-pink-500/30 transition-all duration-500">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="absolute -inset-2 bg-gradient-to-tr from-pink-500 to-blue-500 rounded-[2rem] blur opacity-10 group-hover:opacity-40 transition duration-500"></div>
                      <img src={m.imageUrl} className="relative w-28 h-28 rounded-[2rem] object-cover border border-white/10 shadow-2xl" />
                    </div>
                    
                    <h3 className="text-xl font-black mb-1 group-hover:text-pink-400 transition-colors">{m.name}</h3>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-6">{m.career}</p>

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                      {m.commonTopics?.slice(0, 2).map((t: string) => (
                        <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-gray-400 uppercase">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* BOTÓN DE MATCH FUNCIONAL */}
                    <button 
                      onClick={() => handleMatchRequest(m.id)}
                      disabled={sendingId === m.id}
                      className={`w-full py-4 rounded-2xl font-black text-[9px] tracking-[0.2em] uppercase transition-all duration-500 border border-white/10 ${
                        sendingId === m.id 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-white/5 hover:bg-gradient-to-r hover:from-pink-600 hover:to-blue-600'
                      }`}
                    >
                      {sendingId === m.id ? 'Enviando...' : 'Hacer Match'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center opacity-30">
                <p className="text-[10px] font-black tracking-[0.4em] uppercase">No se detectaron coincidencias</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}