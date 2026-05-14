"use client"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function MessagesPage() {
  const { user } = useUser()
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargamos solo los matches aceptados (confirmados)
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
    <div className="h-[90vh] bg-[#05070a] text-white flex overflow-hidden p-4 gap-4 relative">
      {/* Luces de fondo sutiles */}
      <div className="absolute top-[-10%] right-[20%] w-64 h-64 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* PANEL IZQUIERDO: LISTA DE CONECTADOS (MATCHES ACEPTADOS) */}
      <aside className="w-80 bg-[#0a0f1a]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-black italic tracking-tighter uppercase">
            Mis <span className="text-pink-500">Enlaces</span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {loading ? (
            <p className="text-[10px] text-gray-600 text-center uppercase tracking-widest mt-10">Sincronizando...</p>
          ) : matches.length > 0 ? (
            matches.map((match: any) => (
              <div 
                key={match.id}
                onClick={() => setSelectedChat(match)}
                className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                  selectedChat?.id === match.id 
                  ? 'bg-gradient-to-r from-pink-600/10 to-violet-600/10 border-pink-500/30' 
                  : 'bg-white/5 border-transparent hover:border-white/10'
                }`}
              >
                <div className="relative">
                  <img src={match.imageUrl} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0f1a] shadow-[0_0_5px_#22c55e]" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-sm truncate">{match.name}</p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-tighter truncate">{match.career}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="mt-10 text-center px-6">
              <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest leading-relaxed">
                No hay enlaces activos. <br/> Ve a matches para conectar.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* PANEL DERECHO: VENTANA DE CHAT */}
      <main className="flex-1 bg-[#0a0f1a]/40 backdrop-blur-xl border border-white/5 rounded-[3.5rem] flex flex-col relative overflow-hidden">
        {selectedChat ? (
          <>
            {/* Header del Chat */}
            <header className="p-6 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
              <img src={selectedChat.imageUrl} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="font-black text-sm uppercase tracking-wider">{selectedChat.name}</p>
                <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Enlace Establecido</p>
              </div>
            </header>

            {/* Mensajes (Simulados) */}
            <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
              <div className="self-center py-1 px-4 bg-white/5 rounded-full border border-white/5 text-[9px] text-gray-500 font-black uppercase tracking-widest">
                Inicio de transmisión segura
              </div>
              
              <div className="max-w-[70%] bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                <p className="text-sm text-gray-300">¡Hola! Vi que compartimos interés en {selectedChat.career}. ¿En qué nivel estás?</p>
              </div>

              <div className="max-w-[70%] self-end bg-gradient-to-r from-pink-600/20 to-blue-600/20 border border-pink-500/20 p-4 rounded-2xl rounded-tr-none">
                <p className="text-sm text-white font-medium">Hola, ¡qué bueno conectar! Estoy en el Nodo de Programación Avanzada.</p>
              </div>
            </div>

            {/* Input de Mensaje */}
            <div className="p-8 pt-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-blue-600 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-500" />
                <div className="relative flex items-center bg-[#05070a] border border-white/10 rounded-2xl overflow-hidden">
                  <input 
                    className="flex-1 bg-transparent p-5 outline-none text-sm font-medium placeholder:text-gray-700" 
                    placeholder="Escribir mensaje cifrado..." 
                  />
                  <button className="px-8 h-full bg-gradient-to-r from-pink-600 to-blue-600 text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110">
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
            <div className="w-20 h-20 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl animate-pulse">💬</span>
            </div>
            <p className="text-[10px] font-black tracking-[0.4em] uppercase">Selecciona un nodo de comunicación para iniciar el enlace</p>
          </div>
        )}
      </main>
    </div>
  )
}