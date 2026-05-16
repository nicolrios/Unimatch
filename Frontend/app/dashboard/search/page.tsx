"use client"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function SearchPage() {
  const { user } = useUser()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [sentMatches, setSentMatches] = useState<string[]>([])
  const [sendingId, setSendingId] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!user) return
    setLoading(true)
    
    const endpoint = query.trim() 
      ? `https://unimatch-backend-vy3b.onrender.com/api/matches/search?clerkId=${user.id}&topic=${query}`
      : `https://unimatch-backend-vy3b.onrender.com/api/matches/panel/${user.id}`

    try {
      const response = await fetch(endpoint)
      const json = await response.json()
      setResults(query.trim() ? json.results : json.suggestions)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { handleSearch() }, [user])

  const handleMatchRequest = async (targetId: string) => {
    if (!user) return
    setSendingId(targetId)
    try {
      const response = await fetch("https://unimatch-backend-vy3b.onrender.com/api/matches/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromId: user.id, toId: targetId }),
      })
      if (response.ok) setSentMatches(prev => [...prev, targetId])
    } catch (error) {
      console.error(error)
    } finally {
      setSendingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <h1 className="text-6xl font-black italic tracking-tighter leading-tight mb-4 uppercase">
            Explorar <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-500 to-blue-400">Red</span>
          </h1>
          <p className="text-gray-500 font-medium tracking-wide text-lg">En busca de tu nuevo match de estudio</p>
        </div>

        <div className="relative group mb-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-violet-600 to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
          <div className="relative flex items-center bg-[#0a0f1a]/80 backdrop-blur-2xl rounded-[2.5rem] p-3 border border-white/10 shadow-2xl">
            <div className="ml-8 text-blue-400 opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Escribe un tema (ej: Cálculo, SQL, Java)..." 
              className="w-full bg-transparent p-6 outline-none text-sm font-bold placeholder:text-gray-700 tracking-tight" 
            />
            <button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.02] shadow-xl shadow-blue-900/30"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-full py-20 text-center"><div className="inline-block w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : results?.length > 0 ? (
            results.map((m: any) => {
              const isSent = sentMatches.includes(m.id);
              return (
                <div key={m.id} className="group relative bg-[#0a0f1a]/60 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 transition-all duration-500 hover:border-blue-500/30">
                  <div className="flex flex-col items-center text-center">
                    <img src={m.imageUrl} className="w-28 h-28 rounded-[2rem] object-cover border border-white/10 shadow-2xl mb-6" />
                    <h3 className="text-xl font-black mb-1 tracking-tight">{m.name}</h3>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">{m.career}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-8">{m.university}</p>

                    {isSent ? (
                      <div className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_#eab308]"></span>
                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em]">En espera de match...</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleMatchRequest(m.id)}
                        disabled={sendingId === m.id}
                        className="w-full py-4 bg-white/5 hover:bg-gradient-to-r hover:from-pink-600 hover:to-blue-600 border border-white/10 rounded-2xl font-black text-[9px] tracking-[0.2em] uppercase transition-all duration-500"
                      >
                        {sendingId === m.id ? 'Sincronizando...' : 'Hacer Match'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-32 border-2 border-dashed border-white/5 rounded-[4rem] flex items-center justify-center opacity-30">
              <p className="text-[10px] font-black tracking-[0.4em] uppercase">No se detectaron nodos con ese tema</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}