"use client"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function MessagesPage() {
  const { user } = useUser()
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch(`https://unimatch-backend-vy3b.onrender.com/api/matches/panel/${user.id}`)
      .then(res => res.json())
      .then(json => {
        setMatches(json.active || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  return (
    <div className="h-[85vh] bg-[#02040a] text-white flex overflow-hidden p-6 gap-6 relative font-sans">
      
      {/* DECORACIÓN CYBER NEON DE FONDO */}
      <div className="absolute top-[-20%] left-[10%] w-96 h-96 bg-pink-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[5%] w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* PANEL IZQUIERDO: LISTA DE CHATS */}
      <aside className="w-80 bg-[#0a0f1a]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex flex-col shadow-[0_0_30px_rgba(236,72,153,0.05)]">
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">
            Mis <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Chats</span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center mt-10"><div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : matches.length > 0 ? (
            matches.map((match: any) => (
              <div 
                key={match.id}
                onClick={() => setSelectedChat(match)}
                className={`group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-500 overflow-hidden ${
                  selectedChat?.id === match.id 
                  ? 'bg-gradient-to-r from-pink-600/20 to-blue-600/20 border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.15)]' 
                  : 'bg-white/[0.03] border-white/5 hover:border-blue-500/30'
                }`}
              >
                <div className="relative z-10">
                  <img src={match.imageUrl} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-[#0a0f1a] animate-pulse shadow-[0_0_8px_#ec4899]" />
                </div>
                <div className="flex-1 z-10">
                  <p className="font-bold text-sm tracking-tight">{match.name}</p>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">{match.career}</p>
                </div>
                {/* Efecto de escaneo al pasar el mouse */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
              </div>
            ))
          ) : (
            <div className="mt-20 text-center px-10">
              <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.2em] leading-relaxed">
                No hay chats activos. <br/> Matchea con alguien para chatear.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* PANEL DERECHO: INTERFAZ DE COMUNICACIÓN */}
      <main className="flex-1 bg-[#0a0f1a]/50 backdrop-blur-2xl border border-white/10 rounded-[3rem] flex flex-col relative overflow-hidden shadow-2xl">
        
        {selectedChat ? (
          <>
            {/* Cabecera del Chat con Glow */}
            <header className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01] backdrop-blur-md relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-[2px] bg-gradient-to-tr from-pink-500 to-blue-500 rounded-xl">
                    <img src={selectedChat.imageUrl} className="w-10 h-10 rounded-[10px] object-cover bg-[#0a0f1a]" />
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-widest">{selectedChat.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping"></span>
                    <p className="text-[8px] text-pink-400 font-bold uppercase tracking-widest">Enlace Biométrico Establecido</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-gray-500 uppercase">Cifrado de Extremo a Extremo</div>
            </header>

            {/* Burbujas de Chat con Estética Cyber */}
            <div className="flex-1 p-10 overflow-y-auto flex flex-col gap-8 custom-scrollbar relative">
              <div className="self-center py-1.5 px-6 bg-blue-500/10 rounded-full border border-blue-500/20 text-[8px] text-blue-400 font-black uppercase tracking-[0.3em] mb-4">
                Canal Sincronizado
              </div>
              
              {/* Mensaje Entrante */}
              <div className="max-w-[65%] group">
                <div className="flex items-end gap-3">
                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl rounded-bl-none shadow-lg group-hover:border-blue-500/30 transition-all">
                        <p className="text-sm text-gray-200 leading-relaxed font-medium">He analizado tu perfil y tenemos compatibilidad en el nodo de <span className="text-blue-400">"{selectedChat.career}"</span>. ¿Te gustaría colaborar?</p>
                    </div>
                </div>
              </div>

              {/* Mensaje Saliente */}
              <div className="max-w-[65%] self-end">
                <div className="bg-gradient-to-br from-pink-600/20 via-violet-600/20 to-blue-600/20 border border-pink-500/30 p-5 rounded-3xl rounded-br-none shadow-[0_0_20px_rgba(236,72,153,0.1)] transition-all">
                    <p className="text-sm text-white font-medium">Afirmativo. Mi sistema está listo para el intercambio de información. ¿Por dónde empezamos?</p>
                </div>
              </div>
            </div>

            {/* Input de Mensaje Futurista */}
            <div className="p-10 pt-0">
              <div className="relative group">
                <div className="absolute -inset-[2px] bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-700" />
                <div className="relative flex items-center bg-[#05070a] border border-white/10 rounded-2xl overflow-hidden shadow-inner">
                  <input 
                    className="flex-1 bg-transparent p-5 outline-none text-sm font-bold text-white placeholder:text-gray-700 tracking-tight" 
                    placeholder="Inyectar mensaje a la red..." 
                  />
                  <button className="px-10 h-14 bg-gradient-to-r from-pink-600 via-violet-600 to-blue-600 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl">
                    Transmitir
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(236,72,153,0.05)_0%,_transparent_70%)]" />
            <div className="w-24 h-24 border border-white/10 rounded-[2rem] flex items-center justify-center mb-10 relative group">
                <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full animate-pulse" />
                <span className="text-4xl z-10 grayscale group-hover:grayscale-0 transition-all">⚡</span>
            </div>
            <p className="text-[11px] font-black tracking-[0.5em] uppercase text-gray-500 max-w-xs leading-relaxed z-10">
              Selecciona el chat para <span className="text-pink-500">iniciar</span> una conversación.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}